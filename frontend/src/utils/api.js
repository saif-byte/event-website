import { toast } from 'react-toastify';
import { useLoader } from '../context/LoaderContext';
const API_BASE_URL = "https://sandiegoadventurehub.onrender.com/api";

export const apiCall = async (endpoint, method = "GET", data = null) => {
  
  let token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
  
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    if (response.status == 401) {
    localStorage.clear()
      window.location.href = "/login"; 
      toast.error("Session Expired, Please Login Again", {
        position: "top-center",  // You can change this based on your preference
        autoClose: 5000,        // Time in ms before the toast disappears
        hideProgressBar: true,  // Hide the progress bar
      });     
    }
    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }finally {
    // Stop the loader after request finishes
  
  }
};
