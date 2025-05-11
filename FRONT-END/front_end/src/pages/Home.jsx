import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "../Dash.css";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    id: null,
    name: "",
    age: "",
    course: "",
    location: "",
    pincode: "",
    phone_number: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/students");
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Student Function
  const addStudent = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.course || !newStudent.location || !newStudent.pincode || !newStudent.phone_number) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.post("http://localhost:8000/students", newStudent);
      alert("Student added successfully!");
      fetchStudents();
      setNewStudent({ id: null, name: "", age: "", course: "", location: "", pincode: "", phone_number: "" });
    } catch (err) {
      console.error("Error adding student", err);
      alert("Failed to add student.");
    }
  };

  // ✅ Delete Student Function
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/students/${id}`);
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student", err);
      alert("Failed to delete student.");
    }
  };

  // ✅ Update Student Function
  const updateStudent = async () => {
    if (!newStudent.id) {
      alert("Please select a student to update.");
      return;
    }
    try {
      await axios.put(`http://localhost:8000/students/${newStudent.id}`, newStudent);
      alert("Student updated successfully!");
      fetchStudents();
      setNewStudent({ id: null, name: "", age: "", course: "", location: "", pincode: "", phone_number: "" });
    } catch (err) {
      console.error("Error updating student", err);
      alert("Failed to update student.");
    }
  };

  // ✅ Search Student Function
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Define Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "course", headerName: "Course", width: 180 },
    { field: "location", headerName: "Location", width: 180 },
    { field: "pincode", headerName: "Pincode", width: 120 },
    { field: "phone_number", headerName: "Phone Number", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={() => setNewStudent(params.row)}
          >
            Select
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: "8px",
              marginLeft: "10px",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={() => deleteStudent(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex", width: "100%", overflowX: "hidden" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Student Records Management
            </Typography>

            {/* ✅ Search Student */}
            <TextField
              label="Search Student by Name"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* ✅ Add & Update Student Form */}
            <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2, p: 3, backgroundColor: "#f8f9fa", borderRadius: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
              {["Name", "Age", "Course", "Location", "Pincode", "Phone Number"].map((field) => (
                <TextField
                  key={field}
                  label={field}
                  value={newStudent[field.toLowerCase().replace(" ", "_")]}
                  onChange={(e) => setNewStudent({ ...newStudent, [field.toLowerCase().replace(" ", "_")]: e.target.value })}
                  fullWidth
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                />
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" sx={{ borderRadius: "8px" }} onClick={addStudent}>
                  Add Student
                </Button>
                <Button variant="contained" color="secondary" sx={{ borderRadius: "8px" }} onClick={updateStudent}>
                  Update Student
                </Button>
              </Box>
            </Box>

            <DataGrid rows={filteredStudents} columns={columns} pageSize={5} autoHeight sx={{ borderRadius: "8px", backgroundColor: "#ffffff", width: "100%", overflowX: "hidden" }} />
          </Box>
        </Box>
      </div>
    </>
  );
}