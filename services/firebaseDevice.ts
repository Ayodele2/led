import { ref, set } from "firebase/database";
import { realtimeDb } from "../lib/firebase";
import { LEDMessage } from "../types/device";

export async function sendLEDCommand(
  deviceId: string,
  command: LEDMessage
) {
  console.log(
    "[sendLEDCommand] realtimeDb =",
    realtimeDb ? "initialized" : "undefined/null"
  );
  console.log(
    "[sendLEDCommand] databaseURL =",
    (realtimeDb as any)?.app?.options?.databaseURL
  );

  const commandRef = ref(
    realtimeDb,
    `devices/${deviceId}/command`
  );

  console.log(
    "[sendLEDCommand] ref created at path:",
    `devices/${deviceId}/command`
  );

  const payload = {
    line1: command.message,
    line2: command.line2,

    layout: command.displayLayout,

    alignment: command.alignment,
    verticalAlignment:
      command.verticalAlignment,

    color: command.color,
    brightness: command.brightness,

    effect: command.effect,
    speed: command.speed,

    font: command.font,
    fontSize: command.fontSize,

    bold: command.bold,
    italic: command.italic,
    underline: command.underline,

    headTailConnected:
      command.headTailConnected,

    frame: command.frame,
    background: command.background,
    imageBackground:
      command.imageBackground,

    timestamp: Date.now(),
  };

  console.log("[sendLEDCommand] about to call set()...");

  // Race the write against a timeout so we get a clear signal
  // instead of hanging forever if Firebase never acks.
  const TIMEOUT_MS = 10000;

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `[sendLEDCommand] set() timed out after ${TIMEOUT_MS}ms - likely no network path to Firebase, or wrong databaseURL`
        )
      );
    }, TIMEOUT_MS);
  });

  await Promise.race([set(commandRef, payload), timeout]);

  console.log(
    "LED program uploaded:",
    deviceId
  );
}