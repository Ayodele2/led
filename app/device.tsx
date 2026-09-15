import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Bold,
  ChevronRight,
  Italic,
  Minus,
  Plus,
  Send,
  Settings2,
  Underline,
} from "lucide-react-native";

import { router } from "expo-router";

import { useDeviceStore } from "../store/deviceStore";
import { hardware } from "../services/hardware";

/* =========================================================
   TYPES
========================================================= */

type Layout =
  | "single-line"
  | "double-line";

type Effect =
  | "static"
  | "scroll-left"
  | "scroll-right"
  | "blink";

type Alignment =
  | "left"
  | "center"
  | "right";

type VerticalAlignment =
  | "top"
  | "center"
  | "bottom";

/* =========================================================
   DEVICE SCREEN
========================================================= */

export default function DeviceScreen() {
  const selectedDevice = useDeviceStore(
    (state) => state.selectedDevice
  );

  const updateDevice = useDeviceStore(
    (state) => state.updateDevice
  );

  /* =======================================================
     TEXT
  ======================================================= */

  const [activeText, setActiveText] =
    useState<1 | 2>(1);

  const [line1, setLine1] = useState(
    selectedDevice?.currentMessage ||
      "HELLO WORLD"
  );

  const [line2, setLine2] =
    useState("WELCOME");

  /* =======================================================
     DISPLAY
  ======================================================= */

  const [displayLayout, setDisplayLayout] =
    useState<Layout>(
      selectedDevice?.displayLayout ||
        "single-line"
    );

  /* =======================================================
     FONT
  ======================================================= */

  const [font, setFont] =
    useState("MONOSPACE");

  const [fontSize, setFontSize] =
    useState(17);

  /* =======================================================
     TEXT STYLE
  ======================================================= */

  const [textColor, setTextColor] =
    useState("#FF5A5A");

  const [bold, setBold] =
    useState(false);

  const [italic, setItalic] =
    useState(false);

  const [underline, setUnderline] =
    useState(false);

  /* =======================================================
     ALIGNMENT
  ======================================================= */

  const [alignment, setAlignment] =
    useState<Alignment>("center");

  const [verticalAlignment, setVerticalAlignment] =
    useState<VerticalAlignment>("center");

  /* =======================================================
     EFFECT
  ======================================================= */

  const [effect, setEffect] =
    useState<Effect>("scroll-left");

  const [speed, setSpeed] =
    useState(19);

  /* =======================================================
     BRIGHTNESS
  ======================================================= */

  const [brightness, setBrightness] =
    useState(
      selectedDevice?.brightness || 80
    );

  /* =======================================================
     EXTRA SETTINGS
  ======================================================= */

  const [headTailConnected, setHeadTailConnected] =
    useState(false);

  const [frame, setFrame] =
    useState("No border");

  const [background, setBackground] =
    useState("No background");

  const [imageBackground, setImageBackground] =
    useState(
      "Do not use image background"
    );

  /* =======================================================
     SEND STATE
  ======================================================= */

  const [sending, setSending] =
    useState(false);

  /* =======================================================
     ACTIVE TEXT
  ======================================================= */

  const currentText =
    activeText === 1
      ? line1
      : line2;

  const updateCurrentText = (
    value: string
  ) => {
    if (activeText === 1) {
      setLine1(value);
    } else {
      setLine2(value);
    }
  };

  /* =======================================================
     PREVIEW LINES
  ======================================================= */

  const previewLines = useMemo(() => {
    if (
      displayLayout ===
      "single-line"
    ) {
      return [line1];
    }

    return [line1, line2];
  }, [
    displayLayout,
    line1,
    line2,
  ]);

  /* =======================================================
     NO DEVICE
  ======================================================= */

  if (!selectedDevice) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.empty}>
          <Text
            style={styles.emptyTitle}
          >
            No display selected
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* =======================================================
     SEND TO DISPLAY
  ======================================================= */

  const sendToDisplay = async () => {
    try {
      setSending(true);

      const payload = {
        message: line1,

        line2:
          displayLayout ===
          "double-line"
            ? line2
            : "",

        color: textColor,

        brightness,

        effect,

        speed,

        displayLayout,

        alignment,

        font,

        fontSize,

        bold,

        italic,

        underline,

        verticalAlignment,

        headTailConnected,

        frame,

        background,

        imageBackground,
      } as any;

      const success =
        await hardware.sendMessage(
          selectedDevice.id,
          payload
        );

      if (!success) {
        Alert.alert(
          "Upload failed",
          "Could not send the display program to Firebase."
        );

        return;
      }

      updateDevice(
        selectedDevice.id,
        {
          currentMessage: line1,
          brightness,
          displayLayout,
        }
      );

      Alert.alert(
        "Uploaded",
        "Your LED program has been sent to Firebase."
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Something went wrong while sending the program."
      );
    } finally {
      setSending(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft
            size={22}
            color="#0F172A"
          />
        </Pressable>

        <View
          style={styles.headerCenter}
        >
          <Text
            style={styles.headerTitle}
          >
            {selectedDevice.name}
          </Text>

          <Text
            style={styles.headerSubtitle}
          >
            {selectedDevice.status ===
            "online"
              ? "Online"
              : selectedDevice.status ===
                "connecting"
              ? "Connecting"
              : "Offline"}
          </Text>
        </View>

        <Pressable
          style={styles.iconButton}
        >
          <Settings2
            size={21}
            color="#0F172A"
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* =================================================
            LIVE PREVIEW
        ================================================= */}

        <View
          style={
            styles.previewSection
          }
        >
          <View
            style={
              styles.previewHeader
            }
          >
            <Text
              style={styles.sectionTitle}
            >
              Live Preview
            </Text>

            <View
              style={
                styles.previewStatusPill
              }
            >
              <Text
                style={
                  styles.previewStatusText
                }
              >
                LIVE
              </Text>
            </View>
          </View>

          <View
            style={styles.ledFrame}
          >
            <View
              style={styles.ledScreen}
            >
              {previewLines.map(
                (text, index) => (
                  <PreviewLine
                    key={`${index}-${displayLayout}`}
                    text={text}
                    effect={effect}
                    speed={speed}
                    fontSize={
                      fontSize
                    }
                    textColor={
                      textColor
                    }
                    bold={bold}
                    italic={italic}
                    underline={
                      underline
                    }
                    alignment={
                      alignment
                    }
                    displayLayout={
                      displayLayout
                    }
                    lineIndex={
                      index
                    }
                  />
                )
              )}
            </View>
          </View>
        </View>

        {/* =================================================
            TEXT TABS
        ================================================= */}

        <View
          style={styles.textTabs}
        >
          <Pressable
            style={[
              styles.textTab,
              activeText === 1 &&
                styles.activeTextTab,
            ]}
            onPress={() =>
              setActiveText(1)
            }
          >
            <Text
              style={[
                styles.textTabText,
                activeText === 1 &&
                  styles.textTabTextActive,
              ]}
            >
              Text 1
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.textTab,
              activeText === 2 &&
                styles.activeTextTab,
              displayLayout ===
                "single-line" &&
                styles.disabledTab,
            ]}
            disabled={
              displayLayout ===
              "single-line"
            }
            onPress={() =>
              setActiveText(2)
            }
          >
            <Text
              style={[
                styles.textTabText,
                activeText === 2 &&
                  styles.textTabTextActive,
              ]}
            >
              Text 2
            </Text>
          </Pressable>

          <Pressable
            style={styles.addTab}
            onPress={() =>
              setDisplayLayout(
                "double-line"
              )
            }
          >
            <Plus
              size={20}
              color="#0F172A"
            />
          </Pressable>
        </View>

        {/* =================================================
            MESSAGE INPUT
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Text {activeText}
          </Text>

          <TextInput
            value={currentText}
            onChangeText={
              updateCurrentText
            }
            placeholder="Type your message"
            placeholderTextColor="#9CA3AF"
            multiline
            style={[
              styles.textInput,
              {
                fontFamily:
                  font ===
                  "MONOSPACE"
                    ? "monospace"
                    : undefined,
              },
            ]}
          />
        </View>

        {/* =================================================
            DISPLAY LAYOUT
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Display Layout
          </Text>

          <View
            style={styles.segmented}
          >
            <Pressable
              style={[
                styles.segment,
                displayLayout ===
                  "single-line" &&
                  styles.segmentActive,
              ]}
              onPress={() => {
                setDisplayLayout(
                  "single-line"
                );

                setActiveText(1);
              }}
            >
              <Text
                style={[
                  styles.segmentText,
                  displayLayout ===
                    "single-line" &&
                    styles.segmentTextActive,
                ]}
              >
                Single Line
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segment,
                displayLayout ===
                  "double-line" &&
                  styles.segmentActive,
              ]}
              onPress={() =>
                setDisplayLayout(
                  "double-line"
                )
              }
            >
              <Text
                style={[
                  styles.segmentText,
                  displayLayout ===
                    "double-line" &&
                    styles.segmentTextActive,
                ]}
              >
                Double Line
              </Text>
            </Pressable>
          </View>
        </View>

        {/* =================================================
            FONT
        ================================================= */}

        <SettingRow
          title="Font"
          value={font}
          onPress={() =>
            setFont(
              font === "MONOSPACE"
                ? "DEFAULT"
                : "MONOSPACE"
            )
          }
        />

        {/* =================================================
            FONT SIZE
        ================================================= */}

        <View style={styles.card}>
          <View
            style={
              styles.settingHeader
            }
          >
            <Text
              style={styles.label}
            >
              Font Size
            </Text>

            <Text
              style={styles.value}
            >
              {fontSize}
            </Text>
          </View>

          <View
            style={styles.stepper}
          >
            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setFontSize(
                  Math.max(
                    8,
                    fontSize - 1
                  )
                )
              }
            >
              <Minus
                size={18}
                color="#0F172A"
              />
            </Pressable>

            <View
              style={
                styles.stepValue
              }
            >
              <Text
                style={
                  styles.stepValueText
                }
              >
                {fontSize}
              </Text>

              <Text
                style={
                  styles.stepUnit
                }
              >
                px
              </Text>
            </View>

            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setFontSize(
                  Math.min(
                    64,
                    fontSize + 1
                  )
                )
              }
            >
              <Plus
                size={18}
                color="#0F172A"
              />
            </Pressable>
          </View>
        </View>

        {/* =================================================
            TEXT COLOR
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Text Color
          </Text>

          <View
            style={styles.colorRow}
          >
            {[
              "#FFFFFF",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
            ].map((color) => (
              <Pressable
                key={color}
                onPress={() =>
                  setTextColor(color)
                }
                style={[
                  styles.colorOption,
                  {
                    backgroundColor:
                      color,
                  },
                  textColor === color &&
                    styles.colorSelected,
                ]}
              />
            ))}
          </View>
        </View>

        {/* =================================================
            FORMATTING
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Formatting
          </Text>

          <View
            style={styles.toolbar}
          >
            <ToolButton
              active={bold}
              onPress={() =>
                setBold(!bold)
              }
            >
              <Bold
                size={20}
                color="#0F172A"
              />
            </ToolButton>

            <ToolButton
              active={italic}
              onPress={() =>
                setItalic(!italic)
              }
            >
              <Italic
                size={20}
                color="#0F172A"
              />
            </ToolButton>

            <ToolButton
              active={underline}
              onPress={() =>
                setUnderline(
                  !underline
                )
              }
            >
              <Underline
                size={20}
                color="#0F172A"
              />
            </ToolButton>
          </View>
        </View>

        {/* =================================================
            HORIZONTAL ALIGNMENT
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Horizontal Alignment
          </Text>

          <View
            style={styles.toolbar}
          >
            {(
              [
                "left",
                "center",
                "right",
              ] as Alignment[]
            ).map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.alignmentButton,
                  alignment ===
                    item &&
                    styles.alignmentActive,
                ]}
                onPress={() =>
                  setAlignment(
                    item
                  )
                }
              >
                <Text
                  style={[
                    styles.alignmentText,
                    alignment ===
                      item &&
                      styles.alignmentTextActive,
                  ]}
                >
                  {item
                    .charAt(0)
                    .toUpperCase() +
                    item.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* =================================================
            VERTICAL ALIGNMENT
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Vertical Alignment
          </Text>

          <View
            style={styles.toolbar}
          >
            {(
              [
                "top",
                "center",
                "bottom",
              ] as VerticalAlignment[]
            ).map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.alignmentButton,
                  verticalAlignment ===
                    item &&
                    styles.alignmentActive,
                ]}
                onPress={() =>
                  setVerticalAlignment(
                    item
                  )
                }
              >
                <Text
                  style={[
                    styles.alignmentText,
                    verticalAlignment ===
                      item &&
                      styles.alignmentTextActive,
                  ]}
                >
                  {item
                    .charAt(0)
                    .toUpperCase() +
                    item.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* =================================================
            EFFECT
        ================================================= */}

        <View style={styles.card}>
          <Text
            style={styles.label}
          >
            Animation Effect
          </Text>

          <View
            style={styles.effectGrid}
          >
            <EffectButton
              title="Static"
              active={
                effect === "static"
              }
              onPress={() =>
                setEffect("static")
              }
            />

            <EffectButton
              title="Move Left"
              active={
                effect ===
                "scroll-left"
              }
              onPress={() =>
                setEffect(
                  "scroll-left"
                )
              }
            />

            <EffectButton
              title="Move Right"
              active={
                effect ===
                "scroll-right"
              }
              onPress={() =>
                setEffect(
                  "scroll-right"
                )
              }
            />

            <EffectButton
              title="Blink"
              active={
                effect === "blink"
              }
              onPress={() =>
                setEffect("blink")
              }
            />
          </View>
        </View>

        {/* =================================================
            EFFECT SPEED
        ================================================= */}

        <View style={styles.card}>
          <View
            style={
              styles.settingHeader
            }
          >
            <Text
              style={styles.label}
            >
              Effect Speed
            </Text>

            <Text
              style={styles.value}
            >
              {speed}
            </Text>
          </View>

          <View
            style={styles.stepper}
          >
            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setSpeed(
                  Math.max(
                    1,
                    speed - 1
                  )
                )
              }
            >
              <Minus
                size={18}
                color="#0F172A"
              />
            </Pressable>

            <View
              style={styles.speedTrack}
            >
              <View
                style={[
                  styles.speedFill,
                  {
                    width: `${Math.min(
                      speed,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>

            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setSpeed(
                  Math.min(
                    100,
                    speed + 1
                  )
                )
              }
            >
              <Plus
                size={18}
                color="#0F172A"
              />
            </Pressable>
          </View>
        </View>

        {/* =================================================
            BRIGHTNESS
        ================================================= */}

        <View style={styles.card}>
          <View
            style={
              styles.settingHeader
            }
          >
            <Text
              style={styles.label}
            >
              Brightness
            </Text>

            <Text
              style={styles.value}
            >
              {brightness}%
            </Text>
          </View>

          <View
            style={styles.stepper}
          >
            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setBrightness(
                  Math.max(
                    10,
                    brightness - 10
                  )
                )
              }
            >
              <Minus
                size={18}
                color="#0F172A"
              />
            </Pressable>

            <View
              style={
                styles.brightnessTrack
              }
            >
              <View
                style={[
                  styles.brightnessFill,
                  {
                    width: `${brightness}%`,
                  },
                ]}
              />
            </View>

            <Pressable
              style={
                styles.stepButton
              }
              onPress={() =>
                setBrightness(
                  Math.min(
                    100,
                    brightness + 10
                  )
                )
              }
            >
              <Plus
                size={18}
                color="#0F172A"
              />
            </Pressable>
          </View>
        </View>

        {/* =================================================
            HEAD / TAIL
        ================================================= */}

        <ToggleRow
          title="Head and Tail Connected"
          enabled={
            headTailConnected
          }
          onToggle={() =>
            setHeadTailConnected(
              !headTailConnected
            )
          }
        />

        {/* =================================================
            FRAME
        ================================================= */}

        <SettingRow
          title="Frame"
          value={frame}
          onPress={() =>
            setFrame(
              frame ===
                "No border"
                ? "Border"
                : "No border"
            )
          }
        />

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <SettingRow
          title="Background"
          value={background}
          onPress={() =>
            setBackground(
              background ===
                "No background"
                ? "Black"
                : "No background"
            )
          }
        />

        {/* =================================================
            IMAGE BACKGROUND
        ================================================= */}

        <SettingRow
          title="Image Background"
          value={
            imageBackground
          }
          onPress={() =>
            setImageBackground(
              imageBackground ===
                "Do not use image background"
                ? "Use image background"
                : "Do not use image background"
            )
          }
        />

        {/* =================================================
            SEND
        ================================================= */}

        <Pressable
          style={[
            styles.sendButton,
            sending &&
              styles.sendButtonDisabled,
          ]}
          disabled={sending}
          onPress={
            sendToDisplay
          }
        >
          <Send
            size={19}
            color="#FFFFFF"
          />

          <Text
            style={styles.sendText}
          >
            {sending
              ? "SENDING..."
              : "SEND TO DISPLAY"}
          </Text>
        </Pressable>

        <Text
          style={
            styles.firebaseText
          }
        >
          Changes are sent through
          Firebase
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   LED PREVIEW
========================================================= */

function PreviewLine({
  text,
  effect,
  speed,
  fontSize,
  textColor,
  bold,
  italic,
  underline,
  alignment,
  displayLayout,
  lineIndex,
}: {
  text: string;
  effect: Effect;
  speed: number;
  fontSize: number;
  textColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: Alignment;
  displayLayout: Layout;
  lineIndex: number;
}) {
  /* =======================================================
     ANIMATION VALUES
  ======================================================= */

  const scrollX =
    useRef(
      new Animated.Value(0)
    ).current;

  const blinkOpacity =
    useRef(
      new Animated.Value(1)
    ).current;

  /* =======================================================
     MEASUREMENTS
  ======================================================= */

  const [
    viewportWidth,
    setViewportWidth,
  ] = useState(0);

  const [
    contentWidth,
    setContentWidth,
  ] = useState(0);

  /* =======================================================
     TEXT
  ======================================================= */

  const cleanText =
    text.trim() || " ";

  const actualFontSize =
    Math.max(
      12,
      Math.min(fontSize, 30)
    );

  /* =======================================================
     TEXT STYLE
  ======================================================= */

  const textStyle = {
    fontSize: actualFontSize,

    color: textColor,

    fontWeight: bold
      ? "700"
      : "400",

    fontStyle: italic
      ? "italic"
      : "normal",

    textDecorationLine:
      underline
        ? "underline"
        : "none",
  } as const;

  /* =======================================================
     BLINK EFFECT
  ======================================================= */

  useEffect(() => {
    if (effect !== "blink") {
      blinkOpacity.stopAnimation();

      blinkOpacity.setValue(1);

      return;
    }

    /*
     * Higher speed =
     * faster blinking.
     */

    const blinkDuration =
      Math.max(
        100,
        700 - speed * 6
      );

    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            blinkOpacity,
            {
              toValue: 0.15,

              duration:
                blinkDuration,

              easing:
                Easing.linear,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            blinkOpacity,
            {
              toValue: 1,

              duration:
                blinkDuration,

              easing:
                Easing.linear,

              useNativeDriver:
                true,
            }
          ),
        ])
      );

    animation.start();

    return () => {
      animation.stop();

      blinkOpacity.setValue(1);
    };
  }, [
    effect,
    speed,
    blinkOpacity,
  ]);

  /* =======================================================
     MARQUEE EFFECT
  ======================================================= */

  useEffect(() => {
    const isScrolling =
      effect ===
        "scroll-left" ||
      effect ===
        "scroll-right";

    /*
     * If the current effect is not
     * a scrolling effect, reset.
     */

    if (!isScrolling) {
      scrollX.stopAnimation();

      scrollX.setValue(0);

      return;
    }

    /*
     * We cannot calculate the animation
     * until both dimensions are known.
     */

    if (
      viewportWidth <= 0 ||
      contentWidth <= 0
    ) {
      return;
    }

    /*
     * =====================================================
     * REAL EMPTY DISPLAY GAP
     * =====================================================
     *
     * This is important.
     *
     * We don't simply put a small margin
     * between two copies of the text.
     *
     * Instead, the first message completely
     * leaves the display.
     *
     * The display then stays completely
     * empty for a short period.
     *
     * Then the next message enters.
     */

    const darkGap =
      Math.max(
        100,
        Math.min(
          220,
          actualFontSize * 5
        )
      );

    /*
     * =====================================================
     * COMPLETE TRAVEL DISTANCE
     * =====================================================
     *
     * The message travels:
     *
     * 1. Its own width
     * 2. The entire display width
     * 3. The empty/dark gap
     */

    const period =
      contentWidth +
      viewportWidth +
      darkGap;

    /*
     * =====================================================
     * SPEED
     * =====================================================
     *
     * Convert the UI speed value
     * into pixels per second.
     *
     * speed 1  -> slow
     * speed 19 -> medium
     * speed 100 -> fast
     */

    const pixelsPerSecond =
      20 + speed * 3.2;

    /*
     * Calculate how long the
     * complete cycle should take.
     */

    const duration =
      Math.max(
        1200,
        (period /
          pixelsPerSecond) *
          1000
      );

    /*
     * Reset before starting.
     */

    scrollX.stopAnimation();

    scrollX.setValue(0);

    /*
     * =====================================================
     * START MARQUEE
     * =====================================================
     */

    const animation =
      Animated.loop(
        Animated.timing(
          scrollX,
          {
            toValue:
              effect ===
              "scroll-left"
                ? -period
                : period,

            duration,

            easing:
              Easing.linear,

            useNativeDriver:
              true,
          }
        )
      );

    animation.start();

    /*
     * Cleanup.
     */

    return () => {
      animation.stop();

      scrollX.setValue(0);
    };
  }, [
    effect,
    speed,
    viewportWidth,
    contentWidth,
    actualFontSize,
    scrollX,
  ]);

  /* =======================================================
     STATIC
  ======================================================= */

  if (effect === "static") {
    return (
      <View
        style={[
          styles.ledLine,

          displayLayout ===
            "double-line" &&
            lineIndex === 0 &&
            styles.ledLineBorder,
        ]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          style={[
            styles.ledText,

            textStyle,

            {
              width: "100%",
              textAlign:
                alignment,
            },
          ]}
        >
          {cleanText}
        </Text>
      </View>
    );
  }

  /* =======================================================
     BLINK
  ======================================================= */

  if (effect === "blink") {
    return (
      <View
        style={[
          styles.ledLine,

          displayLayout ===
            "double-line" &&
            lineIndex === 0 &&
            styles.ledLineBorder,
        ]}
      >
        <Animated.Text
          numberOfLines={1}
          ellipsizeMode="clip"
          style={[
            styles.ledText,

            textStyle,

            {
              width: "100%",

              textAlign:
                alignment,

              opacity:
                blinkOpacity,
            },
          ]}
        >
          {cleanText}
        </Animated.Text>
      </View>
    );
  }

  /* =======================================================
     MARQUEE
  ======================================================= */

  /*
   * Same gap used by the animation.
   */

  const darkGap =
    Math.max(
      100,
      Math.min(
        220,
        actualFontSize * 5
      )
    );

  return (
    <View
      style={[
        styles.ledLine,

        displayLayout ===
          "double-line" &&
          lineIndex === 0 &&
          styles.ledLineBorder,
      ]}
    >
      {/* =================================================
          VIEWPORT
      ================================================= */}

      <View
        style={
          styles.marqueeViewport
        }
        onLayout={(event) => {
          setViewportWidth(
            event.nativeEvent
              .layout.width
          );
        }}
      >
        {/* ===============================================
            MOVING TRACK
        =============================================== */}

        <Animated.View
          style={[
            styles.marqueeTrack,

            {
              transform: [
                {
                  translateX:
                    scrollX,
                },
              ],
            },
          ]}
        >
          {/* =============================================
              MESSAGE 1
          ============================================= */}

          <Text
            numberOfLines={1}
            onLayout={(event) => {
              /*
               * IMPORTANT:
               *
               * We measure the actual rendered
               * width instead of estimating
               * width from character count.
               */

              setContentWidth(
                event.nativeEvent
                  .layout.width
              );
            }}
            style={[
              styles.ledText,

              textStyle,

              styles.marqueeText,
            ]}
          >
            {cleanText}
          </Text>

          {/* =============================================
              REAL EMPTY / DARK GAP
          ============================================= */}

          <View
            style={{
              width:
                viewportWidth +
                darkGap,
            }}
          />

          {/* =============================================
              MESSAGE 2
          ============================================= */}

          <Text
            numberOfLines={1}
            style={[
              styles.ledText,

              textStyle,

              styles.marqueeText,
            ]}
          >
            {cleanText}
          </Text>

          {/* =============================================
              SECOND EMPTY / DARK GAP
          ============================================= */}

          <View
            style={{
              width:
                viewportWidth +
                darkGap,
            }}
          />

          {/* =============================================
              MESSAGE 3
          ============================================= */}

          <Text
            numberOfLines={1}
            style={[
              styles.ledText,

              textStyle,

              styles.marqueeText,
            ]}
          >
            {cleanText}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={
        styles.settingRow
      }
      onPress={onPress}
    >
      <Text
        style={
          styles.settingTitle
        }
      >
        {title}
      </Text>

      <View
        style={
          styles.settingRight
        }
      >
        <Text
          style={
            styles.settingValue
          }
        >
          {value}
        </Text>

        <ChevronRight
          size={18}
          color="#94A3B8"
        />
      </View>
    </Pressable>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleRow({
  title,
  enabled,
  onToggle,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      style={
        styles.settingRow
      }
      onPress={onToggle}
    >
      <Text
        style={
          styles.settingTitle
        }
      >
        {title}
      </Text>

      <View
        style={[
          styles.toggle,

          enabled &&
            styles.toggleEnabled,
        ]}
      >
        <View
          style={[
            styles.toggleKnob,

            enabled &&
              styles.toggleKnobEnabled,
          ]}
        />
      </View>
    </Pressable>
  );
}

/* =========================================================
   TOOL BUTTON
========================================================= */

function ToolButton({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toolButton,

        active &&
          styles.toolButtonActive,
      ]}
    >
      {children}
    </Pressable>
  );
}

/* =========================================================
   EFFECT BUTTON
========================================================= */

function EffectButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.effectButton,

        active &&
          styles.effectButtonActive,
      ]}
    >
      <Text
        style={[
          styles.effectButtonText,

          active &&
            styles.effectButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       SCREEN
    ===================================================== */

    container: {
      flex: 1,

      backgroundColor:
        "#EEF8F6",
    },

    scrollContent: {
      paddingBottom: 42,
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      height: 80,

      backgroundColor:
        "#F9FBFF",

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 18,

      borderBottomWidth: 1,

      borderBottomColor:
        "#D7EEF1",

      shadowColor:
        "#0F172A",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.05,

      shadowRadius: 6,

      elevation: 2,
    },

    headerCenter: {
      flex: 1,

      alignItems: "center",
    },

    headerTitle: {
      fontSize: 20,

      fontWeight: "800",

      color: "#0F172A",

      letterSpacing: 0.2,
    },

    headerSubtitle: {
      marginTop: 2,

      fontSize: 12,

      color: "#16A34A",

      fontWeight: "700",

      letterSpacing: 0.6,
    },

    iconButton: {
      width: 42,

      height: 42,

      borderRadius: 14,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        "#FFFFFF",

      borderWidth: 1,

      borderColor:
        "#E2E8F0",

      shadowColor:
        "#0F172A",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.06,

      shadowRadius: 8,

      elevation: 2,
    },

    /* =====================================================
       PREVIEW
    ===================================================== */

    previewSection: {
      paddingHorizontal: 16,

      paddingTop: 18,
    },

    previewHeader: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 16,

      fontWeight: "800",

      color: "#0F172A",
    },

    previewStatusPill: {
      borderRadius: 999,

      backgroundColor:
        "#E8F9EE",

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderWidth: 1,

      borderColor:
        "#B7EDC9",
    },

    previewStatusText: {
      fontSize: 10,

      fontWeight: "800",

      color: "#16A34A",

      letterSpacing: 1,
    },

    /* =====================================================
       LED FRAME
    ===================================================== */

    ledFrame: {
      backgroundColor:
        "#0F172A",

      borderRadius: 26,

      padding: 8,

      borderWidth: 1,

      borderColor:
        "#1E293B",

      shadowColor:
        "#0F172A",

      shadowOpacity: 0.22,

      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 12,
      },

      elevation: 6,
    },

    ledScreen: {
      backgroundColor:
        "#020617",

      minHeight: 150,

      overflow: "hidden",

      borderRadius: 18,

      justifyContent:
        "center",

      borderWidth: 1,

      borderColor:
        "#1E293B",
    },

    ledLine: {
      minHeight: 58,

      justifyContent:
        "center",

      paddingHorizontal: 12,
    },

    ledLineBorder: {
      borderBottomWidth: 1,

      borderBottomColor:
        "#4B5563",
    },

    ledText: {
      fontFamily:
        "monospace",

      letterSpacing: 1,
    },

    /* =====================================================
       MARQUEE VIEWPORT
    ===================================================== */

    marqueeViewport: {
      width: "100%",

      overflow: "hidden",

      position: "relative",

      height: 58,

      justifyContent:
        "center",
    },

    /* =====================================================
       MARQUEE TRACK
    ===================================================== */

    marqueeTrack: {
      flexDirection: "row",

      alignItems: "center",

      position: "absolute",

      left: 0,

      top: 0,

      height: 58,
    },

    marqueeText: {
      width: "auto",

      flexShrink: 0,

      textAlign: "left",
    },

    /* =====================================================
       TEXT TABS
    ===================================================== */

    textTabs: {
      flexDirection: "row",

      backgroundColor:
        "#F9FBFF",

      borderBottomWidth: 1,

      borderBottomColor:
        "#D9EAF2",

      marginTop: 18,

      borderTopWidth: 1,

      borderTopColor:
        "#E2E8F0",

      shadowColor:
        "#0F172A",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.03,

      shadowRadius: 8,

      elevation: 1,
    },

    textTab: {
      flex: 1,

      paddingVertical: 15,

      alignItems: "center",

      borderBottomWidth: 3,

      borderBottomColor:
        "transparent",
    },

    activeTextTab: {
      borderBottomColor:
        "#DC2626",

      backgroundColor:
        "#FEE2E2",
    },

    textTabText: {
      fontSize: 14,

      color: "#64748B",

      fontWeight: "700",
    },

    textTabTextActive: {
      color: "#B91C1C",
    },

    disabledTab: {
      opacity: 0.45,
    },

    addTab: {
      width: 58,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#ECF7F5",

      borderLeftWidth: 1,

      borderLeftColor:
        "#D9EAF2",
    },

    /* =====================================================
       CARDS
    ===================================================== */

    card: {
      backgroundColor:
        "#F9FBFF",

      marginHorizontal: 16,

      marginTop: 12,

      padding: 16,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        "#D7EAF2",

      shadowColor:
        "#0F172A",

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.05,

      shadowRadius: 12,

      elevation: 2,
    },

    label: {
      fontSize: 13,

      fontWeight: "800",

      color: "#334155",

      marginBottom: 12,
    },

    /* =====================================================
       TEXT INPUT
    ===================================================== */

    textInput: {
      minHeight: 110,

      borderWidth: 1,

      borderColor:
        "#CFE4EE",

      borderRadius: 14,

      padding: 14,

      color: "#0F172A",

      fontSize: 16,

      textAlignVertical:
        "top",

      backgroundColor:
        "#F4FAFF",
    },

    /* =====================================================
       SEGMENTED CONTROL
    ===================================================== */

    segmented: {
      flexDirection: "row",

      backgroundColor:
        "#EEF5F7",

      borderRadius: 14,

      padding: 4,

      gap: 4,
    },

    segment: {
      flex: 1,

      paddingVertical: 12,

      alignItems: "center",

      borderRadius: 10,
    },

    segmentActive: {
      backgroundColor:
        "#FFFFFF",

      borderWidth: 1,

      borderColor:
        "#D5EAE6",

      shadowColor:
        "#0F172A",

      shadowOpacity: 0.06,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      elevation: 2,
    },

    segmentText: {
      fontSize: 13,

      fontWeight: "700",

      color: "#64748B",
    },

    segmentTextActive: {
      color: "#0F172A",
    },

    /* =====================================================
       SETTING ROW
    ===================================================== */

    settingRow: {
      backgroundColor:
        "#F9FBFF",

      marginHorizontal: 16,

      marginTop: 12,

      minHeight: 62,

      paddingHorizontal: 16,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        "#D7EAF2",

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      shadowColor:
        "#0F172A",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.04,

      shadowRadius: 8,

      elevation: 1,
    },

    settingTitle: {
      fontSize: 14,

      color: "#334155",

      fontWeight: "700",
    },

    settingRight: {
      flexDirection: "row",

      alignItems: "center",

      gap: 4,
    },

    settingValue: {
      fontSize: 13,

      color: "#64748B",

      fontWeight: "700",
    },

    settingHeader: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    value: {
      fontSize: 14,

      fontWeight: "800",

      color: "#0F172A",
    },

    /* =====================================================
       STEPPERS
    ===================================================== */

    stepper: {
      marginTop: 14,

      flexDirection: "row",

      alignItems: "center",

      gap: 12,
    },

    stepButton: {
      width: 40,

      height: 40,

      borderRadius: 12,

      backgroundColor:
        "#EAF8F4",

      borderWidth: 1,

      borderColor:
        "#D0EAE4",

      alignItems: "center",

      justifyContent:
        "center",
    },

    stepValue: {
      minWidth: 58,

      alignItems:
        "center",
    },

    stepValueText: {
      fontSize: 18,

      fontWeight: "800",

      color: "#0F172A",
    },

    stepUnit: {
      fontSize: 10,

      color: "#94A3B8",

      fontWeight: "700",
    },

    /* =====================================================
       COLORS
    ===================================================== */

    colorRow: {
      flexDirection: "row",

      gap: 14,

      flexWrap: "wrap",
    },

    colorOption: {
      width: 34,

      height: 34,

      borderRadius: 17,

      borderWidth: 2,

      borderColor:
        "#D1D5DB",
    },

    colorSelected: {
      borderColor:
        "#EF4444",

      shadowColor:
        "#EF4444",

      shadowOpacity: 0.4,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 2,
    },

    /* =====================================================
       TOOLBAR
    ===================================================== */

    toolbar: {
      flexDirection: "row",

      gap: 8,

      flexWrap: "wrap",
    },

    toolButton: {
      width: 48,

      height: 44,

      borderRadius: 12,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#ECF4F8",

      borderWidth: 1,

      borderColor:
        "#D7EAF2",
    },

    toolButtonActive: {
      backgroundColor:
        "#FEE2E2",

      borderColor:
        "#FCA5A5",
    },

    /* =====================================================
       ALIGNMENT
    ===================================================== */

    alignmentButton: {
      paddingHorizontal: 16,

      paddingVertical: 11,

      borderRadius: 10,

      backgroundColor:
        "#ECF4F8",

      borderWidth: 1,

      borderColor:
        "#D7EAF2",
    },

    alignmentActive: {
      backgroundColor:
        "#FEE2E2",

      borderColor:
        "#FCA5A5",
    },

    alignmentText: {
      color: "#475569",

      fontSize: 13,

      fontWeight: "700",
    },

    alignmentTextActive: {
      color: "#B91C1C",
    },

    /* =====================================================
       EFFECT
    ===================================================== */

    effectGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 8,
    },

    effectButton: {
      width: "48%",

      paddingVertical: 13,

      borderRadius: 12,

      alignItems: "center",

      backgroundColor:
        "#ECF4F8",

      borderWidth: 1,

      borderColor:
        "#D7EAF2",
    },

    effectButtonActive: {
      backgroundColor:
        "#FEE2E2",

      borderColor:
        "#FCA5A5",
    },

    effectButtonText: {
      fontSize: 13,

      fontWeight: "700",

      color: "#4B5563",
    },

    effectButtonTextActive: {
      color: "#B91C1C",
    },

    /* =====================================================
       SPEED
    ===================================================== */

    speedTrack: {
      flex: 1,

      height: 8,

      backgroundColor:
        "#E2E8F0",

      borderRadius: 10,

      overflow: "hidden",
    },

    speedFill: {
      height: "100%",

      backgroundColor:
        "#DC2626",

      borderRadius: 10,
    },

    /* =====================================================
       BRIGHTNESS
    ===================================================== */

    brightnessTrack: {
      flex: 1,

      height: 8,

      backgroundColor:
        "#E2E8F0",

      borderRadius: 10,

      overflow: "hidden",
    },

    brightnessFill: {
      height: "100%",

      backgroundColor:
        "#F2B66D",

      borderRadius: 10,
    },

    /* =====================================================
       TOGGLE
    ===================================================== */

    toggle: {
      width: 50,

      height: 28,

      borderRadius: 16,

      backgroundColor:
        "#CBD5E1",

      padding: 3,

      justifyContent:
        "center",
    },

    toggleEnabled: {
      backgroundColor:
        "#DC2626",
    },

    toggleKnob: {
      width: 22,

      height: 22,

      borderRadius: 11,

      backgroundColor:
        "#FFFFFF",
    },

    toggleKnobEnabled: {
      alignSelf: "flex-end",
    },

    /* =====================================================
       SEND BUTTON
    ===================================================== */

    sendButton: {
      marginHorizontal: 16,

      marginTop: 24,

      height: 58,

      borderRadius: 18,

      backgroundColor:
        "#DC2626",

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 10,

      shadowColor:
        "#DC2626",

      shadowOpacity: 0.25,

      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 4,
    },

    sendButtonDisabled: {
      opacity: 0.65,
    },

    sendText: {
      color: "#FFFFFF",

      fontSize: 15,

      fontWeight: "800",

      letterSpacing: 0.5,
    },

    firebaseText: {
      textAlign: "center",

      marginTop: 10,

      fontSize: 11,

      color: "#64748B",

      fontWeight: "700",
    },

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    empty: {
      flex: 1,

      justifyContent:
        "center",

      alignItems: "center",

      padding: 20,
    },

    emptyTitle: {
      fontSize: 20,

      fontWeight: "800",

      marginBottom: 20,
    },

    primaryButton: {
      backgroundColor:
        "#DC2626",

      paddingHorizontal: 24,

      paddingVertical: 14,

      borderRadius: 12,
    },

    primaryButtonText: {
      color: "#FFFFFF",

      fontWeight: "700",
    },
  });