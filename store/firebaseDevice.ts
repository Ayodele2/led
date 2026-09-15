import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { LEDMessage } from "../types/device";

export async function sendLEDCommand(
  deviceId: string,
  command: LEDMessage
) {
  const deviceRef = doc(
    db,
    "devices",
    deviceId
  );

  await setDoc(
    deviceRef,
    {
      command: {
        text: command.message,
        color: command.color,
        brightness: command.brightness,
        effect: command.effect,
        speed: command.speed,
        displayLayout:
          command.displayLayout,
      },

      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}