import { useEffect, useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
} from "@mui/material";

const ConnectDisconnect = () => {
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

  const handleChange = (event) => {
    setSelectedPort(event.target.value);
  };

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

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="port-select-label">Port</InputLabel>
        <Select
          labelId="port-select-label"
          id="port-select"
          value={selectedPort}
          label="Port"
          onChange={handleChange}
          disabled={isConnected}
        >
          {availablePorts.length > 0 ? (
            availablePorts.map((port, index) => (
              <MenuItem key={index} value={port.path}>
                {port.path}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No ports available</MenuItem>
          )}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color={isConnected ? "secondary" : "primary"}
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={!selectedPort}
        sx={{ mt: 2 }}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </Box>
  );
};

export default ConnectDisconnect;
