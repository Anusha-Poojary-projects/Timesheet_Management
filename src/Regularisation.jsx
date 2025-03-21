import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, IconButton, Grid 
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close"; 

const RegularisationForm = ({ open, onClose }) => {
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    setEntries([...entries, { date: "", inTime: "", outTime: "", totalHours: "", reason: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    
    if (field === "inTime" || field === "outTime") {
      const inTime = newEntries[index].inTime;
      const outTime = newEntries[index].outTime;
      if (inTime && outTime) {
        const [inHours, inMinutes] = inTime.split(":").map(Number);
        const [outHours, outMinutes] = outTime.split(":").map(Number);
        let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
        if (totalMinutes < 0) totalMinutes += 24 * 60; 
        newEntries[index].totalHours = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}:00`;
      }
    }

    setEntries(newEntries);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Regularisation Request Data:", entries);
    setEntries([]); 
  onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Regularise Attendance
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {entries.map((entry, index) => (
          <Grid container spacing={2} alignItems="center" key={index}>
            <Grid item xs={2}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                sx={{ mt: 2 }}
                value={entry.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="In Time"
                type="time"
                fullWidth
                sx={{ mt: 2 }}
                value={entry.inTime}
                onChange={(e) => handleChange(index, "inTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Out Time"
                type="time"
                fullWidth
                sx={{ mt: 2 }}
                value={entry.outTime}
                onChange={(e) => handleChange(index, "outTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Total Hours"
                fullWidth
                sx={{ mt: 2 }}
                value={entry.totalHours}
                disabled
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Reason"
                fullWidth
                sx={{ mt: 2 }}
                value={entry.reason}
                onChange={(e) => handleChange(index, "reason", e.target.value)}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => removeEntry(index)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} onClick={addEntry} sx={{ mt: 2 }}>Add Date</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegularisationForm;
