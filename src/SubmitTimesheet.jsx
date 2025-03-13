import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { grey, red, blue, green } from "@mui/material/colors";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import * as XLSX from "xlsx";

const TimesheetCalendar = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [timeValue, setTimeValue] = useState("08:00");
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectionMode, setSelectionMode] = useState("single");


  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });

    const firstDayIndex = getDay(start);
    const paddedDays = Array(firstDayIndex).fill(null).concat(allDays);

    setDays(paddedDays);
  }, [currentMonth]);

  useEffect(() => {
    const attendanceData =
      JSON.parse(localStorage.getItem("attendanceData")) || {};
    const allMarked = Object.keys(attendanceData).length === totalDaysInMonth;

    if (allMarked) {
      getSortedAttendance();
    }
  }, [selectedTimes]);

  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem("markedDates")) || [];
    const extractedDates = storedDates.map((entry) => entry.date);
    setSelectedDates(extractedDates);

    const storedTimes =
      JSON.parse(localStorage.getItem("attendanceData")) || {};
    setSelectedTimes(storedTimes);
  }, []);

  const getSortedDates = () => {
    const sortedDates = [...selectedDates].sort(
      (a, b) => new Date(a) - new Date(b)
    );
    console.log("Sorted Marked Dates:", sortedDates);
  };

  const isWeekend = (date) => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleDateClick = (date) => {
    if (!date || isWeekend(date)) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    setTimeValue(selectedTimes[formattedDate] || "08:00");

    if (selectionMode === "single") {
      setSelectedDates([formattedDate]);
      setOpenPopup(true);
    } else {
      setSelectedDates((prev) =>
        prev.includes(formattedDate)
          ? prev.filter((d) => d !== formattedDate)
          : [...prev, formattedDate]
      );
    }
  };

  const handleOpenDialog = () => {
    if (selectedDates.length > 0) {
      setOpenPopup(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedDates([]);
    setOpenPopup(false);
  };

  const handleMarkAttendance = (time) => {
    setSelectedTimes((prev) => {
      const updatedTimes = {
        ...prev,
        ...selectedDates.reduce((acc, date) => ({ ...acc, [date]: time }), {}),
      };

      localStorage.setItem("attendanceData", JSON.stringify(updatedTimes));

      return updatedTimes;
    });

    saveToLocalStorage(selectedDates);
    handleCloseDialog();
  };

  const toggleDateSelection = (date) => {
    setSelectedDates((prevDates) => {
      let updatedDates;
      if (prevDates.includes(date)) {
        updatedDates = prevDates.filter((d) => d !== date);
      } else {
        updatedDates = [...prevDates, date];
      }

      saveToLocalStorage(updatedDates);
      return updatedDates;
    });
  };

  const getTotalDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const totalDaysInMonth = getTotalDaysInMonth(currentYear, currentMonth);

  const saveToLocalStorage = (dates) => {
    const allDates = days.filter(Boolean).map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");

      return {
        date: formattedDate,
        type: isWeekend(date)
          ? "weekOff"
          : dates.includes(formattedDate)
          ? "attendance"
          : "unmarked",
      };
    });

    localStorage.setItem("markedDates", JSON.stringify(allDates));
  };

  const handleResetSelection = () => {
    setSelectedTimes((prev) => {
      const updatedTimes = { ...prev };

      selectedDates.forEach((date) => {
        delete updatedTimes[date];
      });
      localStorage.setItem("attendanceData", JSON.stringify(updatedTimes));
      return updatedTimes;
    });

    setSelectedDates([]);
    handleCloseDialog();
  };

  const calculateTotalWorkedHoursByMonth = () => {
  const storedData = JSON.parse(localStorage.getItem("attendanceData")) || {};
  const monthlyTotals = {};

  Object.entries(storedData).forEach(([date, time]) => {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + (minutes || 0);
      const monthKey = date.substring(0, 7);

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }

      monthlyTotals[monthKey] += totalMinutes;
    }
  });

  Object.keys(monthlyTotals).forEach((month) => {
    monthlyTotals[month] = (monthlyTotals[month] / 60).toFixed(2);
  });

  return monthlyTotals; 
};


