import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";  
import { LoaderProvider } from "./context/LoaderContext";
import SignupPage from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { ToastContainer } from 'react-toastify';

// Protected route for non-authenticated users (Login, Signup)
const AuthRoute = ({ children }) => {
  return localStorage.getItem("token") ? <Navigate to="/dashboard" /> : children;
};

// Protected route for admin-only access (Dashboard)
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Get role from localStorage
  return token && user?.role === "ADMIN" ? children : <Navigate to="/home" />;
};

function App() {
  return (
    <LoaderProvider>
      <Router>
        <Routes>
          {/* Default route (redirect to home if nothing matches) */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Routes available only to non-authenticated users */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />

          {/* Route available to everyone */}
          <Route path="/home" element={<Home />} />

          {/* Admin-only protected route */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

          {/* Catch-all route, redirect to home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </LoaderProvider>
  );
}

export default App;
