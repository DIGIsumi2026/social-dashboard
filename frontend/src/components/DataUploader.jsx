import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import axios from 'axios';
import { ArrowLeft, AlertTriangle, FileText, Trash2, CheckCircle } from 'lucide-react'; 

export default function DataUploader({ onUploadSuccess, onBack }) {
    const [showWarning, setShowWarning] = useState(true); 
    const [selectedFile, setSelectedFile] = useState(null); 
    
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); 
    
    const [company, setCompany] = useState('Sumathi Universal');
    const [platform, setPlatform] = useState('Facebook');
    const [metricType, setMetricType] = useState('views'); 

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false 
    });

    const handleConfirmUpload = () => {
        if (!selectedFile) return;
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            let csvText = event.target.result;
            const lines = csvText.split('\n');
            const headerRowIndex = lines.findIndex(line => line.toLowerCase().includes('date') || line.toLowerCase().includes('"date"'));

            if (headerRowIndex > 0) {
                csvText = lines.slice(headerRowIndex).join('\n');
            }

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        await axios.post('http://localhost:5000/api/upload', { 
                            company, platform, metricType, data: results.data 
                        });
                        
                        showToast(`Success! ${platform} ${metricType} data saved.`);
                        setSelectedFile(null); 
                        if (onUploadSuccess) onUploadSuccess(company, platform, metricType); } 
                        catch (error) {
                        console.error("Upload Error:", error);
                        showToast(error.response?.data?.error || "Failed to upload data.", 'error');
                    } finally {
                        setLoading(false);
                    }
                }
            });
        };
        
        reader.readAsText(selectedFile); 
    };

    return (
        <div style={{ maxWidth: '850px', margin: '40px auto', width: '100%' }}>
            
            {/*warning model -blur screen */}
            {showWarning && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AlertTriangle size={48} color="#F59E0B" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Double Check Fields!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                            Please ensure you select the correct Company, Platform, and Metric Type before dropping a file. Uploading to the wrong profile will overwrite existing data.
                        </p>
                        <button className="primary-btn" onClick={() => setShowWarning(false)}>
                            I Understand, Proceed
                        </button>
                    </div>
                </div>
            )}

            <button 
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 15px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500', width: 'fit-content' }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            {/* main uploader card */}
            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ marginBottom: '25px', color: 'var(--text-primary)' }}>Data Upload Center</h2>
                
                <div style={{ display: 'grid', gap: '20px', marginBottom: '30px', opacity: selectedFile ? 0.5 : 1, pointerEvents: selectedFile ? 'none' : 'auto' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Company Profile</label>
                        <select className="custom-select" style={{ width: '100%', padding: '12px' }} value={company} onChange={(e) => setCompany(e.target.value)}>
                            <option value="Sumathi Universal">Sumathi Universal</option>
                            <option value="Sumathi Ventures">Sumathi Ventures</option>
                            <option value="Octagon Engineering">Octagon Engineering</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Social Platform</label>
                        <select className="custom-select" style={{ width: '100%', padding: '12px' }} value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Metric Type</label>
                        <select className="custom-select" style={{ width: '100%', padding: '12px' }} value={metricType} onChange={(e) => setMetricType(e.target.value)}>
                            <option value="views">Views</option>
                            <option value="followers">Followers</option>
                            <option value="visits">Profile Visits</option>
                            <option value="interactions">Interactions</option>
                            <option value="viewers">Viewers</option>
                        </select>
                    </div>
                </div>

                {!selectedFile ? (
                    <div {...getRootProps()} style={{ border: '2px dashed var(--accent-primary)', padding: '60px 40px', textAlign: 'center', cursor: 'pointer', borderRadius: '8px', backgroundColor: isDragActive ? 'var(--accent-light)' : 'transparent', transition: 'all 0.2s' }}>
                        <input {...getInputProps()} />
                        <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>
                            Drop the {platform} {metricType} CSV here
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>or click to browse files</p>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '25px' }}>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>File Preview</h4>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <FileText size={36} color="var(--accent-primary)" />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedFile.name}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => setSelectedFile(null)}
                                style={{ flex: 1, padding: '14px', border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                            >
                                <Trash2 size={20} /> Remove
                            </button>
                            <button 
                                onClick={handleConfirmUpload}
                                disabled={loading}
                                style={{ flex: 2, padding: '14px', border: 'none', backgroundColor: '#4ADE80', color: '#1B254B', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                            >
                                {loading ? 'Processing...' : <><CheckCircle size={20} /> Confirm Upload</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* tost notification */}
            {toast && (
                <div className={`toast-container ${toast.type === 'error' ? 'error' : ''}`}>
                    <span style={{ fontWeight: '600' }}>{toast.type === 'error' ? 'Oops!' : 'Uploaded!'}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{toast.message}</span>
                    <div className="toast-progress"></div>
                </div>
            )}
        </div>
    );
}