import { LEDMessage } from "../types/device";
import { sendLEDCommand } from "./firebaseDevice";

export async function sendToDisplay(
  deviceId: string,
  message: LEDMessage
) {
  try {
    await sendLEDCommand(
      deviceId,
      message
    );

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to send command",
    };
  }
}