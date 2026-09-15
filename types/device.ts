export interface LEDMessage {
  message: string;
  line2?: string;
  color: string;
  brightness: number;
  effect: string;
  speed: number;
  displayLayout: "single-line" | "double-line";
  alignment: "left" | "center" | "right";
  font: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  verticalAlignment: "top" | "center" | "bottom";
  headTailConnected: boolean;
  frame: string;
  background: string;
  imageBackground: string;
}