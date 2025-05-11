import React, { useState, useEffect } from "react";
import { Box, Paper, TextField, Button, Typography, AppBar, Toolbar, IconButton, Avatar, Alert } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Forgot = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({ userName: "", password: "", conformPassword: "" });
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
        setAuth({ ...auth, [name]: value });
    };

    const handleForgot = async () => {
        if (auth.password !== auth.conformPassword) {
            setAlertMessage({ message: "Passwords do not match!", status: "error" });
            setShowAlert(true);
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/forgot-password", auth);
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
                        Forgot Password
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
                    backgroundColor: darkMode ? "#1e1e1e" : "#f4f6f8",
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
                        Reset Your Password
                    </Typography>

                    <TextField label="Username" name="userName" variant="outlined" value={auth.userName} onChange={handleChange} fullWidth />

                    <TextField label="New Password" name="password" type={showPassword ? "text" : "password"} variant="outlined" value={auth.password} onChange={handleChange} fullWidth />

                    <TextField label="Confirm Password" name="conformPassword" type={showPassword ? "text" : "password"} variant="outlined" value={auth.conformPassword} onChange={handleChange} fullWidth />

                    <Button variant="contained" fullWidth onClick={handleForgot} sx={{ borderRadius: 2, fontWeight: "bold", padding: 1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", transition: "transform 0.4s ease-in-out, background-color 0.3s ease-in-out", "&:hover": { transform: "scale(1.05)", backgroundColor: "#1e7d32" } }}>
                        Reset Password
                    </Button>

                    <Typography variant="body2">
                        Remember your password?
                        <Link to="/" style={{ color: "#1976d2", textDecoration: "none", marginLeft: 5 }}>
                            Login Here
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </>
    );
};

export default Forgot;