const workedHoursByMonth = calculateTotalWorkedHoursByMonth();
console.log(workedHoursByMonth);

  const calculateTotalWorkedHours = () => {
    const storedData = JSON.parse(localStorage.getItem("attendanceData")) || {};

    let totalMinutes = 0;

    Object.values(storedData).forEach((time) => {
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        totalMinutes += hours * 60 + (minutes || 0);
      }
    });

    const totalHours = (totalMinutes / 60).toFixed(2);
    return totalHours;
  };



  const handleExportToExcel = () => {
    const data = days.filter(Boolean).map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const dayName = format(date, "EEEE");
      const time = selectedTimes[formattedDate] || "00:00";
      let type = "Full Day";

      if (isWeekend(date)) type = "Week Off";
      else if (time === "00:00") type = "Absent";
      else if (time === "04:00") type = "Half Day";

      return { Date: formattedDate, Day: dayName, Time: time, Type: type };
    });

    let totalMinutes = 0;
    Object.values(selectedTimes).forEach((time) => {
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        totalMinutes += hours * 60 + (minutes || 0);
      }
    });

    const totalHours = (totalMinutes / 60).toFixed(2);

    data.push({
      Date: "Total Monthly hours",
      Day: "",
      Time: totalHours + " Hours",
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    XLSX.writeFile(wb, "TimesheetData.xlsx");
  };
  const allDatesMarked = days
    .filter((day) => day && !isWeekend(day))
    .every((day) => selectedTimes[format(day, "yyyy-MM-dd")]);

  return (


    <Container
      sx={{
        padding: 2,
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "auto",
        mt: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <IconButton
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectionMode === "range"}
              onChange={(e) =>
                setSelectionMode(e.target.checked ? "range" : "single")
              }
              color="primary"
            />
          }
          label="Select Multiple"
        />
        <IconButton onClick={handleExportToExcel} color="primary">
          <img
            src="data:image/png;base64,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"
            alt="Export to Excel"
            width="24"
            height="24"
          />
        </IconButton>
      </Box>
      <Grid container spacing={1}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography align="center" fontWeight="bold">
              {day}
            </Typography>
          </Grid>
        ))}
        {days.map((day, index) => {
          if (!day) return <Grid item xs={12 / 7} key={index}></Grid>;

          const formattedDate = format(day, "yyyy-MM-dd");
          const time = selectedTimes[formattedDate];

          const isAbsent = time === "00:00";
          const isHalfDay = time === "04:00";
          const isFullDay = time === "08:00";
          const isWeekendDay = isWeekend(day);
          const isSelected = selectedDates.includes(formattedDate);

          const bgColor = isWeekendDay
            ? grey[300]
            : isAbsent
            ? red[100]
            : isHalfDay
            ? blue[100]
            : isFullDay
            ? green[100]
            : isSelected
            ? grey[300]
            : "white";

          return (
            <Grid item xs={12 / 7} key={index}>
              <Paper
                sx={{
                  height: 60,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: bgColor,
                  cursor: isWeekendDay ? "default" : "pointer",
                  padding: "4px",
                }}
                onClick={() => !isWeekendDay && handleDateClick(day)}
              >
                <Typography variant="body1">{format(day, "d")}</Typography>
                {isAbsent && (
                  <Typography variant="caption" color="error">
                    Absent (00:00)
                  </Typography>
                )}
                {isHalfDay && (
                  <Typography variant="caption" color="primary">
                    Half Day (04:00)
                  </Typography>
                )}
                {isFullDay && (
                  <Typography variant="caption" color="success">
                    Full Day (08:00)
                  </Typography>
                )}
                {isWeekendDay && (
                  <Typography variant="caption" color="textSecondary">
                    Week Off
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {selectionMode === "range" && selectedDates.length > 0 && (
        <Box mt={2} textAlign="center">
          <Button variant="contained" onClick={handleOpenDialog}>
            Proceed
          </Button>
        </Box>
      )}
      {allDatesMarked && (
  <Button
    variant="contained"
    color="primary"
    sx={{ mt: 2 }}
    onClick={() => {
      const firstDate = Object.keys(selectedTimes)[0];
      if (!firstDate) {
        console.warn("No dates selected.");
        return;
      }

      const submittedMonth = format(new Date(firstDate), "yyyy-MM");
      const submittedData = Object.entries(selectedTimes).reduce(
        (acc, [date, time]) => {
          if (date.startsWith(submittedMonth)) {
            acc[date] = time;
          }
          return acc;
        },
        {}
      );

      const finalSubmission = {
        employeeName: user?.name || "N/A",
        employeeEmail: user?.email || "N/A",
        employeeId: user?.id || "N/A",
        month: submittedMonth,
        timesheet: submittedData
      };

      console.log("Submitted Timesheet Data:", finalSubmission);
    }}
  >
    Submit
  </Button>
)}


      <Dialog
        open={openPopup}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: grey[200],
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Mark Attendance
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Selected Dates:
          </Typography>
          <Typography variant="body1" color="primary">
            {selectedDates.join(", ") || "No dates selected"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => handleMarkAttendance("08:00")}
            color="success"
            variant="contained"
          >
            Full Day
          </Button>
          <Button
            onClick={() => handleMarkAttendance("04:00")}
            color="primary"
            variant="contained"
          >
            Half Day
          </Button>
          <Button
            onClick={() => handleMarkAttendance("00:00")}
            color="error"
            variant="contained"
          >
            Absent
          </Button>
          <Button
            onClick={handleResetSelection}
            color="warning"
            variant="contained"
          >
            Reset Selection
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="subtitle1" fontWeight="bold">
        Total Monthly Hours Worked: {calculateTotalWorkedHours()} hrs
      </Typography>
    </Container>
  );
};

export default TimesheetCalendar;
