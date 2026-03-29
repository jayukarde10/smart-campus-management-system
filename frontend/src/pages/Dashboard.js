import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        window.location.href = "/";
        return;
      }

      const res = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(res.data.message);

    } catch (error) {
      console.error(error);
      alert("Unauthorized");
      window.location.href = "/";
    }
  };

  fetchData();
}, []);

  return (
    <div className="container mt-5">
      <h2>{data}</h2>
    </div>
  );
}

export default Dashboard;