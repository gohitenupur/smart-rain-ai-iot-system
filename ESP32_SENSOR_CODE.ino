/*
 * SMART RAIN DETECTION SYSTEM - ESP32 SENSOR CODE
 * 
 * This sketch reads sensor data (DHT22, BMP280, Rain Sensor)
 * and sends it to the Node.js backend API
 * 
 * Author: College Project Team
 * Date: 2024
 * 
 * Required Libraries:
 * - DHT sensor library by Adafruit
 * - Adafruit Unified Sensor
 * - Adafruit BMP280 Library
 * - ArduinoJson
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Adafruit_BMP280.h>
#include <ArduinoJson.h>
#include <Wire.h>

// ==================== PIN DEFINITIONS ====================
#define DHT_PIN 4           // GPIO4  - DHT22 DATA
#define DHT_TYPE DHT22
#define I2C_SDA 21          // GPIO21 - I2C SDA (BMP280)
#define I2C_SCL 22          // GPIO22 - I2C SCL (BMP280)
#define RAIN_DIGITAL 35     // GPIO35 - Rain detection digital
#define RAIN_ANALOG 34      // GPIO34 - Rain level analog

// LED Status Pins
#define LED_RED 2           // Error indicator
#define LED_GREEN 5         // OK/Connected
#define LED_YELLOW 18       // Busy/Sending

// ==================== SENSOR OBJECTS ====================
DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP280 bmp280;

// ==================== CONFIGURATION ====================
// WiFi Settings
const char* SSID = "YOUR_SSID";              // Change to your WiFi name
const char* PASSWORD = "YOUR_PASSWORD";      // Change to your WiFi password

// Backend API Settings
const char* BACKEND_URL = "http://192.168.1.100:4000/api/v1";  // Adjust IP/port
const char* DEVICE_ID = "esp32-rain-sensor-01";
const char* API_KEY = "test-api-key-12345";  // Optional: match your backend

// Timing Settings
const unsigned long SENSOR_READ_INTERVAL = 5000;     // Read sensors every 5 seconds
const unsigned long DATA_SEND_INTERVAL = 30000;      // Send data every 30 seconds
const unsigned long HEARTBEAT_INTERVAL = 60000;      // Send heartbeat every 60 seconds

// ==================== GLOBAL VARIABLES ====================
unsigned long lastSensorRead = 0;
unsigned long lastDataSend = 0;
unsigned long lastHeartbeat = 0;

float temperature = 0.0;
float humidity = 0.0;
float pressure = 0.0;
int rainLevel = 0;
boolean rainDetected = false;

// ==================== STATUS INDICATOR FUNCTIONS ====================

void setLED(int pin, boolean state) {
  digitalWrite(pin, state ? HIGH : LOW);
}

void blinkLED(int pin, int times, int delayMs = 200) {
  for (int i = 0; i < times; i++) {
    setLED(pin, true);
    delay(delayMs);
    setLED(pin, false);
    delay(delayMs);
  }
}

void statusOK() {
  setLED(LED_RED, false);
  setLED(LED_GREEN, true);
}

void statusBusy() {
  setLED(LED_RED, false);
  setLED(LED_YELLOW, true);
}

void statusError() {
  setLED(LED_GREEN, false);
  setLED(LED_RED, true);
}

// ==================== SENSOR READING FUNCTIONS ====================

void readDHT22() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[ERROR] DHT22 sensor failed!");
    temperature = -1;
    humidity = -1;
    return;
  }
  
  Serial.print("[SENSOR] Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
}

void readBMP280() {
  if (!bmp280.begin(0x76)) {
    Serial.println("[ERROR] BMP280 sensor not found!");
    return;
  }
  
  pressure = bmp280.readPressure() / 100.0F;  // Convert to hPa
  
  Serial.print("[SENSOR] Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");
}

void readRainSensor() {
  // Digital rain detection
  rainDetected = digitalRead(RAIN_DIGITAL) == LOW ? true : false;
  
  // Analog rain level (0-1023 -> 0-100%)
  int rawValue = analogRead(RAIN_ANALOG);
  rainLevel = map(rawValue, 0, 1023, 0, 100);
  
  Serial.print("[SENSOR] Rain Level: ");
  Serial.print(rainLevel);
  Serial.print("%, Detected: ");
  Serial.println(rainDetected ? "YES" : "NO");
}

void readAllSensors() {
  if (millis() - lastSensorRead >= SENSOR_READ_INTERVAL) {
    lastSensorRead = millis();
    
    Serial.println("[INFO] Reading sensors...");
    readDHT22();
    readBMP280();
    readRainSensor();
  }
}

// ==================== WIFI FUNCTIONS ====================

boolean connectWiFi() {
  Serial.print("[WIFI] Connecting to ");
  Serial.println(SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("[WIFI] Connected! IP: ");
    Serial.println(WiFi.localIP());
    statusOK();
    return true;
  } else {
    Serial.println();
    Serial.println("[ERROR] WiFi connection failed!");
    statusError();
    return false;
  }
}

// ==================== API COMMUNICATION FUNCTIONS ====================

void sendSensorData() {
  if (millis() - lastDataSend < DATA_SEND_INTERVAL) {
    return;  // Not time to send yet
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WARNING] WiFi disconnected! Reconnecting...");
    connectWiFi();
    return;
  }
  
  lastDataSend = millis();
  statusBusy();
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["temperatureC"] = temperature;
  doc["humidityPct"] = humidity;
  doc["pressureHpa"] = pressure;
  doc["rainAnalog"] = rainLevel;
  // ISO-8601 timestamp required by backend Joi schema
  char isoTime[30];
  snprintf(isoTime, sizeof(isoTime), "2024-01-01T00:00:00.000Z"); // replace with NTP if available
  doc["capturedAt"] = isoTime;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("[API] Sending data: ");
  Serial.println(jsonPayload);
  
  // Send HTTP POST request
  HTTPClient http;
  String url = String(BACKEND_URL) + "/sensors/ingest";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + API_KEY);
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200 || httpCode == 201) {
    Serial.print("[SUCCESS] Data sent successfully! Response code: ");
    Serial.println(httpCode);
    statusOK();
  } else {
    Serial.print("[ERROR] HTTP POST failed! Code: ");
    Serial.println(httpCode);
    Serial.println(http.getString());
    statusError();
  }
  
  http.end();
}

void sendHeartbeat() {
  if (millis() - lastHeartbeat < HEARTBEAT_INTERVAL) {
    return;  // Not time to send yet
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  lastHeartbeat = millis();
  
  // Create heartbeat JSON
  StaticJsonDocument<100> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["status"] = "online";
  doc["timestamp"] = millis();
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.println("[HEARTBEAT] Sending heartbeat...");
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/devices/heartbeat";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200 || httpCode == 201) {
    Serial.println("[SUCCESS] Heartbeat sent!");
  } else {
    Serial.print("[WARNING] Heartbeat failed! Code: ");
    Serial.println(httpCode);
  }
  
  http.end();
}

// ==================== SETUP FUNCTION ====================

void setup() {
  // Initialize Serial
  Serial.begin(115200);
  delay(2000);  // Wait for serial to stabilize
  
  Serial.println("\n\n===========================================");
  Serial.println("  SMART RAIN DETECTION SYSTEM - ESP32");
  Serial.println("  Starting initialization...");
  Serial.println("===========================================\n");
  
  // Initialize LED pins
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  setLED(LED_RED, false);
  setLED(LED_GREEN, false);
  setLED(LED_YELLOW, false);
  
  // Startup LED sequence
  blinkLED(LED_RED, 1, 200);
  blinkLED(LED_YELLOW, 1, 200);
  blinkLED(LED_GREEN, 1, 200);
  
  // Initialize sensor pins
  pinMode(RAIN_DIGITAL, INPUT);
  pinMode(RAIN_ANALOG, INPUT);
  
  Serial.println("[INIT] Initializing DHT22 sensor...");
  dht.begin();
  delay(2000);  // DHT needs time to stabilize
  
  Serial.println("[INIT] Initializing BMP280 sensor...");
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!bmp280.begin(0x76)) {
    Serial.println("[WARNING] BMP280 not found on 0x76, trying 0x77...");
    if (!bmp280.begin(0x77)) {
      Serial.println("[ERROR] BMP280 sensor not found!");
      statusError();
    }
  }
  
  Serial.println("[INIT] Connecting to WiFi...");
  statusBusy();
  connectWiFi();
  
  Serial.println("\n[SUCCESS] System initialization complete!\n");
  statusOK();
}

// ==================== MAIN LOOP ====================

void loop() {
  // Read sensors
  readAllSensors();
  
  // Send data to backend
  sendSensorData();
  
  // Send periodic heartbeat
  sendHeartbeat();
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WARNING] WiFi disconnected! Reconnecting...");
    statusError();
    connectWiFi();
  }
  
  delay(100);  // Small delay to prevent overwhelming the loop
}

/* 
 * CONFIGURATION GUIDE:
 * 
 * 1. Update WiFi credentials:
 *    const char* SSID = "YOUR_SSID";
 *    const char* PASSWORD = "YOUR_PASSWORD";
 * 
 * 2. Update backend URL:
 *    const char* BACKEND_URL = "http://YOUR_IP:4000/api/v1";
 * 
 * 3. Adjust sensor intervals as needed:
 *    SENSOR_READ_INTERVAL = time between sensor readings
 *    DATA_SEND_INTERVAL = time between API calls
 * 
 * 4. Upload sketch to ESP32 via Arduino IDE
 * 
 * 5. Open Serial Monitor (115200 baud) to see debug output
 * 
 * EXPECTED OUTPUT:
 * [SENSOR] Temperature: 28.5°C, Humidity: 65%
 * [SENSOR] Pressure: 1013.25 hPa
 * [SENSOR] Rain Level: 45%, Detected: NO
 * [API] Sending data: {...}
 * [SUCCESS] Data sent successfully! Response code: 200
 */
