import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import StorageIcon from "@mui/icons-material/Storage";
import SensorsIcon from "@mui/icons-material/Sensors";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import MapIcon from "@mui/icons-material/Map";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Importing page components
import ConnectDisconnect from "./pages/ConnectDisconnect";
import Home from "./pages/Home";
import IMUData from "./pages/IMUData";
import Logger from "./pages/Logger";
import Map from "./pages/Map";
import SensorHealth from "./pages/SensorHealth";

const drawerWidth = 250; // Sidebar width

// Navigation items for the sidebar
const navItems = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  {
    label: "Sensor Health",
    icon: <HealthAndSafetyIcon />,
    path: "/sensor-health",
  },
  { label: "Logger", icon: <StorageIcon />, path: "/logger" },
  { label: "IMU Data", icon: <SensorsIcon />, path: "/imu-data" },
  {
    label: "Connect/Disconnect",
    icon: <LinkOffIcon />,
    path: "/connect-disconnect",
  },
  { label: "Map", icon: <MapIcon />, path: "/map" },
];

const App = () => {
  

  const [isDrawerOpen, setDrawerOpen] = useState(true);

  // State for managing light/dark theme
  const [isDarkMode, setDarkMode] = useState(false);

  // Toggles the sidebar open/close
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // Toggles between light and dark themes
  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  // Dynamic theme configuration based on the light/dark mode
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light", // Determines light or dark mode
      primary: {
        main: isDarkMode ? "#90caf9" : "#1976d2", // Sets primary color for icons
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff", // Background color for the main content
        paper: isDarkMode ? "#1d1d1d" : "#ffffff", // Background color for the sidebar
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#000000", // Text color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          {/* Fixed icons for hamburger menu and theme toggle */}
          <Box
            sx={{
              position: "fixed",
              top: 10,
              left: 10,
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Hamburger/Minimize Sidebar button */}
            <IconButton onClick={toggleDrawer}>
              {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            {/* Light/Dark mode toggle button */}
            <IconButton onClick={toggleTheme} sx={{ marginLeft: 1 }}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {/* Sidebar (Drawer) */}
          <Drawer
            variant="persistent"
            open={isDrawerOpen}
            sx={{
              width: isDrawerOpen ? drawerWidth : 0,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth, // Sidebar width
                boxSizing: "border-box",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: "width 0.3s ease", // Smooth opening/closing transition
              },
            }}
          >
            <Toolbar /> {/* Provides space below the AppBar */}
            <List>
              {/* Renders navigation items */}
              {navItems.map((item, index) => (
                <ListItem
                  key={index}
                  component={Link}
                  to={item.path}
                  disablePadding
                >
                  <ListItemButton sx={{ color: theme.palette.text.primary }}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1, // Expands to take available space
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
              p: 3, // Padding
              marginLeft: isDrawerOpen ? `${drawerWidth}px` : "0",
              transition: "margin-left 0.3s ease", // Smooth transition when sidebar opens/closes
            }}
          >
            {/* Define routes for navigation */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sensor-health" element={<SensorHealth />} />
              <Route path="/logger" element={<Logger />} />
              <Route path="/imu-data" element={<IMUData />} />
              <Route
                path="/connect-disconnect"
                element={<ConnectDisconnect />}
              />
              <Route path="/map" element={<Map />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
