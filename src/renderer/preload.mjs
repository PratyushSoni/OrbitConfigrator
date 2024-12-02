import { contextBridge, ipcRenderer } from "electron";

// Exposing methods using contextBridge
contextBridge.exposeInMainWorld("mavlink", {
  listSerialPorts: () => ipcRenderer.invoke("mavlink:listSerialPorts"),
  connectPort: (portName, baudRate=115200) =>
    ipcRenderer.invoke("mavlink:connectPort", portName, baudRate),
  parseMavLinkData: () => ipcRenderer.send("mavlink:parseMavLinkData"),
});
