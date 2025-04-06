import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const UserCard = ({ user }) => {
  return (
    <Card className="user-card">
      <CardContent>
        <Typography variant="h6">{user.userId.name}</Typography>
        <Typography>Email: {user.userId.email}</Typography>
        <Typography>Instagram: {user.userId.instagramHandle}</Typography>
        <Typography>Gender: {user.gender}</Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
