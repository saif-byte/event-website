import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ContactUsers = ({ contacts }) => {
  return (
    <div className="contact-users">
      <Typography variant="h5" gutterBottom>Contact Submissions</Typography>

      {contacts?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Submitted Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.name} {contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNo}</TableCell>
                  <TableCell>{contact.message}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No contact submissions found.</Typography>
      )}
    </div>
  );
};

export default ContactUsers;
