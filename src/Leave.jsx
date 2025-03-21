import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Box,
  IconButton,
  Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ApplyLeaveForm = ({ open, onClose }) => {
  const [leaveType, setLeaveType] = useState("");
  const [dateRanges, setDateRanges] = useState([{ startDate: null, endDate: null, dayType: "Full Day" }]);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]); 


  const openDatePicker = (index) => {
    setSelectedIndex(index);
    setIsDatePickerOpen(true);
  };

  const handleDateChange = (date) => {
    const updatedRanges = [...dateRanges];
    if (!updatedRanges[selectedIndex].startDate) {
      updatedRanges[selectedIndex].startDate = date;
    } else {
      updatedRanges[selectedIndex].endDate = date;
      setIsDatePickerOpen(false);
    }
    setDateRanges(updatedRanges);
  };

  const handleAddDate = () => {
    setDateRanges([...dateRanges, { startDate: null, endDate: null, dayType: "Full Day" }]);
  };

  const handleDayTypeChange = (index, newValue) => {
    const updatedRanges = [...dateRanges];
    updatedRanges[index].dayType = newValue;
    setDateRanges(updatedRanges);
  };

  const handleDeleteDate = (index) => {
    const updatedRanges = dateRanges.filter((_, i) => i !== index);
    setDateRanges(updatedRanges);
  };

  const handleSubmit = () => {
    const newRequest = {
    leaveType,
    dateRanges,
    reason,
    file,
  };

setLeaveRequests((prevRequests) => [...prevRequests, newRequest]);

    console.log("Submitted Leave Requests:", leaveRequests);
    console.log("Leave Request Data", { leaveType, dateRanges, reason, file });

    setLeaveType("");
    setDateRanges([{ startDate: null, endDate: null, dayType: "Full Day" }]);
    setReason("");
    setFile(null);

    setTimeout(() => onClose(), 0);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Apply Leave
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <Select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Leave Type</MenuItem>
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Casual Leave">Casual Leave</MenuItem>
              <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            </Select>
          </FormControl>

          {dateRanges.map((item, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                value={
                  item.startDate && item.endDate
                    ? `${item.startDate.toLocaleDateString()} - ${item.endDate.toLocaleDateString()}`
                    : "Select Date Range"
                }
                onClick={() => openDatePicker(index)}
                readOnly
              />

              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={item.dayType}
                  onChange={(e) => handleDayTypeChange(index, e.target.value)}
                >
                  <MenuItem value="Full Day">Full Day</MenuItem>
                  <MenuItem value="Half Day">Half Day</MenuItem>
                </Select>
              </FormControl>

              {dateRanges.length > 1 && (
                <IconButton onClick={() => handleDeleteDate(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          ))}

<Box display="flex" justifyContent="flex-start">
  <Link component="button" variant="body2" onClick={handleAddDate}>
    + Add Date
  </Link>
</Box>


          <TextField
            label="Reason"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <Box>
            <Typography variant="body2">Upload Proof</Typography>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Submit
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <Dialog open={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)}>
        <DialogContent>
          <Typography>Select Date Range</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar value={null} onChange={handleDateChange} />
          </LocalizationProvider>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button onClick={() => setIsDatePickerOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsDatePickerOpen(false)}>OK</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ApplyLeaveForm;
