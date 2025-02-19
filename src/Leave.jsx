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
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ApplyLeaveForm = ({ open, onClose }) => {
  const [leaveType, setLeaveType] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [dayType, setDayType] = useState("Full Day");

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("leaveType", leaveType);
    formData.append("startDate", dates[0]);
    formData.append("endDate", dates[1]);
    formData.append("reason", reason);
    formData.append("dayType", dayType);
    if (file) formData.append("file", file);
    
    console.log("Submitting", { leaveType, dates, reason, file, dayType });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Apply Leave</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Leave Type *</InputLabel>
          <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Casual Leave">Casual Leave</MenuItem>
            <MenuItem value="Annual Leave">Annual Leave</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dates}
            onChange={(newValue) => setDates(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} fullWidth margin="dense" />
                <TextField {...endProps} fullWidth margin="dense" />
              </>
            )}
          />
        </LocalizationProvider>

        <FormControl fullWidth margin="dense">
          <InputLabel>Day Type</InputLabel>
          <Select value={dayType} onChange={(e) => setDayType(e.target.value)}>
            <MenuItem value="Full Day">Full Day</MenuItem>
            <MenuItem value="Half Day">Half Day</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Reason *"
          multiline
          rows={3}
          fullWidth
          margin="dense"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <Typography variant="body2" gutterBottom>
          Upload Proof *
        </Typography>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 16 }}
        />

        <Button onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyLeaveForm;
