import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventNoteIcon from "@mui/icons-material/EventNote";

const Navigationbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    setUser(null);
    navigate("/Login");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2F4F4F" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "48px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              onClick={toggleDrawer}
              sx={{ color: "white" }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              gap: 2,
            }}
          >
            {user?.job_role !== "HR" && (
              <Button
                component={Link}
                to="/home"
                sx={{
                  color: location.pathname === "/home" ? "#FFD700" : "white",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Home
              </Button>
            )}

            <Button
              component={Link}
              to="/"
              sx={{
                color: location.pathname === "/" ? "#FFD700" : "white",
                textTransform: "none",
                fontSize: "16px",
              }}
            >
              Submit Time
            </Button>

            {user?.job_role === "HR" && (
              <Button
                component={Link}
                to="/timesheet"
                sx={{
                  color:
                    location.pathname === "/timesheet" ? "#FFD700" : "white",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Timesheet
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: "20px",
            }}
          >
            <Button onClick={handleLogout} sx={{ color: "white" }}>
              <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </Button>

            {user?.name && (
              <Avatar sx={{ bgcolor: "#FFD700", color: "#2F4F4F" }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, backgroundColor: "#E5E5E5", height: "100%" }}>
          <List>
            <ListItemButton
              onClick={toggleDrawer}
              sx={{ justifyContent: "flex-end" }}
            >
              <CloseIcon fontSize="large" />
            </ListItemButton>
            <Divider />

            {user?.job_role !== "HR" && (
              <ListItemButton
                component={Link}
                to="/home"
                onClick={toggleDrawer}
              >
                <HomeIcon sx={{ mr: 2 }} />
                <ListItemText primary="Home" />
              </ListItemButton>
            )}

            <ListItemButton component={Link} to="/" onClick={toggleDrawer}>
              <ScheduleIcon sx={{ mr: 2 }} />
              <ListItemText primary="Submit Time" />
            </ListItemButton>

            {user?.job_role === "HR" && (
              <ListItemButton
                component={Link}
                to="/timesheet"
                onClick={toggleDrawer}
              >
                <EventNoteIcon sx={{ mr: 2 }} />
                <ListItemText primary="Timesheet" />
              </ListItemButton>
            )}

            <Divider />
            <ListItemButton onClick={handleLogout}>
              <ExitToAppIcon sx={{ mr: 2 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigationbar;
