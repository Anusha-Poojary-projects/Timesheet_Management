import React, { useState } from "react";
import { 
  Container, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Input, Button 
} from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import InitialTimesheetData from "./data";

const Timesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [error, setError] = useState(""); 

const dummyProjects = ["Project A", "Project B", "Project C", "Project D"];


  const handleDateChange = (field, value) => {
    let newDateRange = { ...dateRange, [field]: value };
    if (field === "start") {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      newDateRange.end = endDate.toISOString().split('T')[0];

      const updatedData = Array.from({ length: 7 }, (_, index) => {
        const entryDate = new Date(startDate);
        entryDate.setDate(startDate.getDate() + index);
        return {
          date: entryDate.toISOString().split('T')[0],
          day: entryDate.toLocaleDateString("en-US", { weekday: "long" }),
          project: dummyProjects[0],
          taskDescription: "",
          start: "",
          finish: "",
          totalStandardHours: "9.00",
          overtime: "0",
          sickTime: "0",
          vacation: "0",
          totalHours: "0.00"
        };
      });
      setTimesheetData(updatedData);
    }
    setDateRange(newDateRange);
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...timesheetData];

    if (field === "taskDescription" && value.length > 250) {
      setError("Task description cannot exceed 250 characters.");
      value = value.slice(0, 250); 
    } else {
      setError("");
    }

      if (field === "overtime" || field === "sickTime" || field === "vacation") {
    value = Math.max(0, parseFloat(value) || 0); 
  }

    updatedData[index][field] = value;

    if (field === "start" || field === "finish") {
      const start = updatedData[index].start;
      const finish = updatedData[index].finish;
      if (start && finish) {
        const startTime = new Date(`1970-01-01T${start}:00`);
        const endTime = new Date(`1970-01-01T${finish}:00`);
        let diff = (endTime - startTime) / (1000 * 60 * 60);
        if (diff < 0) diff += 24;
        updatedData[index].totalStandardHours = diff.toFixed(2);
      }
    }

    const totalHours =
      parseFloat(updatedData[index].totalStandardHours || 0) +
      parseFloat(updatedData[index].overtime || 0) -
      parseFloat(updatedData[index].sickTime || 0) -
      parseFloat(updatedData[index].vacation || 0);

    updatedData[index].totalHours = totalHours.toFixed(2);
    setTimesheetData(updatedData);
  };

  const calculateTotalWeeklyHours = () => {
    return timesheetData.reduce((total, entry) => total + parseFloat(entry.totalHours || 0), 0).toFixed(2);
  };

  const handleSubmit = () => {
    InitialTimesheetData.push(...timesheetData);
    console.log("Submitted Data:", InitialTimesheetData);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Day", "Project", "Task Description", "Start", "Finish", "Total Standard Hours", "Overtime (Hours)", "Sick Time (Hours)", "Vacation (Hours)", "Total Hours"];
    const csvRows = [headers.join(",")];

    timesheetData.forEach(row => {
      csvRows.push([ 
        row.date,
        row.day,
        row.project,
        row.taskDescription,
        row.start,
        row.finish,
        row.totalStandardHours,
        row.overtime,
        row.sickTime,
        row.vacation,
        row.totalHours
      ].join(","));
    });

    const totalWeeklyHours = calculateTotalWeeklyHours();
    csvRows.push([ "Total Weekly Hours", "", "", "", "", "", "", "", "", "", totalWeeklyHours ].join(","));

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timesheet.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container sx={{ padding: 5 }}>
      <TextField
        label="Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateRange.start}
        onChange={(e) => handleDateChange("start", e.target.value)}
      />
      <TextField
        label="End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateRange.end}
        disabled
        sx={{ marginLeft: 2 }}
      />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Date", "Day", "Project", "Task Description", "Start", "Finish", "Total Standard Hours", "Overtime (Hours)", "Sick Time (Hours)", "Vacation (Hours)", "Total Hours"].map((header) => (
                <TableCell
        key={header}
        sx={{
          minWidth: 150,
          padding: "8px",
          backgroundColor: "#A7C7E7",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontWeight: "bold"
        }}
      >{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheetData.map((entry, index) => (
              <TableRow key={index} sx={{ height: "40px" }}>
                <TableCell sx={{ textAlign:"center"}} ><Input type="date" value={entry.date} readOnly /></TableCell>
                <TableCell sx={{ textAlign:"center"}} >{entry.day}</TableCell>
                <TableCell sx={{ textAlign:"center"}} >
                  <Select
                    value={entry.project}
                    onChange={(e) => handleChange(index, "project", e.target.value)}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value=""><em>Select Project</em></MenuItem>
                    {dummyProjects.map((project, idx) => (
                      <MenuItem key={idx} value={project}>{project}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                
                <TableCell sx={{ textAlign:"center"}} >
                  <Input
                    type="text"
                    onChange={(e) => handleChange(index, "taskDescription", e.target.value)}
                    inputProps={{ maxLength: 250 }} 
                  />
                  {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>} 
                </TableCell>
                <TableCell sx={{ textAlign:"center"}} ><Input type="time" onChange={(e) => handleChange(index, "start", e.target.value)} /></TableCell>
                <TableCell sx={{ textAlign:"center"}}><Input type="time" onChange={(e) => handleChange(index, "finish", e.target.value)} /></TableCell>
                <TableCell sx={{ textAlign:"center"}}><Input type="text" value={entry.totalStandardHours} readOnly /></TableCell>
                <TableCell sx={{ textAlign:"center"}}>
                  <Input
                    type="number"
                    value={entry.overtime}
                    onChange={(e) => handleChange(index, "overtime", e.target.value)}
                    inputProps={{ min: "0" }} 
                  />
                </TableCell>
                <TableCell sx={{ textAlign:"center"}}>
                  <Input
                    type="number"
                    value={entry.sickTime}
                    onChange={(e) => handleChange(index, "sickTime", e.target.value)}
                    inputProps={{ min: "0" }} 
                  />
                </TableCell>
                <TableCell sx={{ textAlign:"center"}}>
                  <Input
                    type="number"
                    value={entry.vacation}
                    onChange={(e) => handleChange(index, "vacation", e.target.value)}
                    inputProps={{ min: "0" }} 
                  />
                </TableCell>

                <TableCell sx={{ textAlign:"center"}}><Input type="text" value={entry.totalHours} readOnly /></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={10} align="right">Total Weekly Hours:</TableCell>
              <TableCell>{calculateTotalWeeklyHours()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>Submit</Button>
      <Button variant="contained" color="secondary" onClick={exportToCSV} sx={{ marginTop: 2, marginLeft: 2 }}>Export to CSV</Button>
    </Container>
  );
};

export default Timesheet;


























//*************************Axios*********************************** */



// import React, { useState, useEffect } from "react";
// import { 
//   Container, TextField, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Input, Button 
// } from "@mui/material";
// import { Select, MenuItem } from "@mui/material";
// import axios from "axios";

// const Timesheet = () => {
//   const [timesheetData, setTimesheetData] = useState([]);
//   const [projects, setProjects] = useState([]); 
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [error, setError] = useState(""); 
//   const employeeId = 1; 

//   // Fetch both projects and timesheet data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectResponse = await axios.get('https://jsonplaceholder.typicode.com/posts'); 
//         const projectList = projectResponse.data.slice(0, 4); 
//         setProjects(projectList);


//         const timesheetResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${employeeId}`); 
//         const timesheetList = timesheetResponse.data.slice(0, 7); 
//         setTimesheetData(timesheetList.map(entry => ({
//           ...entry,
//           date: new Date().toISOString().split('T')[0],
//           day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
//           totalStandardHours: "9.00",
//           overtime: "0",
//           sickTime: "0",
//           vacation: "0",
//           totalHours: "0.00"
//         })));
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Error fetching data.");
//       }
//     };

//     fetchData();
//   }, [employeeId]); 

//   const handleDateChange = (field, value) => {
//     let newDateRange = { ...dateRange, [field]: value };
//     if (field === "start") {
//       const startDate = new Date(value);
//       const endDate = new Date(startDate);
//       endDate.setDate(startDate.getDate() + 6);
//       newDateRange.end = endDate.toISOString().split('T')[0];

//       const updatedData = Array.from({ length: 7 }, (_, index) => {
//         const entryDate = new Date(startDate);
//         entryDate.setDate(startDate.getDate() + index);
//         return {
//           date: entryDate.toISOString().split('T')[0],
//           day: entryDate.toLocaleDateString("en-US", { weekday: "long" }),
//           project: projects[0] ? projects[0].title : "", 
//           taskDescription: "",
//           start: "",
//           finish: "",
//           totalStandardHours: "9.00",
//           overtime: "0",
//           sickTime: "0",
//           vacation: "0",
//           totalHours: "0.00"
//         };
//       });
//       setTimesheetData(updatedData);
//     }
//     setDateRange(newDateRange);
//   };

//   const handleChange = (index, field, value) => {
//     const updatedData = [...timesheetData];

//     if (field === "taskDescription" && value.length > 250) {
//       setError("Task description cannot exceed 250 characters.");
//       value = value.slice(0, 250); 
//     } else {
//       setError("");
//     }

//     if (field === "overtime" || field === "sickTime" || field === "vacation") {
//       value = Math.max(0, parseFloat(value) || 0); 
//     }

//     updatedData[index][field] = value;

//     if (field === "start" || field === "finish") {
//       const start = updatedData[index].start;
//       const finish = updatedData[index].finish;
//       if (start && finish) {
//         const startTime = new Date(`1970-01-01T${start}:00`);
//         const endTime = new Date(`1970-01-01T${finish}:00`);
//         let diff = (endTime - startTime) / (1000 * 60 * 60);
//         if (diff < 0) diff += 24;
//         updatedData[index].totalStandardHours = diff.toFixed(2);
//       }
//     }

//     const totalHours =
//       parseFloat(updatedData[index].totalStandardHours || 0) +
//       parseFloat(updatedData[index].overtime || 0) - 
//       parseFloat(updatedData[index].sickTime || 0) - 
//       parseFloat(updatedData[index].vacation || 0);

//     updatedData[index].totalHours = totalHours.toFixed(2);
//     setTimesheetData(updatedData);
//   };

//   const calculateTotalWeeklyHours = () => {
//     return timesheetData.reduce((total, entry) => total + parseFloat(entry.totalHours || 0), 0).toFixed(2);
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
//         employeeId, 
//         timesheetData
//       });
//       console.log("Submitted Data:", response.data);
//     } catch (err) {
//       console.error("Error submitting timesheet data:", err);
//       setError("Error submitting timesheet data.");
//     }
//   };

//   const exportToCSV = () => {
//     const headers = ["Date", "Day", "Project", "Task Description", "Start", "Finish", "Total Standard Hours", "Overtime (Hours)", "Sick Time (Hours)", "Vacation (Hours)", "Total Hours"];
//     const csvRows = [headers.join(",")];

//     timesheetData.forEach(row => {
//       csvRows.push([ 
//         row.date,
//         row.day,
//         row.project,
//         row.taskDescription,
//         row.start,
//         row.finish,
//         row.totalStandardHours,
//         row.overtime,
//         row.sickTime,
//         row.vacation,
//         row.totalHours
//       ].join(","));
//     });

//     const totalWeeklyHours = calculateTotalWeeklyHours();
//     csvRows.push([ "Total Weekly Hours", "", "", "", "", "", "", "", "", "", totalWeeklyHours ].join(","));

//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "timesheet.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Container sx={{ padding: 5 }}>
//       <TextField
//         label="Start Date"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         value={dateRange.start}
//         onChange={(e) => handleDateChange("start", e.target.value)}
//       />
//       <TextField
//         label="End Date"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         value={dateRange.end}
//         disabled
//         sx={{ marginLeft: 2 }}
//       />
//       <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {["Date", "Day", "Project", "Task Description", "Start", "Finish", "Total Standard Hours", "Overtime (Hours)", "Sick Time (Hours)", "Vacation (Hours)", "Total Hours"].map((header) => (
//                 <TableCell key={header} sx={{ minWidth: 150, padding: "8px", backgroundColor: "#A7C7E7", whiteSpace: "nowrap" }}>{header}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {timesheetData.map((entry, index) => (
//               <TableRow key={index} sx={{ height: "40px" }}>
//                 <TableCell><Input type="date" value={entry.date} readOnly /></TableCell>
//                 <TableCell>{entry.day}</TableCell>
//                 <TableCell>
//                   <Select
//                     value={entry.project}
//                     onChange={(e) => handleChange(index, "project", e.target.value)}
//                     displayEmpty
//                     fullWidth
//                   >
//                     <MenuItem value=""><em>Select Project</em></MenuItem>
//                     {projects.map((project, idx) => (
//                       <MenuItem key={idx} value={project.title}>{project.title}</MenuItem>
//                     ))}
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <Input
//                     type="text"
//                     onChange={(e) => handleChange(index, "taskDescription", e.target.value)}
//                     inputProps={{ maxLength: 250 }} 
//                   />
//                   {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>} 
//                 </TableCell>
//                 <TableCell><Input type="time" onChange={(e) => handleChange(index, "start", e.target.value)} /></TableCell>
//                 <TableCell><Input type="time" onChange={(e) => handleChange(index, "finish", e.target.value)} /></TableCell>
//                 <TableCell><Input type="text" value={entry.totalStandardHours} readOnly /></TableCell>
//                 <TableCell>
//                   <Input
//                     type="number"
//                     value={entry.overtime}
//                     onChange={(e) => handleChange(index, "overtime", e.target.value)}
//                     inputProps={{ min: "0" }} 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Input
//                     type="number"
//                     value={entry.sickTime}
//                     onChange={(e) => handleChange(index, "sickTime", e.target.value)}
//                     inputProps={{ min: "0" }} 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Input
//                     type="number"
//                     value={entry.vacation}
//                     onChange={(e) => handleChange(index, "vacation", e.target.value)}
//                     inputProps={{ min: "0" }} 
//                   />
//                 </TableCell>

//                 <TableCell><Input type="text" value={entry.totalHours} readOnly /></TableCell>
//               </TableRow>
//             ))}
//             <TableRow>
//               <TableCell colSpan={10} align="right">Total Weekly Hours:</TableCell>
//               <TableCell>{calculateTotalWeeklyHours()}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>Submit</Button>
//       <Button variant="contained" color="secondary" onClick={exportToCSV} sx={{ marginTop: 2, marginLeft: 2 }}>Export to CSV</Button>
//     </Container>
//   );
// };

// export default Timesheet;
