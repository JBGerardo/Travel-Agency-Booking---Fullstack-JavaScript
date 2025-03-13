import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default Profile;
