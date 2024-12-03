import { useEffect, useState } from "react";
import { Box, Button, TextField, Autocomplete } from "@mui/material";

const ConnectDisconnect = ({ isSidebarOpen }) => {
  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ports = await window.mavlink.listSerialPorts();
        setAvailablePorts(ports);
      } catch (error) {
        console.error("Error fetching serial ports:", error);
      }
    })();
  }, []);

  const handleConnect = async () => {
    if (selectedPort) {
      try {
        const response = await window.mavlink.connectPort(selectedPort);
        console.log(`Attempting to connect to ${selectedPort}`);
        setIsConnected(response);
      } catch (error) {
        console.error("Error connecting to port:", error);
      }
    } else {
      console.error("No port selected");
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await window.mavlink.disconnectPort();
      console.log(response);
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting from port:", error);
    }
  };

  useEffect(() => {
    const mavLinkDataListener = (event, data) => {
      console.log("Received MAVLink data in renderer:", data);
    };
    window.mavlink.onMavLinkData(mavLinkDataListener);
    return () => {
      window.mavlink.onMavLinkData(null);
    };
  }, []);

  return (
    <Box
      sx={{
        marginLeft: isSidebarOpen ? "250px" : "70px", // Adjust width dynamically
        transition: "margin-left 0.3s ease",
        padding: "16px",
      }}
    >
      <Autocomplete
        freeSolo
        id="port-select"
        options={availablePorts.map((port) => port.path)}
        value={selectedPort}
        onChange={(event, newValue) => {
          setSelectedPort(newValue || "");
        }}
        onInputChange={(event, newInputValue) => {
          setSelectedPort(newInputValue);
        }}
        disabled={isConnected}
        renderInput={(params) => (
          <TextField {...params} label="Port" variant="outlined" />
        )}
        sx={{ mb: 2 }} // Add spacing between the dropdown and button
      />
      
      <Button
        variant="contained"
        color={isConnected ? "secondary" : "primary"}
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={!selectedPort}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </Box>
  );
};

export default ConnectDisconnect;
