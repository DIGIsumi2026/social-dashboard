const express = require('express');
const router = express.Router();
const pool = require('../config/db');
//upload data with company platform
router.post('/', async (req, res) => {
    const { metricType, company, platform, data } = req.body; 
    let rowsProcessed = 0; 

    try {
        await pool.query('BEGIN');
        
        for (const row of data) {
            //look for variations of the word Date
            const dateStr = row['Date'] || row['date'] || row['Date '] || row['Day']; 
            
            if (!dateStr) {
                // Log what the row ACTUALLY looks like so you can debug it in your terminal
                console.log("Skipped a row. Headers found:", Object.keys(row));
                continue; 
            }

            //look for the metric value
            //row['Primary']- pre-proccessor
            const valueStr = row['Value'] || row['value'] || row[metricType] || row['Profile Visits'] || row['Primary'];            const value = parseInt(valueStr) || 0; 

            const query = `
                INSERT INTO account_stats (company, platform, recorded_date, ${metricType}) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (company, platform, recorded_date) 
                DO UPDATE SET ${metricType} = EXCLUDED.${metricType};
            `;
            await pool.query(query, [company, platform, dateStr, value]);
            rowsProcessed++; //successfully queued a row
        }

        //if finished the loop but did 0 work, throw an error
        if (rowsProcessed === 0) {
            await pool.query('ROLLBACK');
            console.error("Upload Failed: No valid 'Date' columns found in the CSV.");
            return res.status(400).json({ error: "CSV Format Error: Make sure your first column is named 'Date'" });
        }

        await pool.query('COMMIT');
        console.log(`Success! Inserted/Updated ${rowsProcessed} rows.`);
        res.status(200).json({ message: `Successfully saved ${rowsProcessed} rows of data!` });
        
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

//GET: Dashboard Totals and Deltas (filtered)
router.get('/totals', async (req, res) => {
    const { company, platform, startDate, endDate } = req.query; 

    try {
        // -- A.calculates the dates for previous period ---
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        //find how many days they selected
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        //shift dates back by that exact amount of days
        const prevEnd = new Date(start);
        prevEnd.setDate(prevEnd.getDate() - 1);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - diffDays);

        //format for PostgreSQL (YYYY-MM-DD)
        const prevStartStr = prevStart.toISOString().split('T')[0];
        const prevEndStr = prevEnd.toISOString().split('T')[0];

        // --- B.query current period ---
        const query = `
            SELECT 
                COALESCE(SUM(views), 0) as views,
                COALESCE(SUM(visits), 0) as visits,
                COALESCE(SUM(viewers), 0) as viewers,
                COALESCE(MAX(followers), 0) as followers,
                COALESCE(SUM(interactions), 0) as interactions
            FROM account_stats
            WHERE company = $1 AND platform = $2 
            AND recorded_date >= $3 AND recorded_date <= $4
        `;
        const currentRes = await pool.query(query, [company, platform, startDate, endDate]);
        const current = currentRes.rows[0];

        // --- C.qurey previos period ---
        const prevRes = await pool.query(query, [company, platform, prevStartStr, prevEndStr]);
        const prev = prevRes.rows[0];

        // --- D. calculate precentages ---
        const calcDelta = (currStr, prevStr) => {
            const c = parseFloat(currStr) || 0;
            const p = parseFloat(prevStr) || 0;
            if (p === 0 && c === 0) return 0;
            if (p === 0) return 100; // 100% growth if previous was 0
            return Math.round(((c - p) / p) * 100);
        };

        const deltas = {
            views: calcDelta(current.views, prev.views),
            visits: calcDelta(current.visits, prev.visits),
            viewers: calcDelta(current.viewers, prev.viewers),
            followers: calcDelta(current.followers, prev.followers), 
            interactions: calcDelta(current.interactions, prev.interactions)
        };

        // --- E.send to the react front end ---
        res.status(200).json({
            total_views: current.views,
            total_visits: current.visits,
            total_viewers: current.viewers,
            followers: current.followers,
            interactions: current.interactions,
            deltas: deltas 
        });

    } catch (error) {
        console.error("Error calculating totals and deltas:", error);
        res.status(500).json({ error: "Failed to fetch totals" });
    }
});

//GET: Time-Series Data for the Graphs (filtered)
//GET: Time-Series Data for the Graphs (filtered by date)
router.get('/charts', async (req, res) => {
    // 1. Catch the dates sent by your React Calendar
    const { company, platform, startDate, endDate } = req.query;
    
    try {
        const query = `
            SELECT 
                to_char(recorded_date, 'Mon DD') as week, 
                MAX(followers) as followers, 
                SUM(interactions) as likes, 
                SUM(visits) as comments 
            FROM account_stats 
            WHERE company = $1 AND platform = $2
            AND recorded_date >= $3 AND recorded_date <= $4 -- 2. Filter by exact dates!
            GROUP BY recorded_date 
            ORDER BY recorded_date ASC 
        `;
        
        //pass the dates into the SQL query
        const result = await pool.query(query, [company, platform, startDate, endDate]);
        res.status(200).json(result.rows);
        
    } catch (error) {
        console.error("Error fetching chart data:", error);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
});

//GET: Pie Chart Breakdown (dynamic beta)
router.get('/pie', async (req, res) => {
    const { company, platform } = req.query;
    try {
        // First, check if this account even has data
        const check = await pool.query('SELECT COUNT(*) FROM account_stats WHERE company = $1 AND platform = $2', [company, platform]);
        if (parseInt(check.rows[0].count) === 0) return res.status(200).json([]); // return empty if no data

        //return a cool platform-specific breakdown
        let pieData = [];
        if (platform === 'Instagram') pieData = [{ name: 'Reels', value: 45 }, { name: 'Static Posts', value: 25 }, { name: 'Carousels', value: 30 }];
        else if (platform === 'Facebook') pieData = [{ name: 'Videos', value: 50 }, { name: 'Static Posts', value: 30 }, { name: 'Links', value: 20 }];
        else pieData = [{ name: 'Articles', value: 60 }, { name: 'Static Posts', value: 40 }];
        
        res.status(200).json(pieData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pie data" });
    }
});

module.exports = router;