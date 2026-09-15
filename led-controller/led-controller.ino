#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

/*
  ============================================
  LED CONTROLLER
  ESP32 + Firebase Realtime Database
  ============================================
*/

// ---------- WIFI ----------

#define WIFI_SSID "YOUR_WIFI_NAME"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// ---------- FIREBASE ----------

#define API_KEY "YOUR_FIREBASE_WEB_API_KEY"

#define USER_EMAIL "YOUR_FIREBASE_USER_EMAIL"
#define USER_PASSWORD "YOUR_FIREBASE_USER_PASSWORD"

#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"

// ---------- DEVICE ----------

#define DEVICE_ID "led-001"


// ---------- FIREBASE OBJECTS ----------

UserAuth user_auth(
  API_KEY,
  USER_EMAIL,
  USER_PASSWORD
);

FirebaseApp app;

WiFiClientSecure sslClient;

using AsyncClient = AsyncClientClass;

AsyncClient asyncClient(sslClient);

RealtimeDatabase Database;


// ---------- CALLBACK ----------

void processData(AsyncResult &aResult) {

  if (!aResult.isResult()) {
    return;
  }

  if (aResult.isError()) {
    Serial.print("Firebase error: ");
    Serial.println(
      aResult.error().message().c_str()
    );

    return;
  }

  Serial.println(
    "Firebase operation completed."
  );
}


// ---------- CONNECT WIFI ----------

void connectWiFi() {

  Serial.print(
    "Connecting to WiFi"
  );

  WiFi.begin(
    WIFI_SSID,
    WIFI_PASSWORD
  );

  while (
    WiFi.status() != WL_CONNECTED
  ) {

    delay(500);

    Serial.print(".");
  }

  Serial.println();

  Serial.println(
    "WiFi connected!"
  );

  Serial.print(
    "IP: "
  );

  Serial.println(
    WiFi.localIP()
  );
}


// ---------- READ COMMAND ----------

void readLEDCommand() {

  if (!app.ready()) {
    return;
  }

  String path =
    "/devices/" +
    String(DEVICE_ID) +
    "/command";

  Serial.println();
  Serial.println(
    "Checking Firebase..."
  );

  String json =
    Database.get<String>(
      asyncClient,
      path
    );

  if (json.length() == 0) {

    Serial.println(
      "No command found."
    );

    return;
  }

  Serial.println(
    "Firebase command:"
  );

  Serial.println(json);

  processLEDCommand(json);
}


// ---------- PROCESS COMMAND ----------

void processLEDCommand(
  String json
) {

  Serial.println();
  Serial.println(
    "=============================="
  );

  Serial.println(
    "NEW LED COMMAND"
  );

  Serial.println(
    "=============================="
  );

  Serial.println(json);

  /*
    For now we are printing the
    complete Firebase command.

    Once we identify the physical
    LED controller, this function
    will translate these values
    into actual LED commands.
  */

  Serial.println(
    "LED command received."
  );
}


// ---------- DEVICE HEARTBEAT ----------

void updateDeviceStatus() {

  if (!app.ready()) {
    return;
  }

  String path =
    "/devices/" +
    String(DEVICE_ID) +
    "/status";

  Database.set<String>(
    asyncClient,
    path,
    "online",
    processData,
    "deviceStatus"
  );

  String lastSeenPath =
    "/devices/" +
    String(DEVICE_ID) +
    "/lastSeen";

  Database.set<int>(
    asyncClient,
    lastSeenPath,
    millis(),
    processData,
    "deviceHeartbeat"
  );
}


// ---------- SETUP ----------

void setup() {

  Serial.begin(115200);

  delay(1000);

  Serial.println();
  Serial.println(
    "================================"
  );

  Serial.println(
    "LED CONTROLLER STARTING"
  );

  Serial.println(
    "================================"
  );

  connectWiFi();

  // SSL
  sslClient.setInsecure();

  sslClient.setConnectionTimeout(
    1000
  );

  sslClient.setHandshakeTimeout(
    5
  );

  // Firebase authentication

  initializeApp(
    asyncClient,
    app,
    getAuth(user_auth),
    processData,
    "firebaseAuth"
  );

  app.getApp<RealtimeDatabase>(
    Database
  );

  Database.url(
    DATABASE_URL
  );

  Serial.println(
    "Firebase initialized."
  );
}


// ---------- LOOP ----------

unsigned long lastCommandCheck = 0;

unsigned long lastHeartbeat = 0;

const unsigned long COMMAND_INTERVAL =
  1000;

const unsigned long HEARTBEAT_INTERVAL =
  10000;


void loop() {

  app.loop();

  unsigned long now =
    millis();

  // Check Firebase every second

  if (
    now - lastCommandCheck >=
    COMMAND_INTERVAL
  ) {

    lastCommandCheck = now;

    readLEDCommand();
  }

  // Heartbeat every 10 seconds

  if (
    now - lastHeartbeat >=
    HEARTBEAT_INTERVAL
  ) {

    lastHeartbeat = now;

    updateDeviceStatus();
  }
}