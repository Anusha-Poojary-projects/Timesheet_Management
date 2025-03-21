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
  Divider,
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
import { Close } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import * as XLSX from "xlsx";
import { MenuItem, Menu, Select } from "@mui/material";
import ApplyLeaveForm from "./Leave";
import RegularisationForm from "./Regularisation";
import { Card, CardContent, Avatar } from "@mui/material";
import {
  Person,
  Email,
  LocationOn,
  Work,
  Business,
  CalendarToday,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const TimesheetCalendar = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [timeValue, setTimeValue] = useState("08:00");
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectionMode, setSelectionMode] = useState("single");
  const [selectedAction, setSelectedAction] = useState("");
  const [timesheetData, setTimesheetData] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [workedHoursByMonth, setWorkedHoursByMonth] = useState({});
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isRegularisationOpen, setIsRegularisationOpen] = useState(false);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const open = Boolean(anchorEl);

  const allowedTimes = [
    "Select Time",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
  ];

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });

    const firstDayIndex = getDay(start);
    const paddedDays = Array(firstDayIndex).fill(null).concat(allDays);

    setDays(paddedDays);
  }, [currentMonth]);

  useEffect(() => {
    const attendanceData = timesheetData || {};
    const allMarked = Object.keys(attendanceData).length === totalDaysInMonth;
    if (allMarked) {
      getSortedAttendance();
    }
  }, [selectedTimes]);

  useEffect(() => {
    const storedDates = markedDates || [];
    const extractedDates = storedDates.map((entry) => entry.date);
    setSelectedDates(extractedDates);

    const storedTimes = timesheetData || {};
    setSelectedTimes(storedTimes);
  }, []);

  const getSortedDates = () => {
    const sortedDates = [...selectedDates].sort(
      (a, b) => new Date(a) - new Date(b)
    );
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    const dayOfMonth = date.getDate();
    if (day === 0) return true;
    if (day === 6) {
      const firstSaturday = new Date(date.getFullYear(), date.getMonth(), 1);
      while (firstSaturday.getDay() !== 6) {
        firstSaturday.setDate(firstSaturday.getDate() + 1);
      }
      const weekNumber = Math.floor((dayOfMonth - firstSaturday.getDate()) / 7);
      return weekNumber % 2 === 0;
    }
    return false;
  };

  const handleDateClick = (date) => {
    if (!date || isWeekend(date)) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");

    if (formattedDate > today) {
      return;
    }

    setTimeValue(selectedTimes[formattedDate] || "Select Time");
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

  console.log(timesheetData);

  const isFutureDate = (date) => {
    return format(date, "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd");
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

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmSubmit = () => {
    if (selectedDates.length === 0) {
      console.warn("No dates selected.");
      return;
    }

    const submittedData = selectedDates.reduce((acc, date) => {
      if (selectedTimes[date]) {
        acc[date] = selectedTimes[date];
      }
      return acc;
    }, {});

    const submittedMonth = format(new Date(selectedDates[0]), "yyyy-MM");

    const finalSubmission = {
      employeeName: user?.name || "N/A",
      employeeEmail: user?.email || "N/A",
      employeeId: user?.id || "N/A",
      month: submittedMonth,
      timesheet: submittedData,
    };

    console.log("Submitted Timesheet Data:", finalSubmission);

    handleCloseDialog();
    handleCloseConfirmDialog();
  };

  const handleTimeChange = (event) => {
    const newTimeValue = event.target.value;

    setTimeValue(newTimeValue);
    if (newTimeValue === "00:00") {
      setAttendanceStatus("Absent");
    } else if (
      ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00"].includes(
        newTimeValue
      )
    ) {
      setAttendanceStatus("Half Day");
    } else if (["08:00", "09:00", "10:00"].includes(newTimeValue)) {
      setAttendanceStatus("Full Day");
    }
  };

  const handleMarkAttendance = (time) => {
    const newTimeValue = timeValue || time; 

    setTimeValue(newTimeValue); 

    setSelectedTimes((prev) => {
      const updatedTimes = {
        ...prev,
        ...selectedDates.reduce(
          (acc, date) => ({
            ...acc,
            [date]: newTimeValue, 
          }),
          {}
        ),
      };

      setTimesheetData(updatedTimes);
      return updatedTimes;
    });

    console.log("Updated timesheetData:", timesheetData);
  };



  const getTotalDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const totalDaysInMonth = getTotalDaysInMonth(currentYear, currentMonth);

  const saveToMarkedDates = (dates) => {
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

    setMarkedDates(allDates);
  };

  const handleResetSelection = () => {
    setSelectedTimes((prev) => {
      const updatedTimes = { ...prev };

      selectedDates.forEach((date) => {
        delete updatedTimes[date];
      });

      setTimesheetData(updatedTimes);
      return updatedTimes;
    });

    setSelectedDates([]);
    handleCloseDialog();
  };

  const calculateTotalWorkedHoursByMonth = () => {
    const storedData = timesheetData || {};
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

  const monthData = calculateTotalWorkedHoursByMonth();

  const getCurrentMonthTotalHours = (monthData) => {
    const formattedMonth = currentMonth.toISOString().slice(0, 7);

    if (monthData[formattedMonth]) {
      const totalHours = parseFloat(monthData[formattedMonth]);
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
      return `${String(hours).padStart(2, "0")}`;
    }
    return "00:00";
  };

  const handleExportToExcel = () => {
    const data = days.filter(Boolean).map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const dayName = format(date, "EEEE");
      const time = selectedTimes[formattedDate] || "00:00";
      let type = "Full Day";

      if (isWeekend(date)) type = "Week Off";
      else if (time === "08:00" || time === "09:00" || time === "10:00")
        type = "Full Day";
      else if (time === "00:00") type = "Absent";
      else if (
        [
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
        ].includes(time)
      )
        type = "Half Day";

      return [formattedDate, dayName, time, type];
    });

    let totalMinutes = 0;
    Object.values(selectedTimes).forEach((time) => {
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        totalMinutes += hours * 60 + (minutes || 0);
      }
    });

    const totalHours = (totalMinutes / 60).toFixed(2);

    const headers = [["Date", "Day", "Time", "Type"]];

    const worksheetData = [...headers, ...data];

    worksheetData.push([
      "Total Monthly Hours",
      "",
      "",
      totalHours + " Hours",
      "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    const lastRow = worksheetData.length - 1;

    ws["!merges"] = [{ s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 2 } }];

    ws["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");

    XLSX.writeFile(wb, "TimesheetData.xlsx");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderTimesheetPieChart = () => {
    const timeCategories = {
      "00:00": "Absent",
      "01:00": "Half Day",
      "02:00": "Half Day",
      "03:00": "Half Day",
      "04:00": "Half Day",
      "05:00": "Half Day",
      "06:00": "Half Day",
      "07:00": "Half Day",
      "08:00": "Full Day",
      "09:00": "Full Day",
      "10:00": "Full Day",
    };
    let categoryCounts;

    if (!timesheetData || Object.keys(timesheetData).length === 0) {

      categoryCounts = {
        "Full Day (08:00)": 1,
        "Half Day (04:00)": 1,
        "Absent (00:00)": 1,
      };
    } else {

      categoryCounts = Object.values(timesheetData).reduce((acc, time) => {
        const label = timeCategories[time]
          ? `${timeCategories[time]} (${time})`
          : time;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});
    }

    const chartData = Object.keys(categoryCounts).map((key) => ({
      name: key,
      value: categoryCounts[key],
    }));

    // const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
    const COLORS = {
      "Full Day (08:00)": "#90EE90", 
      "Full Day (09:00)": "#90EE90", 
      "Full Day (10:00)": "#90EE90", 
      "Half Day (01:00)": "#0088FE", 
      "Half Day (02:00)": "#0088FE", 
      "Half Day (03:00)": "#0088FE", 
      "Half Day (04:00)": "#0088FE", 
      "Half Day (05:00)": "#0088FE",
      "Half Day (06:00)": "#0088FE",
      "Half Day (07:00)": "#0088FE", 
      "Absent (00:00)": "#FF7F7F", 
    };

    return (
      <>
        <h3>Attendance Summary</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >

            {chartData.map((entry, index) => {
              return (
                <Cell key={entry.name} fill={COLORS[entry.name] || "#8884d8"} />
              );
            })}
            
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: -10,
          mt: 2,
          mb: 1,
        }}
      >
        <Button
          sx={{ backgroundColor: "#2F4F4F" }}
          variant="contained"
          onClick={handleClick}
        >
          Apply
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => setIsLeaveOpen(true)}>Leave</MenuItem>
          <MenuItem onClick={() => setIsRegularisationOpen(true)}>
            Regularisation
          </MenuItem>
          <MenuItem onClick={handleClose}>Work From Home</MenuItem>
        </Menu>
        <ApplyLeaveForm
          open={isLeaveOpen}
          onClose={() => setIsLeaveOpen(false)}
        />
        <RegularisationForm
          open={isRegularisationOpen}
          onClose={() => setIsRegularisationOpen(false)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mt: 2,
          mb: 1,
          ml: -4,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          My Dashboard
        </Typography>
      </Box>
      <Container
        sx={{
          padding: 1,
          backgroundColor: "white",
          // borderRadius: 3,
          marginLeft: 90,
          marginRight: 1,
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1), 4px 0px 10px rgba(0, 0, 0, 0.1), -4px 0px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "25%",
          position: "absolute",
          height: "540px",
          width: "35vw",
          mt: 1,
        }}
      >
        {renderTimesheetPieChart()}
      </Container>

      <Container
        // sx={{
        //   padding: 2,
        //   backgroundColor: "white",
        //   borderRadius: 3,
        //   boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
        //   maxWidth: "800px",
        //   margin: "auto",
        //   mt: 3,
        // }}
        sx={{
          padding: 1,
          backgroundColor: "white",
          // borderRadius: 3,
          marginLeft: -6,
          boxShadow:
            "4px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1), 4px 0px 10px rgba(0, 0, 0, 0.1), -4px 0px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "55%",
          // margin: "auto",
          position: "absolute",
          // left: 0,
          width: "55vw",
          mt: 1,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          // sx={{ mb: 2 }}
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Typography variant="h7" fontWeight="bold">
              {format(currentMonth, "MMMM yyyy")}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectionMode === "range"}
                onChange={(e) =>
                  setSelectionMode(e.target.checked ? "range" : "single")
                }
                color="primary"
                size="small"
              />
            }
            label="Select Multiple"
          />
          <IconButton onClick={handleExportToExcel} color="primary">
            <img
              src="data:image/png;base64,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"
              alt="Export to Excel"
              width="20"
              height="20"
            />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography align="center" fontWeight="bold" fontSize="13px">
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map((day, index) => {
            if (!day) return <Grid item xs={12 / 7} key={index}></Grid>;

            const formattedDate = format(day, "yyyy-MM-dd");
            const time = selectedTimes[formattedDate];

            const isAbsent = time === "00:00";
            const isHalfDay =
              time === "04:00" ||
              time === "03:00" ||
              time === "02:00" ||
              time === "01:00" ||
              time === "05:00" ||
              time === "06:00" ||
              time === "07:00";
            const isFullDay =
              time === "08:00" || time === "09:00" || time === "10:00";

            const isWeekendDay = isWeekend(day);
            const isMarked = formattedDate && selectedTimes[formattedDate];
            const isSelected = selectedDates.includes(formattedDate);

            const bgColor = isWeekendDay
              ? grey[300]
              : isAbsent && isSelected
              ? red[200]
              : isAbsent
              ? red[100]
              : isHalfDay && isSelected
              ? blue[200]
              : isHalfDay
              ? blue[100]
              : isFullDay && isSelected
              ? green[200]
              : isFullDay
              ? green[100]
              : isSelected
              ? grey[400]
              : "white";

            return (
              <Grid item xs={12 / 7} key={index}>
                <Paper
                  sx={{
                    // height: 60,
                    // display: "flex",
                    // flexDirection: "column",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // backgroundColor: bgColor,
                    // cursor: isWeekendDay ? "default" : "pointer",
                    // padding: "4px",
                    height: 55,
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
                      Absent ({time})
                    </Typography>
                  )}
                  {isHalfDay && (
                    <Typography variant="caption" color="primary">
                      HalfDay ({time})
                    </Typography>
                  )}
                  {isFullDay && (
                    <Typography variant="caption" color="success">
                      FullDay ({time})
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
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Selected Dates:
            </Typography>
            <Typography variant="body1" color="primary">
              {selectedDates.join(", ") || "No dates selected"}
            </Typography>

            <Select value={timeValue} onChange={handleTimeChange} fullWidth>
              {allowedTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time || "Select Time"}
                </MenuItem>
              ))}
            </Select>
            {timeValue === "Select Time" && (
              <Typography variant="caption" color="error">
                *Select the time to mark attendance
              </Typography>
            )}
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
              Reset
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenConfirmDialog}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            Confirm Submission
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" align="center">
              Are you sure you want to submit the timesheet?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              onClick={handleCloseConfirmDialog}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Typography variant="subtitle1" fontWeight="bold">
          Total Monthly Hours Worked :{getCurrentMonthTotalHours(monthData)} hrs
        </Typography>
      </Container>
      <Container
        sx={{
          padding: 1,
          backgroundColor: "white",
          // borderRadius: 3,
          marginLeft: -6,
          marginRight: 1,
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1), 4px 0px 10px rgba(0, 0, 0, 0.1), -4px 0px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "25%",
          position: "absolute",
          height: "350px",
          width: "30vw",
          mt: 71,
        }}
      >
      </Container>
      <Container
        sx={{
          padding: 1,
          backgroundColor: "white",
          // borderRadius: 3,
          marginLeft: 46,
          marginRight: 1,
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1), 4px 0px 10px rgba(0, 0, 0, 0.1), -4px 0px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "25%",
          position: "absolute",
          height: "350px",
          width: "30vw",
          mt: 71,
        }}
      >
      </Container>
      <Container
        sx={{
          padding: 1,
          backgroundColor: "white",
          // borderRadius: 3,
          marginLeft: 98,
          marginRight: 1,
          boxShadow:
            "0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1), 4px 0px 10px rgba(0, 0, 0, 0.1), -4px 0px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "25%",
          position: "absolute",
          height: "350px",
          width: "30vw",
          mt: 71,
        }}
      >
      </Container>
    </>
  );
};

export default TimesheetCalendar;
