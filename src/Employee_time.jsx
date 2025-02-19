import { useState } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Button } from "@mui/material";
import InitialTimesheetData from './data'
export default function EmployeeTime() {
  const [formData, setFormData] = useState({
    employeeName: "",
    role: "",
    team: "",
    managerName: "",
    weekBeginning: "",
    hours: {
      Mon: "",
      Tue: "",
      Wed: "",
      Thu: "",
      Fri: "",
      Sat: "",
      Sun: ""
    }
  });
  
  const [timesheetData, setTimesheetData] = useState(InitialTimesheetData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.hours) {
      setFormData({
        ...formData,
        hours: { ...formData.hours, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    const newEntry = {
      name: formData.employeeName,
      role: formData.role,
      team: formData.team,
      managerName: formData.managerName,
      weekBeginning: formData.weekBeginning,
      total: 7,
      worked: Object.values(formData.hours).reduce((acc, val) => acc + (parseInt(val) || 0), 0),
      payType: "Hourly", 
      payRate: "$20/hr",
      paidLeave: 0,
      unpaidLeave: 0,
      document: null
    };
    setTimesheetData([...timesheetData, newEntry]);
    setFormData({
      employeeName: "",
      role: "",
      team: "",
      managerName: "",
      weekBeginning: "",
      hours: {
        Mon: "",
        Tue: "",
        Wed: "",
        Thu: "",
        Fri: "",
        Sat: "",
        Sun: ""
      }
    });
  };

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>Monthly Timesheet</Typography>
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={6}><TextField fullWidth label="Employee Name" name="employeeName" value={formData.employeeName} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Team" name="team" value={formData.team} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Manager Name" name="managerName" value={formData.managerName} onChange={handleChange} /></Grid>
        <Grid item xs={6}><TextField fullWidth type="date" name="weekBeginning" value={formData.weekBeginning} onChange={handleChange} /></Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(formData.hours).map((day) => (
              <TableRow key={day}>
                <TableCell>{day}</TableCell>
                <TableCell>
                  <TextField fullWidth type="number" name={day} value={formData.hours[day]} onChange={handleChange} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleSubmit} className="mt-4">Submit</Button>
    </div>
  );
}
