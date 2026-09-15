import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronRight,
  Monitor,
  Plus,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react-native";
import { router } from "expo-router";

import DeviceCard from "../components/DeviceCard";
import { useDeviceStore } from "../store/deviceStore";

export default function HomeScreen() {
  const devices = useDeviceStore(
    (state) => state.devices
  );

  const selectDevice = useDeviceStore(
    (state) => state.selectDevice
  );

  // ADDED: Get addDevice from the store
  const addDevice = useDeviceStore(
    (state) => state.addDevice
  );

  const onlineCount = devices.filter(
    (device) => device.status === "online"
  ).length;

  const connectingCount = devices.filter(
    (device) => device.status === "connecting"
  ).length;

  const openDevice = (deviceId: string) => {
    selectDevice(deviceId);
    router.push("/device");
  };

  // UPDATED: Add LED Display 02
  const addDisplay = () => {
    const alreadyExists = devices.some(
      (device) => device.id === "led-002"
    );

    if (alreadyExists) {
      Alert.alert(
        "Already Added",
        "LED Display 02 is already in your displays."
      );

      return;
    }

    addDevice({
      id: "led-002",
      name: "LED Display 02",
      connectionType: "wifi",
      brightness: 80,
      displayLayout: "single-line",
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              LED CONTROL
            </Text>

            <Text style={styles.title}>
              My Displays
            </Text>
          </View>

          <Pressable
            style={styles.settingsButton}
            onPress={() =>
              Alert.alert(
                "Settings",
                "Global settings will be added soon."
              )
            }
          >
            <Settings
              size={20}
              color="#0F172A"
            />
          </Pressable>
        </View>

        <View style={styles.splashCard}>
          <View style={styles.splashGlow} />

          <View style={styles.splashHeader}>
            <Text style={styles.splashBadge}>
              LED SPLASH
            </Text>

            <View style={styles.splashSignal}>
              <View style={styles.signalDot} />
              <Text style={styles.signalText}>
                LIVE
              </Text>
            </View>
          </View>

          <Text style={styles.splashTitle}>
            GlowBoard
          </Text>

          <Text style={styles.splashSubtitle}>
            Soft, polished control for every LED display.
          </Text>

          <View style={styles.ledMatrix}>
            {Array.from({ length: 48 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.matrixCell,
                  index % 3 === 0 && styles.matrixCellActive,
                  index % 5 === 0 && styles.matrixCellAccent,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <Monitor
                size={26}
                color="#DC2626"
              />
            </View>

            <View style={styles.livePill}>
              <Zap
                size={13}
                color="#B91C1C"
              />

              <Text style={styles.livePillText}>
                Live
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Control every LED in one place.
          </Text>

          <Text style={styles.heroDescription}>
            Create messages, tune brightness,
            and send color-rich updates straight
            to your LED display.
          </Text>

          <View style={styles.heroStats}>
            <StatCard
              label="Connected"
              value={String(onlineCount)}
              tone="success"
            />

            <StatCard
              label="Pending"
              value={String(connectingCount)}
              tone="warning"
            />

            <StatCard
              label="Displays"
              value={String(devices.length)}
              tone="primary"
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Your Displays
            </Text>

            <Text style={styles.sectionSubtitle}>
              {devices.length}{" "}
              {devices.length === 1
                ? "display"
                : "displays"}
            </Text>
          </View>

          <Pressable
            style={styles.addSmall}
            onPress={addDisplay}
          >
            <Plus
              size={18}
              color="#DC2626"
            />

            <Text style={styles.addSmallText}>
              Add
            </Text>
          </Pressable>
        </View>

        {devices.length > 0 ? (
          <View style={styles.deviceList}>
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onPress={openDevice}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Monitor
                size={30}
                color="#DC2626"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No displays yet
            </Text>

            <Text style={styles.emptyDescription}>
              Add your first LED display to start
              controlling it remotely.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={addDisplay}
            >
              <Plus
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.emptyButtonText}>
                Add Display
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.addDisplayButton}
          onPress={addDisplay}
        >
          <View style={styles.addDisplayIcon}>
            <Plus
              size={20}
              color="#DC2626"
            />
          </View>

          <View style={styles.addDisplayTextArea}>
            <Text style={styles.addDisplayTitle}>
              Add another display
            </Text>

            <Text style={styles.addDisplaySubtitle}>
              Connect an ESP32-powered LED display
            </Text>
          </View>

          <ChevronRight
            size={20}
            color="#94A3B8"
          />
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.footerDot} />

          <Text style={styles.footerText}>
            Powered by Firebase
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "success" | "warning";
}) {
  const toneStyles = {
    primary: styles.statPrimary,
    success: styles.statSuccess,
    warning: styles.statWarning,
  };

  return (
    <View
      style={[
        styles.statCard,
        toneStyles[tone],
      ]}
    >
      <Text style={styles.statLabel}>
        {label}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF8F6",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  header: {
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: "#DC2626",
    letterSpacing: 1.6,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  splashCard: {
    marginTop: 8,
    backgroundColor: "#F6FBFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#D7EEF1",
    padding: 18,
    shadowColor: "#1E293B",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    overflow: "hidden",
  },

  splashGlow: {
    position: "absolute",
    top: -45,
    right: -25,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFD6D6",
    opacity: 0.85,
  },

  splashHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  splashBadge: {
    fontSize: 10,
    color: "#B91C1C",
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  splashSignal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF8F6",
    borderWidth: 1,
    borderColor: "#BFE7E0",
  },

  signalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#30C39E",
  },

  signalText: {
    fontSize: 10,
    color: "#B91C1C",
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  splashTitle: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.2,
  },

  splashSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B6B77",
    fontWeight: "600",
    lineHeight: 20,
  },

  ledMatrix: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    width: "92%",
  },

  matrixCell: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDECF1",
  },

  matrixCellActive: {
    backgroundColor: "#F87171",
    shadowColor: "#EF4444",
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  matrixCellAccent: {
    backgroundColor: "#F9B4B4",
  },

  hero: {
    backgroundColor: "#F9FBFF",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D8EAF2",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EAF7F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3F1E7",
  },

  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EAF5FF",
    borderWidth: 1,
    borderColor: "#CAE6FF",
  },

  livePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B91C1C",
    letterSpacing: 0.5,
  },

  heroTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
  },

  heroDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#516A78",
  },

  heroStats: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
  },

  statPrimary: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },

  statSuccess: {
    backgroundColor: "#EAFBF4",
    borderColor: "#B9EEDB",
  },

  statWarning: {
    backgroundColor: "#FFF7EE",
    borderColor: "#FAD7B4",
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },

  statValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },

  sectionHeader: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 3,
    fontWeight: "700",
  },

  addSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
  },

  addSmallText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "800",
  },

  deviceList: {
    gap: 14,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },

  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },

  emptyButton: {
    marginTop: 20,
    backgroundColor: "#DC2626",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  addDisplayButton: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  addDisplayIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  addDisplayTextArea: {
    flex: 1,
    marginLeft: 12,
  },

  addDisplayTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  addDisplaySubtitle: {
    fontSize: 11,
    color: "#7C8799",
    marginTop: 3,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  footerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 7,
  },

  footerText: {
    fontSize: 11,
    color: "#7C8799",
    fontWeight: "700",
  },
});