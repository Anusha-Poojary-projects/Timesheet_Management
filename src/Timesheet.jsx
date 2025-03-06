import React, { useState } from "react";
import { 
  Container, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Input, Button, Typography, Box, FormControl
} from "@mui/material";
import InitialTimesheetData from "./data";

const Timesheet = () => {
  const [timesheetData, setTimesheetData] = useState(InitialTimesheetData);
  const [searchTerm, setSearchTerm] = useState("");
  const [payTypeFilter, setPayTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;



  const handleChange = (index, field, value) => {
    const updatedData = [...timesheetData];
    updatedData[index][field] = value;
    setTimesheetData(updatedData);
  };

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedData = [...timesheetData];
        updatedData[index].document = e.target.result;
        updatedData[index].fileType = file.type;
        setTimesheetData(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", 
      "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval"
    ];
    
    const csvContent = [
      headers.join(","),
      ...timesheetData.map(emp => [
        emp.name, emp.dateOfJoin, emp.client, emp.email, emp.mobile, `"${emp.location}"`, 
        emp.total, emp.worked, emp.payType, emp.payRate, emp.paidLeave, emp.unpaidLeave, emp.document ? "Yes" : "No"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timesheet_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = timesheetData.filter(employee =>
    (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (payTypeFilter === "" || employee.payType === payTypeFilter)
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Container sx={{ padding: 5 }}>
      <Box display="flex" gap={3} mb={3}>
        <TextField
          label="Search by name, email, or client"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl fullWidth>
          <Select
            value={payTypeFilter}
            onChange={(e) => setPayTypeFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Pay Types</MenuItem>
            <MenuItem value="Hourly">Hourly</MenuItem>
            <MenuItem value="Daily">Daily</MenuItem>
          </Select>
        </FormControl>
        <Button 
        variant="contained" 
        color="primary" 
        onClick={exportToCSV} 
        sx={{backgroundColor:"#A7C7E7", 
        color:"black", fontWeight:"500", paddingRight:"50px", paddingLeft:"50px"}}>
        Export
      </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[ "Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", 
                "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval" 
              ].map((header) => (
                <TableCell 
                key={header} 
                sx={{ minWidth: 150, padding: "8px", backgroundColor: "#A7C7E7", whiteSpace: "nowrap" }}>{header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? currentRows.map((employee, index) => (
              <TableRow key={index} sx={{ height: "20px" }}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.dateOfJoin}</TableCell>
                <TableCell>{employee.client}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.mobile}</TableCell>
                <TableCell 
                sx={{ whiteSpace: "nowrap" }}>{employee.location}
                </TableCell>
                <TableCell>
                  <Input type="number" value={employee.total || ''} onChange={(e) => handleChange(index, "total", e.target.value)} />
                  </TableCell>
                <TableCell>
                  <Input type="number" value={employee.worked || ''} onChange={(e) => handleChange(index, "worked", e.target.value)} />
                  </TableCell>
                <TableCell>
                  <Select value={employee.payType || 'Hourly'} onChange={(e) => handleChange(index, "payType", e.target.value)}>
                    <MenuItem value="Hourly">Hourly</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input type="text" value={employee.payRate || ''} onChange={(e) => handleChange(index, "payRate", e.target.value)} />
                  </TableCell>
                <TableCell>
                  <Input type="number" value={employee.paidLeave || ''} onChange={(e) => handleChange(index, "paidLeave", e.target.value)} />
                  </TableCell>
                <TableCell>
                  <Input type="number" value={employee.unpaidLeave || ''} onChange={(e) => handleChange(index, "unpaidLeave", e.target.value)} />
                  </TableCell>
                <TableCell>
                  <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(index, e)} />
                  {employee.document && (
                    employee.fileType === "application/pdf" ? (
                      <a href={employee.document} target="_blank" rel="noopener noreferrer">📄 View PDF</a>
                    ) : (
                      <img src={employee.document} alt="Uploaded Document" width={50} height={50} />
                    )
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={13} align="center">No employees found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Timesheet;



































//******************************Axios**********************


// import React, { useState, useEffect } from "react";
// import { 
//   Container, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Input, Button, Box, FormControl
// } from "@mui/material";
// import axios from "axios";

// const Timesheet = () => {
//   const [timesheetData, setTimesheetData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [payTypeFilter, setPayTypeFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   // Fetch data on mount
//   useEffect(() => {
//     const fetchTimesheetData = async () => {
//       try {
//         const response = await axios.get("https://rms-m7sb.onrender.com/employee/"); 
//         setTimesheetData(response.data);
//       } catch (error) {
//         console.error("Error fetching timesheet data:", error);
//       }
//     };
//     fetchTimesheetData();
//   }, []);

//   const handleChange = (index, field, value) => {
//     const updatedData = [...timesheetData];
//     updatedData[index][field] = value;
//     setTimesheetData(updatedData);
//   };

//   const handleFileUpload = (index, event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const updatedData = [...timesheetData];
//         updatedData[index].document = e.target.result;
//         updatedData[index].fileType = file.type;
//         setTimesheetData(updatedData);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const exportToCSV = () => {
//     const headers = [
//       "Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", 
//       "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval"
//     ];
    
//     const csvContent = [
//       headers.join(","),
//       ...timesheetData.map(emp => [
//         emp.name, emp.date_of_joinning, emp.client, emp.email, emp.mobile_number, `"${emp.location}"`, 
//         emp.total, emp.worked, emp.payType, emp.payRate, emp.paidLeave, emp.unpaidLeave, emp.document ? "Yes" : "No"
//       ].join(","))
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "timesheet_data.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleSubmit = async (employeeId) => {
//     try {
//       const employeeData = timesheetData.find(emp => emp.id === employeeId);
//       if (!employeeData) {
//         console.error("Employee not found");
//         return;
//       }

//       const response = await axios.put(`https://rms-m7sb.onrender.com/employee/${employeeId}/update`, employeeData); 
//       console.log("Employee data updated:", response.data);
//     } catch (error) {
//       console.error("Error updating employee data:", error);
//     }
//   };

//   const filteredData = timesheetData.filter(employee =>
//     (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
//     (payTypeFilter === "" || employee.payType === payTypeFilter)
//   );

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   return (
//     <Container sx={{ padding: 5 }}>
//       <Box display="flex" gap={3} mb={3}>
//         <TextField
//           label="Search by name, email, or client"
//           variant="outlined"
//           fullWidth
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <FormControl fullWidth>
//           <Select
//             value={payTypeFilter}
//             onChange={(e) => setPayTypeFilter(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">All Pay Types</MenuItem>
//             <MenuItem value="Hourly">Hourly</MenuItem>
//             <MenuItem value="Daily">Daily</MenuItem>
//           </Select>
//         </FormControl>
//         <Button variant="contained" color="primary" onClick={exportToCSV} sx={{backgroundColor:"#A7C7E7", color:"black", fontWeight:"500", paddingRight:"50px", paddingLeft:"50px"}}>
//           Export
//         </Button>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {[
//                 "Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", 
//                 "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval"
//               ].map((header) => (
//                 <TableCell key={header} sx={{ minWidth: 150, padding: "8px", backgroundColor: "#A7C7E7", whiteSpace: "nowrap" }}>{header}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {currentRows.length > 0 ? currentRows.map((employee, index) => (
//               <TableRow key={index} sx={{ height: "20px" }}>
//                 <TableCell>{employee.name}</TableCell>
//                 <TableCell>{employee.date_of_joinning}</TableCell>
//                 <TableCell>{employee.client}</TableCell>
//                 <TableCell>{employee.email}</TableCell>
//                 <TableCell>{employee.mobile_number}</TableCell>
//                 <TableCell sx={{ whiteSpace: "nowrap" }}>{employee.location}</TableCell>
//                 <TableCell><Input type="number" value={employee.total || ''} onChange={(e) => handleChange(index, "total", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.worked || ''} onChange={(e) => handleChange(index, "worked", e.target.value)} /></TableCell>
//                 <TableCell>
//                   <Select value={employee.payType || 'Hourly'} onChange={(e) => handleChange(index, "payType", e.target.value)}>
//                     <MenuItem value="Hourly">Hourly</MenuItem>
//                     <MenuItem value="Daily">Daily</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell><Input type="text" value={employee.payRate || ''} onChange={(e) => handleChange(index, "payRate", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.paidLeave || ''} onChange={(e) => handleChange(index, "paidLeave", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.unpaidLeave || ''} onChange={(e) => handleChange(index, "unpaidLeave", e.target.value)} /></TableCell>
//                 <TableCell>
//                   <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(index, e)} />
//                   {employee.document && (
//                     employee.fileType === "application/pdf" ? (
//                       <a href={employee.document} target="_blank" rel="noopener noreferrer">📄 View PDF</a>
//                     ) : (
//                       <img src={employee.document} alt="Uploaded Document" width={50} height={50} />
//                     )
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => handleSubmit(employee.id)} 
//                     sx={{ marginTop: 2 }}
//                   >
//                     Update
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             )) : (
//               <TableRow><TableCell colSpan={13} align="center">No employees found</TableCell></TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default Timesheet;


//******************************Axios**********************




// import React, { useState, useEffect } from "react";
// import { 
//   Container, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Input, Button, Box, FormControl
// } from "@mui/material";
// import axios from "axios";

// const Timesheet = () => {
//   const [timesheetData, setTimesheetData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [payTypeFilter, setPayTypeFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   useEffect(() => {
//     const fetchTimesheetData = async () => {
//       try {
//         const response = await axios.get("https://rms-m7sb.onrender.com/employee/"); 
//         const formattedData = response.data.map(emp => ({
//           id: emp.id,
//           name: emp.name,
//           date_of_joinning: emp.date_of_joinning,
//           client: emp.client,
//           email: emp.email,
//           mobile_number: emp.mobile_number,
//           location: emp.location,
//           total: "", 
//           worked: "", 
//           payType: "Hourly", 
//           payRate: "", 
//           paidLeave: "", 
//           unpaidLeave: "", 
//           document: "", 
//           fileType: ""
//         }));
//         setTimesheetData(formattedData);
//       } catch (error) {
//         console.error("Error fetching timesheet data:", error);
//       }
//     };
//     fetchTimesheetData();
//   }, []);

//   const handleChange = (index, field, value) => {
//     const updatedData = [...timesheetData];
//     updatedData[index][field] = value;
//     setTimesheetData(updatedData);
//   };

//   const handleSubmit = async (employeeId) => {
//     try {
//       const employeeData = timesheetData.find(emp => emp.id === employeeId);
//       if (!employeeData) {
//         console.error("Employee not found");
//         return;
//       }

//       const updatedFields = {
//         total: employeeData.total,
//         worked: employeeData.worked,
//         payType: employeeData.payType,
//         payRate: employeeData.payRate,
//         paidLeave: employeeData.paidLeave,
//         unpaidLeave: employeeData.unpaidLeave,
//         document: employeeData.document,
//       };

//       const response = await axios.put(`https://rms-m7sb.onrender.com/employee/${employeeId}/update`, updatedFields);
//       console.log("Employee data updated:", response.data);
//     } catch (error) {
//       console.error("Error updating employee data:", error);
//     }
//   };

//   return (
//     <Container sx={{ padding: 5 }}>
//       <Box display="flex" gap={3} mb={3}>
//         <TextField
//           label="Search by name, email, or client"
//           variant="outlined"
//           fullWidth
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <FormControl fullWidth>
//           <Select
//             value={payTypeFilter}
//             onChange={(e) => setPayTypeFilter(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">All Pay Types</MenuItem>
//             <MenuItem value="Hourly">Hourly</MenuItem>
//             <MenuItem value="Daily">Daily</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {["Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval"].map((header) => (
//                 <TableCell key={header} sx={{ minWidth: 150, padding: "8px", backgroundColor: "#A7C7E7", whiteSpace: "nowrap" }}>{header}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {timesheetData.map((employee, index) => (
//               <TableRow key={index}>
//                 <TableCell>{employee.name}</TableCell>
//                 <TableCell>{employee.date_of_joinning}</TableCell>
//                 <TableCell>{employee.client}</TableCell>
//                 <TableCell>{employee.email}</TableCell>
//                 <TableCell>{employee.mobile_number}</TableCell>
//                 <TableCell>{employee.location}</TableCell>
//                 <TableCell><Input type="number" value={employee.total} onChange={(e) => handleChange(index, "total", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.worked} onChange={(e) => handleChange(index, "worked", e.target.value)} /></TableCell>
//                 <TableCell>
//                   <Select value={employee.payType} onChange={(e) => handleChange(index, "payType", e.target.value)}>
//                     <MenuItem value="Hourly">Hourly</MenuItem>
//                     <MenuItem value="Daily">Daily</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell><Input type="text" value={employee.payRate} onChange={(e) => handleChange(index, "payRate", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.paidLeave} onChange={(e) => handleChange(index, "paidLeave", e.target.value)} /></TableCell>
//                 <TableCell><Input type="number" value={employee.unpaidLeave} onChange={(e) => handleChange(index, "unpaidLeave", e.target.value)} /></TableCell>
//                 <TableCell>
//                   <Button variant="contained" color="primary" onClick={() => handleSubmit(employee.id)}>
//                     Update
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default Timesheet;
