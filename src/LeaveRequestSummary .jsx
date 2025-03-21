import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";

const LeaveRequestSummary = ({ leaveRequests }) => {
  return (
    <Card sx={{ maxWidth: 350, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Leave Requests
        </Typography>
        <Stack spacing={1} mt={2}>
          {leaveRequests.length === 0 ? (
            <Typography color="text.secondary">No leave requests found</Typography>
          ) : (
            leaveRequests.map((request, index) => (
              <Stack
                key={index}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={index !== leaveRequests.length - 1 ? "1px solid #ddd" : "none"}
                pb={1}
              >
                <Typography variant="body1">{request.leaveType}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.dateRanges
                    .map((range) =>
                      range.startDate && range.endDate
                        ? `${new Date(range.startDate).toLocaleDateString()} - ${new Date(range.endDate).toLocaleDateString()}`
                        : "Pending"
                    )
                    .join(", ")}
                </Typography>
              </Stack>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestSummary;
