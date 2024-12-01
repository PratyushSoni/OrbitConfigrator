import { CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import StorageIcon from "@mui/icons-material/Storage";
import SensorsIcon from "@mui/icons-material/Sensors";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import MapIcon from "@mui/icons-material/Map";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const Home = () => <div>Home Content</div>;
const SensorHealth = () => <div>Sensor Health Content</div>;
const Logger = () => <div>Logger Content</div>;
const IMUData = () => <div>IMU Data Content</div>;
const ConnectDisconnect = () => <div>Connect/Disconnect Content</div>;
const Map = () => <div>Map Content</div>;

const App = () => {
  const drawerWidth = 250;

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Sensor Health", icon: <HealthAndSafetyIcon />, path: "/sensor-health" },
    { label: "Logger", icon: <StorageIcon />, path: "/logger" },
    { label: "IMU Data", icon: <SensorsIcon />, path: "/imu-data" },
    { label: "Connect/Disconnect", icon: <LinkOffIcon />, path: "/connect-disconnect" },
    { label: "Map", icon: <MapIcon />, path: "/map" },
  ];

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Left Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "F4E0AF",
              color: "#1B1833",
            },
          }}
        >
          <Toolbar />
          <List>
            {navItems.map((item, index) => (
              <ListItem
                button
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  "&:hover": {
                    backgroundColor: "#AA5486",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#61dafb" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginLeft: `${drawerWidth}px`,
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sensor-health" element={<SensorHealth />} />
            <Route path="/logger" element={<Logger />} />
            <Route path="/imu-data" element={<IMUData />} />
            <Route path="/connect-disconnect" element={<ConnectDisconnect />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
