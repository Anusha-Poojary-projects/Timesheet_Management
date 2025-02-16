// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import "./nav.css";

// const Navigationbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="nav-logo">Timesheet App</div>
//         <ul className="nav-links">
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/employees">Employees</Link></li>
//           <li><Link to="/reports">Reports</Link></li>
//           <li><Link to="/settings">Settings</Link></li>
//           <li><Link to="/timesheet">Timesheet</Link></li>
//         </ul>
//         <button className="menu-btn" onClick={toggleSidebar}>&#9776;</button>
//       </nav>

//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         <button className="close-btn" onClick={toggleSidebar}>&times;</button>
//         <ul className="sidebar-links">
//           <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
//           <li><Link to="/employees" onClick={toggleSidebar}>Employees</Link></li>
//           <li><Link to="/reports" onClick={toggleSidebar}>Reports</Link></li>
//           <li><Link to="/settings" onClick={toggleSidebar}>Settings</Link></li>
//           <li><Link to="/timesheet" onClick={toggleSidebar}>Timesheet</Link></li>
//         </ul>
//       </div>
      
//       {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
//     </>
//   );
// };

// export default Navigationbar;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navigationbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Timesheet App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/employees">
            Employees
          </Button>
          <Button color="inherit" component={Link} to="/reports">
            Reports
          </Button>
          <Button color="inherit" component={Link} to="/settings">
            Settings
          </Button>
          <Button color="inherit" component={Link} to="/timesheet">
            Timesheet
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem>
            <IconButton onClick={toggleDrawer} sx={{ ml: "auto" }}>
              <CloseIcon />
            </IconButton>
          </ListItem>
          <ListItemButton component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/employees" onClick={toggleDrawer}>
            <ListItemText primary="Employees" />
          </ListItemButton>
          <ListItemButton component={Link} to="/reports" onClick={toggleDrawer}>
            <ListItemText primary="Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/settings" onClick={toggleDrawer}>
            <ListItemText primary="Settings" />
          </ListItemButton>
          <ListItemButton component={Link} to="/timesheet" onClick={toggleDrawer}>
            <ListItemText primary="Timesheet" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default Navigationbar;
