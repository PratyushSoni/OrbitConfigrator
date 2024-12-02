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
      console.error("Error listing serial ports: ", err);
      throw err;
    }
  }

  connectPort(portName, baudRate = 115200) {
    this.port = new SerialPort({ path: portName, baudRate: baudRate });

    this.port.on("open", () => {
      console.log(`Port ${portName} opened at baud rate ${baudRate}`);
    });

    this.port.on("error", (err) => {
      console.error(`Error with serial port ${portName}:`, err);
    });

    return this.port;
  }

  parseMavLinkData() {
    if (!this.port) {
      console.error("No port is connected. Please connect a port first.");
      return;
    }

    const reader = this.port
      .pipe(new MavLinkPacketSplitter())
      .pipe(new MavLinkPacketParser());

    reader.on("data", (packet) => {
      const clazz = this.REGISTRY[packet.header.msgid];
      if (clazz) {
        const data = packet.protocol.data(packet.payload, clazz);
        console.log("Received packet:", data);
      } else {
        console.log(
          `Received packet with unknown msgid: ${packet.header.msgid}`
        );
      }
    });

    reader.on("error", (err) => {
      console.error("Error in MAVLink data parsing:", err);
    });
  }
}
