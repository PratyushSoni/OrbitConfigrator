import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { MavLinkSerialConnection } from "./serial.js";

const mavLinkConnection = new MavLinkSerialConnection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.mjs"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../../build/renderer/index.html"));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("mavlink:listSerialPorts", async () => {
  try {
    return await mavLinkConnection.listSerialPorts();
  } catch (error) {
    console.error("Failed to list serial ports:", error);
    return [];
  }
});

ipcMain.handle("mavlink:connectPort", async (event, portName, baudRate) => {
  try {
    const port = mavLinkConnection.connectPort(portName, baudRate);
    return `Port ${portName} opened successfully at ${baudRate}`;
  } catch (error) {
    console.error("Failed to connect to port:", error);
    throw error;
  }
});

ipcMain.on("mavlink:parseMavLinkData", () => {
  try {
    mavLinkConnection.parseMavLinkData();
  } catch (error) {
    console.error("Failed to parse MAVLink data:", error);
  }
});
