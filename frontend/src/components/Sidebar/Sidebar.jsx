import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "../../pages/Dashboard/Dashboard.css"
const Sidebar = ({ onSelectTab, activeTab }) => {
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon sx={{ fontSize: 22 }} />,
      tab: "dashboard",
    },
    {
      text: "Event Management",
      icon: <EventIcon sx={{ fontSize: 22 }} />,
      tab: "events",
    },
    {
      text: "Users",
      icon: <GroupIcon sx={{ fontSize: 22 }} />,
      tab: "users",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Admin Portal</div>
      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            className={`sidebar-item ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => onSelectTab(item.tab)}
            disableRipple
          >
            <ListItemIcon className="sidebar-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: activeTab === item.tab ? 500 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
