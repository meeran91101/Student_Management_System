import React, { useState, useEffect } from "react";
import { Box, Paper, TextField, Button, Typography, AppBar, Toolbar, IconButton, Avatar, Alert } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const [auth1, setAuth1] = useState({ userName1: "", mobileNumber: "", password: "", conformPassword: "" });
    const [alertMessage, setAlertMessage] = useState({ message: "", status: "" });
    const [showAlert, setShowAlert] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAuth1({ ...auth1, [name]: value });
    };

    const handleSignup = async () => {
        if (auth1.password !== auth1.conformPassword) {
            setAlertMessage({ message: "Passwords do not match!", status: "error" });
            setShowAlert(true);
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/signup", auth1);
            setAlertMessage({ message: response.data.message, status: "success" });
            setShowAlert(true);
            setTimeout(() => { setShowAlert(false); }, 3000);
            navigate("/");
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Something went wrong! Please try again.";
            setAlertMessage({ message: errorMsg, status: "error" });
            setShowAlert(true);
        }
    };

    return (
        <>
            {/* ✅ Navigation Bar */}
            <AppBar position="static" sx={{ bgcolor: darkMode ? "#1e1e1e" : "#2e7d32" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Create an Account
                    </Typography>
                    <IconButton onClick={toggleDarkMode}>
                        {darkMode ? <LightModeIcon sx={{ color: "#f4f4f4" }} /> : <DarkModeIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.4s ease-in-out",
                    marginTop: "5%",
                    marginBottom: "5%",
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: "400px",
                        padding: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        alignItems: "center",
                        borderRadius: 3,
                        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                        backgroundColor: darkMode ? "#262626" : "#ffffff",
                        transition: "background-color 0.4s ease-in-out",
                        opacity: fadeIn ? 1 : 0, // Slide-in animation
                        transform: fadeIn ? "translateY(0)" : "translateY(-20px)",
                        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                    }}
                >
                    {/* ✅ Profile Picture Animation */}
                    <Avatar sx={{ bgcolor: "#2e7d32", width: 60, height: 60, animation: "bounce 1s infinite alternate" }}>
                        <AccountCircleIcon sx={{ fontSize: 40 }} />
                    </Avatar>

                    {showAlert && (
                        <Alert severity={alertMessage.status} sx={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.4s ease-in-out" }}>
                            {alertMessage.message}
                        </Alert>
                    )}

                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Signup
                    </Typography>

                    <TextField label="Username" name="userName1" variant="outlined" value={auth1.userName1} onChange={handleChange} fullWidth />
                    
                    <TextField label="Mobile Number" name="mobileNumber" variant="outlined" value={auth1.mobileNumber} onChange={handleChange} fullWidth />

                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        value={auth1.password}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: <IconButton onClick={togglePasswordVisibility}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>,
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        name="conformPassword"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        value={auth1.conformPassword}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: <IconButton onClick={togglePasswordVisibility}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>,
                        }}
                    />

                    <Button variant="contained" fullWidth onClick={handleSignup} sx={{ borderRadius: 2, fontWeight: "bold", padding: 1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", transition: "transform 0.4s ease-in-out, background-color 0.3s ease-in-out", "&:hover": { transform: "scale(1.05)", backgroundColor: "#1e7d32" } }}>
                        Signup
                    </Button>

                    <Typography variant="body2">
                        Already have an account?
                        <Link to="/" style={{ color: "#1976d2", textDecoration: "none", marginLeft: 5 }}>
                            Login Here
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </>
    );
};

export default Signup;