import { SerialPort } from "serialport";
import {
  MavLinkPacketSplitter,
  minimal,
  common,
  ardupilotmega,
  MavLinkPacketParser,
  MavLinkProtocolV2,
} from "node-mavlink";

const REGISTRY = {
  ...minimal.REGISTRY,
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY,
};

export class MavLinkSerialConnection {
  constructor() {
    this.port = null;
    this.REGISTRY = {
      ...minimal.REGISTRY,
      ...common.REGISTRY,
      ...ardupilotmega.REGISTRY,
    };
  }

  async listSerialPorts() {
    try {
      const ports = await SerialPort.list();
      return ports;
    } catch (err) {
      throw err;
    }
  }

  connectPort(portName, baudRate = 115200) {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({ path: portName, baudRate: baudRate });

      this.port.on("open", () => {
        resolve(true);
      });

      this.port.on("error", (err) => {
        reject(false);
      });
    });
  }

  disconnectPort() {
    return new Promise((resolve, reject) => {
      if (this.port && this.port.isOpen) {
        this.port.close((err) => {
          if (err) {
            console.error("Error disconnecting the port:", err);
            reject(err);
          } else {
            console.log("Port successfully disconnected.");
            this.port = null;
            resolve(true);
          }
        });
      } else {
        console.warn("Port is not open or already disconnected.");
        resolve(false);
      }
    });
  }
}
