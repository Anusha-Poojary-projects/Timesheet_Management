import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigationbar from "./nav";
import Timesheet from "./Timesheet";
import EmployeeTimesheet from './SubmitTimesheet'
import EmployeeTime from './Employee_time'
import { Container, Typography } from "@mui/material";
import EmployeeLogin from "./Log";

function App() {
  return (
    <Router>
      <Navigationbar />
      <Container>
        <Routes>
          <Route path="/home" element={<Typography variant="h3">Home</Typography>} />
          <Route path="/Login" element={<EmployeeLogin/>} />
          <Route path="/EmployeeTime" element={<EmployeeTime/> }/>
          <Route path="/" element={<EmployeeTimesheet/>} />
          <Route path="/timesheet" element={<Timesheet />} /> 
        </Routes>
      </Container> 
    </Router>
  );
}

export default App;
