

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
} from "@mui/material";

const EmployeeLogin = ({ onLogin }) => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        const response = await axios.get("https://rms-m7sb.onrender.com/employee/");
        setTimesheetData(response.data);
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
        setError("Failed to load employee data. Please try again later.");
      }
    };
    fetchTimesheetData();
  }, []);

  const roles = [...new Set(timesheetData.map((emp) => emp.job_role))];

  const handleLogin = () => {
    if (!email || !role) {
      setError("Please enter email and select a role");
      return;
    }

    const user = timesheetData.find(
      (emp) => emp.email === email && emp.job_role === role
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Invalid email or role.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 10 ,borderRadius:"10px"}}>
      <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" sx={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            select
            label="Role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.length > 0 ? (
              roles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No roles available</MenuItem>
            )}
          </TextField>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#2F4F4F" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeLogin;


