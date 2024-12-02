import { useEffect, useState } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select, Button } from "@mui/material";

const ConnectDisconnect = () => {
  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState("");

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

  const handleConnect = () => {
    if (selectedPort) {
      try {
        window.mavlink.connectPort(selectedPort);
        console.log(`Attempting to connect to ${selectedPort}`);
      } catch (error) {
        console.error("Error connecting to port:", error);
      }
    } else {
      console.error("No port selected");
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
        color="primary"
        onClick={handleConnect}
        disabled={!selectedPort}
        sx={{ mt: 2 }}
      >
        Connect
      </Button>
    </Box>
  );
};

export default ConnectDisconnect;
