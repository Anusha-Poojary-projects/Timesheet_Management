// import React, { useState } from "react";
// import './timesheet.css';
// import InitialTimesheetData from "./data";


// const Timesheet = () => {
//   const [timesheetData, setTimesheetData] = useState(InitialTimesheetData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [payTypeFilter, setPayTypeFilter] = useState(""); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   const handleChange = (index, field, value) => {
//     const updatedData = [...timesheetData];
//     updatedData[index][field] = value;
//     setTimesheetData(updatedData);
//     console.log(timesheetData)
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
//             console.log(timesheetData)
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const filteredData = timesheetData.filter(employee =>
//     (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      employee.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
//     (payTypeFilter === "" || employee.payType === payTypeFilter)
//   );

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   return (
//     <div className="container">
//       <div className="filter-container">
//         <input 
//           type="text"
//           className="search-bar"
//           placeholder="Search by name, email, or client..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select 
//           className="pay-type-filter"
//           value={payTypeFilter}
//           onChange={(e) => setPayTypeFilter(e.target.value)}
//         >
//           <option value="">All Pay Types</option>
//           <option value="Hourly">Hourly</option>
//           <option value="Daily">Daily</option>
//         </select>
//       </div>

//       <div className="table-wrapper">
//         <table className="timesheet-table">
//           <thead>
//             <tr>
//               <th>Employee Name</th>
//               <th>Date of Join</th>
//               <th>Client</th>
//               <th>Email ID</th>
//               <th>Mobile</th>
//               <th>Location</th>
//               <th>Total Days</th>
//               <th>Worked Days</th>
//               <th>Pay Type</th>
//               <th>Pay Rate</th>
//               <th>Paid Leave</th>
//               <th>Unpaid Leave</th>
//               <th>Leave Approval</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRows.length > 0 ? currentRows.map((employee, index) => (
//               <tr key={index}>
//                 <td>{employee.name}</td>
//                 <td>{employee.dateOfJoin}</td>
//                 <td>{employee.client}</td>
//                 <td>{employee.email}</td>
//                 <td>{employee.mobile}</td>
//                 <td>{employee.location}</td>
//                 <td><input type="number" value={employee.total} onChange={(e) => handleChange(index, "total", e.target.value)} /></td>
//                 <td><input type="number" value={employee.worked} onChange={(e) => handleChange(index, "worked", e.target.value)} /></td>
//                 <td>
//                   <select value={employee.payType} onChange={(e) => handleChange(index, "payType", e.target.value)}>
//                     <option value="Hourly">Hourly</option>
//                     <option value="Daily">Daily</option>
//                   </select>
//                 </td>
//                 <td><input type="text" value={employee.payRate} onChange={(e) => handleChange(index, "payRate", e.target.value)} /></td>
//                 <td><input type="number" value={employee.paidLeave} onChange={(e) => handleChange(index, "paidLeave", e.target.value)} /></td>
//                 <td><input type="number" value={employee.unpaidLeave} onChange={(e) => handleChange(index, "unpaidLeave", e.target.value)} /></td>
//                 <td>
//                   <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(index, e)} />
//                   {employee.document && (
//                     employee.fileType === "application/pdf" ? (
//                       <a href={employee.document} target="_blank" rel="noopener noreferrer" className="pdf-link">
//                         📄 View PDF
//                       </a>
//                     ) : (
//                       <img src={employee.document} alt="Uploaded Document" className="uploaded-image" />
//                     )
//                   )}
//                 </td>
//               </tr>
//             )) : (
//               <tr><td colSpan="13" className="no-data">No employees found</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
//         <span> Page {currentPage} </span>
//         <button disabled={indexOfLastRow >= filteredData.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//       </div>
//     </div>
//   );
// };


// export default Timesheet;


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
      <Box display="flex" gap={2} mb={2}>
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
      </Box>
      
      <Button variant="contained" color="primary" onClick={exportToCSV} sx={{ mb: 2 }}>
        Export to CSV
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[ "Employee Name", "Date of Join", "Client", "Email ID", "Mobile", "Location", 
                "Total Days", "Worked Days", "Pay Type", "Pay Rate", "Paid Leave", "Unpaid Leave", "Leave Approval" 
              ].map((header) => (
                <TableCell key={header} sx={{ minWidth: 150, padding: "8px", backgroundColor: "#A7C7E7", whiteSpace: "nowrap" }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? currentRows.map((employee, index) => (
              <TableRow key={index} sx={{ height: "40px" }}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.dateOfJoin}</TableCell>
                <TableCell>{employee.client}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.mobile}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{employee.location}</TableCell>
                <TableCell><Input type="number" value={employee.total || ''} onChange={(e) => handleChange(index, "total", e.target.value)} /></TableCell>
                <TableCell><Input type="number" value={employee.worked || ''} onChange={(e) => handleChange(index, "worked", e.target.value)} /></TableCell>
                <TableCell>
                  <Select value={employee.payType || 'Hourly'} onChange={(e) => handleChange(index, "payType", e.target.value)}>
                    <MenuItem value="Hourly">Hourly</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                  </Select>
                </TableCell>
                <TableCell><Input type="text" value={employee.payRate || ''} onChange={(e) => handleChange(index, "payRate", e.target.value)} /></TableCell>
                <TableCell><Input type="number" value={employee.paidLeave || ''} onChange={(e) => handleChange(index, "paidLeave", e.target.value)} /></TableCell>
                <TableCell><Input type="number" value={employee.unpaidLeave || ''} onChange={(e) => handleChange(index, "unpaidLeave", e.target.value)} /></TableCell>
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
              <TableRow><TableCell colSpan={13} align="center">No employees found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Timesheet;
