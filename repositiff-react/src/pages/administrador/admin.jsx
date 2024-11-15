import React from "react";

const Admin = () => {
  const handleAdminFunction = () => {
    // Your function logic here
    console.log("Admin function executed");
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <button onClick={handleAdminFunction}>Execute Admin Function</button>
    </div>
  );
};

export default Admin;
