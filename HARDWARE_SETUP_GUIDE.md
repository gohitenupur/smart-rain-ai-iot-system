# 🔧 HARDWARE SETUP GUIDE - Smart Rain Detection System

## Complete Hardware Setup for College Project

---

## 📋 TABLE OF CONTENTS

1. [Components Required](#components-required)
2. [Wiring Diagram](#wiring-diagram)
3. [Pin Configuration](#pin-configuration)
4. [Board Setup](#board-setup)
5. [Sketch Upload](#sketch-upload)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 📦 COMPONENTS REQUIRED

### **Core Components (Budget: ₹3,500-4,500)**

| S.No | Component | Specs | Qty | Cost (₹) | Notes |
|------|-----------|-------|-----|---------|-------|
| 1 | **ESP32 Dev Kit** | 38-pin, WiFi+BLE | 1 | ₹700 | Main microcontroller |
| 2 | **DHT22 Sensor** | Temperature/Humidity | 1 | ₹400 | Digital sensor |
| 3 | **BMP280 Module** | Barometric Pressure | 1 | ₹300 | I2C interface |
| 4 | **Rain Sensor** | Capacitive/Analog | 1 | ₹600 | Detects rainfall |
| 5 | **Breadboard** | 830-point | 1 | ₹150 | Development board |
| 6 | **Jumper Wires** | 40 pieces | 1 | ₹100 | Connections |
| 7 | **USB Cable** | Micro USB | 1 | ₹150 | Programming cable |
| 8 | **Power Bank** | 5V 2A | 1 | ₹1,000 | Power supply |
| 9 | **Resistors** | 10K, 1K (assorted) | 1 | ₹100 | Pullup resistors |
| 10 | **LEDs** | Red, Green, Yellow | 5 | ₹40 | Status indicators |

**Total: ₹3,540**

---

## 🔌 WIRING DIAGRAM

### **ESP32 Pin Configuration**

```
ESP32 DEV KIT (30-pin version)
┌─────────────────────────┐
│  GND  5V  3V3 EN        │  USB Connection
│  36   39  34  RS        │  
│  D4   D2  D5  D18       │
│  D19  D21 D22 D23       │  UART0 (Serial)
│  D1   D3  GND ---       │  TX=D1, RX=D3
└─────────────────────────┘
```

### **Sensor Connections**

```
┌─────────────────────────────────────────┐
│           SENSOR WIRING MAP             │
├─────────────────────────────────────────┤
│ DHT22 (Temperature/Humidity)            │
│  ├─ VCC → 3V3 (with 10K pullup)         │
│  ├─ GND → GND                           │
│  └─ DATA → GPIO 4 (D4)                  │
│                                         │
│ BMP280 (Pressure - I2C)                 │
│  ├─ VCC → 3V3                           │
│  ├─ GND → GND                           │
│  ├─ SCL → GPIO 22 (D22)                 │
│  └─ SDA → GPIO 21 (D21)                 │
│                                         │
│ Rain Sensor (Analog/Digital)            │
│  ├─ VCC → 5V (or 3V3)                   │
│  ├─ GND → GND                           │
│  ├─ DOUT → GPIO 35 (D35) [Digital]      │
│  └─ AOUT → GPIO 34 (A0)  [Analog]       │
│                                         │
│ Status LEDs                             │
│  ├─ Red LED (Error) → GPIO 2 (D2)       │
│  ├─ Green LED (OK) → GPIO 5 (D5)        │
│  └─ Yellow LED (Busy) → GPIO 18 (D18)   │
│                                         │
│ Push Button (Reset)                     │
│  ├─ Button → GPIO 0 (BOOT)              │
│  └─ GND → GND (with 10K pullup)         │
└─────────────────────────────────────────┘
```

### **Breadboard Connection Layout**

```
LEFT SIDE (Power Distribution)
┌────────────────────────┐
│ 3V3  ─ Red Rail  ─ VCC │
│ GND  ─ Blue Rail ─ GND │
│ 5V   ─ Black Rail      │
└────────────────────────┘

MIDDLE (Sensor Connections)
┌────────────────────────────────────────┐
│ DHT22      BMP280      Rain Sensor   │
│  DAT       I2C          AO           │
│  ║         ║           ║             │
│  GPIO4    GPIO21/22   GPIO34/35      │
└────────────────────────────────────────┘

RIGHT SIDE (LEDs & Indicators)
┌────────────────────────┐
│ Red   Green  Yellow   │
│ D2     D5     D18     │
│ ║      ║      ║       │
│ 330Ω  330Ω   330Ω    │
│ ║      ║      ║       │
│ GND   GND    GND     │
└────────────────────────┘
```

---

## 🎯 PIN CONFIGURATION

### **ESP32 GPIO Mapping**

```c
// Sensor Pins
#define DHT_PIN 4           // GPIO4  (D4)  - Digital
#define I2C_SDA 21          // GPIO21 (D21) - I2C SDA
#define I2C_SCL 22          // GPIO22 (D22) - I2C SCL
#define RAIN_DIGITAL 35     // GPIO35 (D35) - Digital rain detection
#define RAIN_ANALOG 34      // GPIO34 (A0)  - Analog rain level

// LED Pins
#define LED_RED 2           // GPIO2  (D2)  - Error indicator
#define LED_GREEN 5         // GPIO5  (D5)  - OK indicator
#define LED_YELLOW 18       // GPIO18 (D18) - Busy indicator

// Button Pin
#define BUTTON_RESET 0      // GPIO0  (BOOT) - Reset button

// Serial Communication
#define RX_PIN 3            // GPIO3  (D3)  - Serial RX
#define TX_PIN 1            // GPIO1  (D1)  - Serial TX
```

---

## 🖥️ BOARD SETUP (Arduino IDE)

### **Step 1: Install Arduino IDE**
- Download from: https://www.arduino.cc/en/software
- Version: 1.8.19 or later

### **Step 2: Add ESP32 Board Manager**

1. Open Arduino IDE
2. Go to **File** → **Preferences**
3. Add this URL to "Additional Boards Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click **OK**

### **Step 3: Install ESP32 Board Support**

1. Go to **Tools** → **Board** → **Boards Manager**
2. Search for **"ESP32"**
3. Install **"ESP32 by Espressif Systems"** (latest version)
4. Wait for installation (~5-10 minutes)

### **Step 4: Select Board & COM Port**

```
Tools Menu:
├─ Board: "ESP32 Dev Kit" (or similar)
├─ Upload Speed: 115200
├─ CPU Frequency: 240MHz
├─ Flash Mode: QIO
├─ Flash Frequency: 80MHz
├─ Flash Size: 4MB
├─ Partition Scheme: Default
└─ COM Port: COM3 (or your port)
```

### **Step 5: Install Required Libraries**

Go to **Sketch** → **Include Library** → **Manage Libraries** and install:

1. **DHT sensor library** by Adafruit
2. **Adafruit Unified Sensor** by Adafruit
3. **Adafruit BMP280 Library** by Adafruit
4. **ArduinoJson** by Benoit Blanchon (v6.x)
5. **HTTPClient** (Built-in with ESP32)

---

## 📤 SKETCH UPLOAD

### **Steps to Upload Code**

1. **Connect ESP32** to computer via USB
2. **Open Arduino IDE**
3. **Verify Code**: Click ✓ (Sketch → Verify/Compile)
4. **Upload**: Click → (Sketch → Upload)
5. **Wait**: Upload progress shows in console
6. **Reset**: Press EN button after upload (if stuck)

### **Expected Output**

```
Sketch uses 523456 bytes (39%) of program storage space
Variables use 45782 bytes (13%) of dynamic memory
Uploading 527344 bytes to flash at 0x00001000

....................................✓

Hard resetting via RTS pin...
```

---

## ✅ TESTING

### **Serial Monitor Testing**

1. Open **Tools** → **Serial Monitor**
2. Set baud rate to **115200**
3. Check for sensor readings:

```
[BOOT] System Starting...
[INFO] Connecting to WiFi...
[INFO] WiFi Connected! IP: 192.168.1.100
[SENSOR] Temperature: 28.5°C
[SENSOR] Humidity: 65%
[SENSOR] Pressure: 1013.25 hPa
[SENSOR] Rain Level: 45%
[DATA] Sending to API...
[SUCCESS] Data posted successfully!
```

### **Hardware Verification Checklist**

- [ ] LEDs light up on power
- [ ] Green LED blinks (connected)
- [ ] Serial output shows sensor values
- [ ] DHT22 temperature is realistic
- [ ] BMP280 pressure is ~1013 hPa
- [ ] Rain sensor responds to water/moisture
- [ ] WiFi connects to network
- [ ] Data sends to backend API

---

## 🔧 TROUBLESHOOTING

### **Issue: ESP32 Not Detected**

**Solution:**
- Install CH340 driver: https://bit.ly/CH340Driver
- Try different USB port
- Use different USB cable (data cable, not charge-only)
- Hold BOOT button while uploading

### **Issue: DHT22 Not Reading**

**Solution:**
- Check 10K pullup resistor is connected
- Verify wire connections
- Ensure power is 3.3V (not 5V)
- Try different GPIO pin
- Restart ESP32

### **Issue: BMP280 Not Detected**

**Solution:**
- Use I2C address scanner:
  ```cpp
  Serial.println(bmp.readPressure());
  // If 0, address mismatch
  ```
- Verify SCL/SDA wires
- Check I2C address (0x76 or 0x77)
- Add 4.7K pullup resistors to SCL/SDA

### **Issue: WiFi Not Connecting**

**Solution:**
- Check SSID and password
- Ensure WiFi is 2.4GHz (ESP32 not compatible with 5GHz)
- Verify network is open or WPA2
- Check signal strength

### **Issue: Backend Connection Failed**

**Solution:**
- Verify backend API is running
- Check API endpoint URL is correct
- Verify backend is accessible from network
- Check firewall settings
- Test with Postman first

---

## 📊 HARDWARE CHECKLIST

### **Before Testing:**
- [ ] All sensors connected
- [ ] Power supply connected
- [ ] USB cable connected
- [ ] LEDs installed
- [ ] Resistors soldered (if needed)
- [ ] No loose wires

### **After Testing:**
- [ ] Sensors reading correctly
- [ ] WiFi connected
- [ ] Backend API receiving data
- [ ] Dashboard showing data
- [ ] All features working

---

## 🎓 COLLEGE PROJECT NOTES

For your college project submission:

1. **Document Everything**
   - Take photos of wiring
   - Keep circuit diagram
   - Save all code versions

2. **Test Before Demo**
   - Test 24 hours before presentation
   - Have backup power bank
   - Keep WiFi accessible

3. **Safety**
   - Don't exceed 5V on analog pins
   - Use proper resistors for LEDs
   - Ensure no short circuits
   - Keep away from water (except rain sensor)

4. **Backup Plan**
   - Have SD card with code backup
   - Keep USB cable handy
   - Have phone hotspot as WiFi backup
   - Test offline mode

---

## 📞 SUPPORT RESOURCES

- **ESP32 Pinout**: https://randomnerdtutorials.com/esp32-pinout-reference/
- **DHT22 Library**: https://learn.adafruit.com/dht/overview
- **BMP280 Library**: https://learn.adafruit.com/adafruit-bmp280-barometric-pressure-plus-altitude-sensor
- **Arduino IDE**: https://www.arduino.cc/en/Guide

---

**Next Steps:** See `ESP32_SENSOR_CODE.ino` for the complete Arduino sketch!
