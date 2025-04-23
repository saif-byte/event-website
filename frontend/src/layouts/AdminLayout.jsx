// src/components/layout/AdminLayout.jsx

import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../pages/Header/Header";
const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <>
    <Header />

    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar 
        onSelectTab={setActiveTab} 
        activeTab={activeTab} 
        tabs={["events", "contacts", "users"]} 
      />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
    </>
  );
};

export default AdminLayout;
