import React from "react";
import { useLoader } from "../../context/LoaderContext";
import "./Loader.css"; // Import CSS for styling

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null; // If not loading, return nothing

  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
