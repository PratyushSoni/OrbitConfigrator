import { contextBridge, ipcRenderer } from "electron";

// Exposing methods using contextBridge
contextBridge.exposeInMainWorld("mavlink", {
  listSerialPorts: () => ipcRenderer.invoke("mavlink:listSerialPorts"),
  connectPort: (portName, baudRate = 115200) =>
    ipcRenderer.invoke("mavlink:connectPort", portName, baudRate),
  disconnectPort: () => ipcRenderer.invoke("mavlink:disconnectPort"),
  onMavLinkData: (callback) => {
    if (callback) {
      ipcRenderer.on("mavlink:data", callback);
    } else {
      ipcRenderer.removeAllListeners("mavlink:data");
    }
  },
});
