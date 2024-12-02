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
        console.log(
          `Port ${portName} opened successfully at baud rate ${baudRate}`
        );
        resolve(true);
      });

      this.port.on("error", (err) => {
        console.error(`Error opening port ${portName}:`, err);
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

  parseMavLinkData(sender) {
    if (!this.port) {
      console.error("No port is connected. Please connect a port first.");
      return;
    }

    // Create a stream pipeline that reads and parses incoming MAVLink packets
    this.reader = this.port
      .pipe(new MavLinkPacketSplitter())
      .pipe(new MavLinkPacketParser());

    // Attach a listener to read parsed MAVLink data
    this.reader.on("data", (packet) => {
      const clazz = this.REGISTRY[packet.header.msgid];
      if (clazz) {
        const data = packet.protocol.data(packet.payload, clazz);
        sender("mavlink:data", data);
        console.log("Received packet:", data);
      } else {
        console.log(
          `Received packet with unknown msgid: ${packet.header.msgid}`
        );
      }
    });

    // Handle reader errors if any occur
    this.reader.on("error", (err) => {
      console.error("Error in MAVLink data parsing:", err);
    });

    console.log("Started parsing MAVLink data...");
  }
}
