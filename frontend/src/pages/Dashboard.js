import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
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
        alert("Session expired, please login again");
        localStorage.removeItem("token"); // 🔥 important
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container mt-5">
      <h2>{data}</h2>
    </div>
  );
}

export default Dashboard;