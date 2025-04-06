import React from "react";
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const RegisteredUsers = ({ registeredUsers, onBack }) => {
  return (
    <div className="registered-users">
      <Button variant="outlined" onClick={onBack} style={{ marginBottom: "10px" }}>← Back to Events</Button>
      <Typography variant="h5" gutterBottom>Registered Users</Typography>

      {registeredUsers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Instagram</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>Registered Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredUsers.map((user) => (
                <TableRow key={user.userId._id}>
                  <TableCell>{user.userId.name}</TableCell>
                  <TableCell>{user.userId.email}</TableCell>
                  <TableCell>{user.userId.instagramHandle}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{new Date(user.userId.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No users registered.</Typography>
      )}
    </div>
  );
};

export default RegisteredUsers;
