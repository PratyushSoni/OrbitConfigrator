import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { MavLinkSerialConnection } from "./serial.js";

const mavLinkConnection = new MavLinkSerialConnection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

const createWindow = () => {
  win = new BrowserWindow({
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

ipcMain.handle("mavlink:listSerialPorts", async (event) => {
  try {
    return await mavLinkConnection.listSerialPorts();
  } catch (error) {
    console.error("Failed to list serial ports:", error);
    return [];
  }
});

ipcMain.handle("mavlink:connectPort", async (event, portName, baudRate) => {
  try {
    const success = await mavLinkConnection.connectPort(portName, baudRate);
    if (success) {
      mavLinkConnection.parseMavLinkData((channel, data) => {
        win.webContents.send(channel, data);
      });
      return `Port ${portName} opened successfully at ${baudRate}`;
    } else {
      throw new Error(`Failed to connect to port ${portName}`);
    }
  } catch (error) {
    console.error("Failed to connect to port:", error);
    throw error;
  }
});

ipcMain.handle("mavlink:disconnectPort", async (event) => {
  try {
    const success = await mavLinkConnection.disconnectPort();
    if (success) {
      return "Port successfully disconnected.";
    } else {
      return "Port is not open or already disconnected.";
    }
  } catch (error) {
    console.error("Failed to disconnect port:", error);
    throw error;
  }
});
