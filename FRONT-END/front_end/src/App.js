import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Settings from "./pages/Settings";
import ThemeContextProvider from "./contexts/ThemeContext";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot';


export default function App() {
  return (
    <>
      <ThemeContextProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" exact element={<Login />}></Route>
            <Route path="/signup" exact element={<Signup />}></Route>
            <Route path="/forgot" exact element={<Forgot />}></Route>
            <Route path="/home" exact element={<Home />}></Route>
            <Route path="/about" exact element={<About />}></Route>
            <Route path="/settings" exact element={<Settings />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeContextProvider >
    </>
  )
};
