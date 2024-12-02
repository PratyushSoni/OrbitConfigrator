import { contextBridge, ipcRenderer } from "electron";

// Exposing methods using contextBridge
contextBridge.exposeInMainWorld("mavlink", {
  listSerialPorts: () => ipcRenderer.invoke("mavlink:listSerialPorts"),
  connectPort: (portName, baudRate) =>
    ipcRenderer.invoke("mavlink:connectPort", portName, baudRate),
  parseMavLinkData: () => ipcRenderer.send("mavlink:parseMavLinkData"),
});
