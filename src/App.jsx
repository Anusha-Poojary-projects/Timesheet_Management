
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navigationbar from "./nav";
import Timesheet from "./Timesheet";
import EmployeeTimesheet from "./SubmitTimesheet";
import { Container, Typography } from "@mui/material";
import EmployeeLogin from "./Log";

function App() {
  const [user, setUser] = useState(null); 

  return (
    <Router>
      {user ? (
        <>
          <Navigationbar user={user} setUser={setUser}/>
          <Container>
            <Routes>
              <Route path="/home" element={<Typography variant="h3">Home</Typography>} />
              {user.job_role != "HR" && <Route path="/" element={<EmployeeTimesheet user={user}/>} />}
              {user.job_role === "HR" && <Route path="/timesheet" element={<Timesheet />} />}
            </Routes>
          </Container>
        </>
      ) : (
        <EmployeeLogin onLogin={setUser} />
      )}
    </Router>
  );
}

export default App;
