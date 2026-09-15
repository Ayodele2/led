import { LEDMessage } from "../types/device";
import { sendLEDCommand } from "./firebaseDevice";

export const hardware = {
  async sendMessage(
    deviceId: string,
    message: LEDMessage
  ): Promise<boolean> {
    try {
      await sendLEDCommand(deviceId, message);

      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      return false;
    }
  },

  async setBrightness(
    brightness: number
  ): Promise<boolean> {
    console.log("Brightness:", brightness);
    return true;
  },
};