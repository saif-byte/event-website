import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const ContactUsers = ({ contacts }) => {
  return (
    <Box sx={{ mt: 4 }}>
     

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell><strong>Submitted Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts?.length > 0 ? (
              contacts.map((contact) => (
                <TableRow key={contact._id} hover>
                  <TableCell>{contact.name} {contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNo || "-"}</TableCell>
                  <TableCell>{contact.message}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, fontStyle: "italic", color: "gray" }}>
                  No contact submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContactUsers;
