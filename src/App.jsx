// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Timesheet from './Timesheet'
// import Navigationbar from './nav'
// import './index.css'


// function App() {
//   return (
//     <>
//     <Router>
//       <Navigationbar />
//       <Routes>
//         <Route path="/" element={<h1>Home</h1>} />
//         <Route path="/employees" element={<h1>Employee</h1>} />
//         <Route path="/reports" element={<h1>Reports</h1>} />
//         <Route path="/settings" element={<h1>Settings</h1>} />
//         <Route path="/timesheet" element={<Timesheet />} />
//       </Routes>
//     </Router>
//   {/* <Navigationbar/>
//   <Timesheet /> */}
//     </>
//   )
// }

// export default App

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigationbar from "./nav";
import Timesheet from "./Timesheet";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Router>
      <Navigationbar />
      <Container>
        <Routes>
          <Route path="/" element={<Typography variant="h3">Home</Typography>} />
          <Route path="/employees" element={<Typography variant="h3">Employees</Typography>} />
          <Route path="/reports" element={<Typography variant="h3">Reports</Typography>} />
          <Route path="/settings" element={<Typography variant="h3">Settings</Typography>} />
          <Route path="/timesheet" element={<Timesheet />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
