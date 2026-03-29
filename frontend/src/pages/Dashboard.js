import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(res.data.message);
      } catch (error) {
        alert("Unauthorized");
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