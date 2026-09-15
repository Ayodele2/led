import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ChevronRight,
  Monitor,
  MoreVertical,
  Wifi,
  WifiOff,
} from "lucide-react-native";

import { Device } from "../store/deviceStore";

interface DeviceCardProps {
  device: Device;
  onPress: (deviceId: string) => void;
}

export default function DeviceCard({
  device,
  onPress,
}: DeviceCardProps) {
  const isOnline = device.status === "online";
  const isConnecting = device.status === "connecting";

  return (
    <Pressable
      key={device.id}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(device.id)}
    >
      <View style={styles.headerRow}>
        <View style={styles.identityRow}>
          <View
            style={[
              styles.deviceIcon,
              isOnline && styles.deviceIconOnline,
              isConnecting && styles.deviceIconConnecting,
            ]}
          >
            <Monitor
              size={22}
              color={
                isOnline
                  ? "#DC2626"
                  : isConnecting
                  ? "#D97706"
                  : "#6B7280"
              }
            />
          </View>

          <View style={styles.nameArea}>
            <Text style={styles.name}>
              {device.name}
            </Text>
            <Text style={styles.idText}>
              {device.id}
            </Text>
          </View>
        </View>

        <MoreVertical
          size={20}
          color="#9CA3AF"
        />
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusBadge,
            isOnline && styles.statusOnline,
            isConnecting && styles.statusConnecting,
          ]}
        >
          {isOnline ? (
            <Wifi size={12} color="#16A34A" />
          ) : (
            <WifiOff
              size={12}
              color={
                isConnecting
                  ? "#D97706"
                  : "#6B7280"
              }
            />
          )}

          <Text
            style={[
              styles.statusText,
              isOnline && styles.statusTextOnline,
              isConnecting && styles.statusTextConnecting,
            ]}
          >
            {isOnline
              ? "ONLINE"
              : isConnecting
              ? "CONNECTING"
              : "OFFLINE"}
          </Text>
        </View>

        <Text style={styles.connectionType}>
          {device.connectionType.toUpperCase()}
        </Text>
      </View>

      <View style={styles.previewWrap}>
        <View style={styles.previewOuter}>
          <View style={styles.previewScreen}>
            <Text
              numberOfLines={1}
              style={styles.previewText}
            >
              {device.currentMessage || "READY"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>
            Layout
          </Text>
          <Text style={styles.infoValue}>
            {device.displayLayout === "double-line"
              ? "Double Line"
              : "Single Line"}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>
            Brightness
          </Text>
          <Text style={styles.infoValue}>
            {device.brightness}%
          </Text>
        </View>

        <View style={styles.controlButton}>
          <Text style={styles.controlButtonText}>
            Control
          </Text>
          <ChevronRight
            size={16}
            color="#FFFFFF"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FBFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D8EAF4",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  deviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EDF7F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4EEE9",
  },

  deviceIconOnline: {
    backgroundColor: "#EAF3FF",
    borderColor: "#C7DBFF",
  },

  deviceIconConnecting: {
    backgroundColor: "#FFF4DF",
    borderColor: "#F9D9A8",
  },

  nameArea: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  idText: {
    marginTop: 3,
    fontSize: 11,
    color: "#7C8799",
    fontWeight: "600",
  },

  statusRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEF4F7",
    borderWidth: 1,
    borderColor: "#D9E8F0",
  },

  statusOnline: {
    backgroundColor: "#EAFBF3",
    borderColor: "#BCEAD0",
  },

  statusConnecting: {
    backgroundColor: "#FFF7E9",
    borderColor: "#F8D7A9",
  },

  statusText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  statusTextOnline: {
    color: "#16A34A",
  },

  statusTextConnecting: {
    color: "#D97706",
  },

  connectionType: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },

  previewWrap: {
    marginTop: 16,
  },

  previewOuter: {
    backgroundColor: "#0F172A",
    padding: 6,
    borderRadius: 16,
    shadowColor: "#1E293B",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: "#1E2A39",
  },

  previewScreen: {
    height: 76,
    borderRadius: 10,
    backgroundColor: "#020617",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#1B2433",
  },

  previewText: {
    color: "#F87171",
    fontFamily: "monospace",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  infoRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  infoBlock: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
    fontWeight: "700",
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
  },

  controlButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
