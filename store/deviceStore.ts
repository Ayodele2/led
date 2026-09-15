import { create } from "zustand";

export interface Device {
  id: string;
  name: string;
  status: "online" | "offline" | "connecting";
  connectionType: "wifi" | "bluetooth" | "usb" | "unknown";
  brightness: number;
  currentMessage: string;
  displayLayout: "single-line" | "double-line";
}

interface DeviceStore {
  devices: Device[];
  selectedDevice: Device | null;

  selectDevice: (deviceId: string) => void;

  addDevice: (
    device: Omit<Device, "status" | "currentMessage">
  ) => void;

  updateDevice: (
    deviceId: string,
    updates: Partial<Device>
  ) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [
    {
      id: "led-001",
      name: "LED Display 01",
      status: "offline",
      connectionType: "wifi",
      brightness: 80,
      currentMessage: "HELLO WORLD",
      displayLayout: "single-line",
    },
  ],

  selectedDevice: null,

  selectDevice: (deviceId) =>
    set((state) => ({
      selectedDevice:
        state.devices.find(
          (device) => device.id === deviceId
        ) ?? null,
    })),

  addDevice: (device) =>
    set((state) => ({
      devices: [
        ...state.devices,
        {
          ...device,
          status: "offline",
          currentMessage: "HELLO WORLD",
        },
      ],
    })),

  updateDevice: (deviceId, updates) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              ...updates,
            }
          : device
      ),

      selectedDevice:
        state.selectedDevice?.id === deviceId
          ? {
              ...state.selectedDevice,
              ...updates,
            }
          : state.selectedDevice,
    })),
}));