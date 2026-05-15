// when it uses localy use localhost 
// When deployed, it will use your live backend URL!
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000/api" 
  : "https://YOUR-LIVE-BACKEND.onrender.com/api"; //update this later with URL

export default API_BASE_URL;