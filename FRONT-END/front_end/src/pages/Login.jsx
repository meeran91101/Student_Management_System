import { Alert, Avatar, Box, Button, Paper, TextField, Typography, AppBar, Toolbar, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
    const [auth, setAuth] = useState({ userName: "", password: "" });
    const [alertMessage, setAlertMessage] = useState({ message: "", status: "" });
    const [showAlert, setShowAlert] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setFadeIn(true); // Start animation when component mounts
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/login", auth);
            const { message, status } = response.data;

            setAlertMessage({ message, status });
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            if (status === "200") {
                if (rememberMe) {
                    localStorage.setItem("user", JSON.stringify(auth)); // Save credentials for returning users
                }
                navigate("/home");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Invalid username or password. Please try again!";
            setAlertMessage({ message: errorMsg, status: "error" });
            setShowAlert(true);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAuth({ ...auth, [name]: value });
    };

    return (
        <>
            {/* ✅ Navigation Bar */}
            <AppBar position="static" sx={{ bgcolor: darkMode ? "#1e1e1e" : "#2e7d32" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        STUDENT'S RECORDS
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
                        <img src="/default-profile.png" alt="User Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                    </Avatar>

                    {showAlert && (
                        <Alert severity={alertMessage.status === "200" ? "success" : "error"}>
                            {alertMessage.message}
                        </Alert>
                    )}

                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Login
                    </Typography>

                    <TextField
                        label="Username"
                        name="userName"
                        variant="outlined"
                        value={auth.userName}
                        onChange={handleChange}
                        fullWidth
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        variant="outlined"
                        type="password"
                        value={auth.password}
                        onChange={handleChange}
                        fullWidth
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    <Box sx={{ width: "100%", textAlign: "right" }}>
                        <Link to="/forgot" style={{ color: "#1976d2", textDecoration: "none" }}>
                            Forgot Password?
                        </Link>
                    </Box>

                    {/* ✅ ‘Remember Me’ Feature */}
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
                        label="Remember Me"
                        sx={{ alignSelf: "flex-start" }}
                    />

                    {/* ✅ Hover Animation for Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            padding: 1,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            transition: "transform 0.4s ease-in-out, background-color 0.3s ease-in-out",
                            "&:hover": { transform: "scale(1.05)", backgroundColor: "#1e7d32" },
                        }}
                    >
                        Login
                    </Button>

                    <Typography variant="body2">
                        Don't have an account?
                        <Link to="/Signup" style={{ color: "#1976d2", textDecoration: "none", marginLeft: 5 }}>
                            Signup
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </>
    );
};

export default Login;