# 🔌 WIRING DIAGRAM & CONNECTIONS

## Visual Wiring Guide for Smart Rain Detection System

---

## 📐 ESP32 PINOUT REFERENCE

```
┌──────── ESP32 DEV KIT (30-pin) ────────┐
│                                         │
│  GND   3V3   EN    TX   RX             │  Power & UART
│  │     │     │     │    │              │
│  36    39    34    RS    ─             │  ADC Pins
│  D4    D2    D5    D18   GND           │  GPIO Pins (Digital)
│  D19   D21   D22   D23   D1            │  SPI, I2C Pins
│  D3    GND   ─     ─     ─             │  Serial RX, GND
│                                         │
│  Micro USB (Power & Programming)       │
│                                         │
└─────────────────────────────────────────┘

Pin Groups:
├─ Power: 3V3, 5V, GND
├─ I2C (BMP280): GPIO 21 (SDA), GPIO 22 (SCL)
├─ Digital: GPIO 2, 4, 5, 18, 35
└─ Analog: GPIO 34 (A0)
```

---

## 🔗 COMPLETE WIRING DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  DHT22            BMP280            Rain Sensor                │
│  SENSOR           SENSOR            SENSOR                     │
│  ┌─────┐          ┌──────┐          ┌──────────┐              │
│  │ VCC ├─────────→ 3.3V │          │ VCC      │              │
│  │ GND ├─────────→ GND  │          │ GND      │              │
│  │ DAT │  10K     │ I2C │          │ DO       │              │
│  │     ├─Resistor→ SDA  │          │ AO       │              │
│  └─────┘  to 3.3V └──────┘          └──────────┘              │
│    │                   │                   │                   │
│    │ GPIO 4            │ I2C Pins          │ GPIO 35 & 34      │
│    │ (D4)             │ GPIO 21/22         │ (Digital/Analog)  │
│    ▼                  ▼                    ▼                   │
│ ┌────────────────────────────────────────────────────────┐    │
│ │            ESP32 DEVELOPMENT BOARD                    │    │
│ │                                                        │    │
│ │  ┌─ GND ──────────────────────────────────────────┐  │    │
│ │  │                                                │  │    │
│ │  ├─ 3.3V ──→ DHT22 VCC + BMP280 VCC + Rain VCC  │  │    │
│ │  │                                                │  │    │
│ │  ├─ D4 (GPIO 4) ──→ DHT22 DATA                  │  │    │
│ │  │                                                │  │    │
│ │  ├─ D2 (GPIO 2) ──→ Red LED (+330Ω resistor)   │  │    │
│ │  │                                                │  │    │
│ │  ├─ D5 (GPIO 5) ──→ Green LED (+330Ω resistor) │  │    │
│ │  │                                                │  │    │
│ │  ├─ D18 (GPIO 18) ──→ Yellow LED (+330Ω)       │  │    │
│ │  │                                                │  │    │
│ │  ├─ D21 (GPIO 21) ──→ BMP280 SDA (I2C)         │  │    │
│ │  │                                                │  │    │
│ │  ├─ D22 (GPIO 22) ──→ BMP280 SCL (I2C)         │  │    │
│ │  │                                                │  │    │
│ │  ├─ D35 (GPIO 35) ──→ Rain Sensor DO (Digital) │  │    │
│ │  │                                                │  │    │
│ │  ├─ A0 (GPIO 34) ──→ Rain Sensor AO (Analog)   │  │    │
│ │  │                                                │  │    │
│ │  └─ Micro USB (Power & Program)                 │  │    │
│ │                                                  │  │    │
│ └──────────────────────────────────────────────────┘  │    │
│                                                         │    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📌 SENSOR-BY-SENSOR WIRING

### **DHT22 Temperature/Humidity Sensor**

```
DHT22 Specifications:
├─ Operating Voltage: 3.3V - 6V (use 3.3V for ESP32)
├─ Communication: Digital pulse
├─ Accuracy: ±0.5°C, ±2% humidity
└─ Data Pin: Single wire digital

Wiring:
┌─────────────────┐
│    DHT22        │
│                 │
│ 1. VCC ─────────→ 3.3V (Red wire)
│ 2. DATA ────────→ GPIO 4 (D4) + 10K resistor to 3.3V
│ 3. ─── (empty)
│ 4. GND ─────────→ GND (Black wire)
└─────────────────┘

Pin Details:
└─ Pin 2 (DATA): Connect to GPIO 4 with 10K pullup resistor to 3.3V
   This resistor is CRITICAL for stable communication

Breadboard Layout:
┌────────────────────────┐
│  3.3V ──[10K Resistor] │  ← Connect resistor here
│   ▲        │           │
│   │        ▼           │
│   │+++++ DHT22 +++     │
│        │ │   │         │
│        2 1 3 4         │
│        │ │   │         │
│        │ │   └── GND   │
│        │ │             │
│        0 └─ GPIO 4     │
└────────────────────────┘

```

### **BMP280 Barometric Pressure Sensor**

```
BMP280 Specifications:
├─ Operating Voltage: 3.3V
├─ Communication: I2C (26 kHz - 400 kHz)
├─ I2C Address: 0x76 or 0x77
├─ Pressure Range: 300 - 1100 hPa
└─ Altitude Range: -500 - 9000 m

Wiring:
┌─────────────────┐
│    BMP280       │
│                 │
│ CSB ────────────→ 3.3V (I2C mode)
│ SDO ────────────→ GND (sets address to 0x76)
│ GND ────────────→ GND
│ VCC ────────────→ 3.3V
│ SDA ────────────→ GPIO 21 (D21)
│ SCL ────────────→ GPIO 22 (D22)
└─────────────────┘

I2C Wiring (Wire Protocol):
     ┌──────────────────┐
     │     BMP280       │
     │  ┌────────────┐  │
SDA─→│SCL│ I2C Bus │  │
     │   │  (400k)  │  │
SCL─→│SDA│          │  │
     │  └────────────┘  │
     └──────────────────┘

Address Selection:
├─ SDO → GND  : Address 0x76
└─ SDO → 3.3V : Address 0x77

Pullup Resistors (Optional but Recommended):
├─ 4.7kΩ resistor: SDA to 3.3V
└─ 4.7kΩ resistor: SCL to 3.3V

```

### **Rain Sensor (Capacitive)**

```
Rain Sensor Specifications:
├─ Operating Voltage: 3.3V - 5V
├─ Output: Digital (DO) + Analog (AO)
├─ Sensitivity: Adjustable via potentiometer
├─ Detection Range: 0-100% moisture
└─ Response Time: ~100ms

Wiring:
┌──────────────────┐
│  Rain Sensor     │
│                  │
│ VCC ────────────→ 5V (or 3.3V)
│ GND ────────────→ GND
│ DO ─────────────→ GPIO 35 (D35) [Digital rain detect]
│ AO ─────────────→ GPIO 34 (A0)  [Analog rain level]
└──────────────────┘

Signal Types:
├─ Digital Output (DO):
│  └─ HIGH (5V): No rain detected
│  └─ LOW (0V): Rain detected (threshold-based)
│
└─ Analog Output (AO):
   └─ 0-1023 (ADC): 0% (dry) to 100% (wet)
   └─ Used for gradual rain level detection

Sensitivity Adjustment:
├─ Turn potentiometer clockwise → More sensitive
└─ Turn potentiometer counter-clockwise → Less sensitive

```

### **Status Indicator LEDs**

```
LED Specifications:
├─ Operating Voltage: 5V DC
├─ Current: 20mA typical
├─ Forward Voltage: ~2V
└─ Colors: Red, Green, Yellow

Current Limiting Resistor:
├─ Standard: 330Ω
├─ Formula: R = (Vcc - Vled) / I_led
├─ Example: (5V - 2V) / 0.02A = 150Ω (use 330Ω for safety)

Wiring:
Red LED (Error Status):
     ┌─────────────────┐
     │       LED       │
     │  ┌───────────┐  │
     │  │ + (longer)│  │
     │  │    │      │  │
     │ [330Ω]      │  │
     │  │          │  │
     │  └─ GPIO 2  │  │
     │     │       │  │
     │     ├─ Anode (long leg)
     │     └─ Cathode (short leg) → GND
     └─────────────────┘

Green LED (OK Status):
     GPIO 5 → [330Ω] → LED Anode → LED Cathode → GND

Yellow LED (Busy Status):
     GPIO 18 → [330Ω] → LED Anode → LED Cathode → GND

Breadboard Layout:
┌──────────────────────────────┐
│ GPIO2 ──[330Ω]──→ Red LED ──┐│
│ GPIO5 ──[330Ω]──→ Gre LED ──├┼→ GND
│ GPIO18 ──[330Ω]──→ Yel LED ─┘│
└──────────────────────────────┘

```

---

## 🔌 POWER DISTRIBUTION

```
Power Distribution Block:
┌────────────────────────────┐
│     Power Distribution     │
│                            │
│  USB 5V ──→ [Breadboard]   │
│  │                         │
│  ├─ Red Rail (3.3V Reg) ── 3.3V out
│  │                         │
│  └─ Blue Rail (GND)        │
│     │     ├─ GND           │
│     │     ├─ GND           │
│     │     └─ GND           │
│                            │
└────────────────────────────┘

Current Consumption:
├─ ESP32: 80-160mA (WiFi: 200-300mA)
├─ DHT22: ~2-5mA
├─ BMP280: ~2-5mA
├─ Rain Sensor: ~5-10mA
├─ 3x LEDs: ~20mA (all on)
└─ Total: ~300-400mA average

*Use 5V 2A power bank or dedicated supply
```

---

## 🎨 BREADBOARD LAYOUT

```
Breadboard Setup (830-point):
┌──────────────────────────────────────┐
│  Power Rails           Component Area │
│  ┌─ + (5V) ──────┐   ┌────────────┐ │
│  │               │   │ Component  │ │
│  ├─ - (GND) ─────┤   │  Sockets   │ │
│  │               │   │            │ │
│  │ + + + + +     │   │ +++++++    │ │
│  │ - - - - -     │   │ +++++++    │ │
│  │               │   │ +++++++    │ │
│  │ Rows 1-10     │   │ +++++++    │ │
│  │ Rows 11-20    │   │ +++++++    │ │
│  │ Rows 21-30    │   │ +++++++    │ │
│  │               │   │            │ │
│  └───────────────┘   └────────────┘ │
│        (A-B)              (C-J)      │
└──────────────────────────────────────┘

Component Placement Example:
┌─────────────────────────────────┐
│  + +  ESP32Board   Rain + BMP280 │
│  - -   │ │ │     Sensor  │ │ │   │
│        │ │ │     │ │ │   │ │ │   │
│  + +   DHT22  ┌──┬─┴─┐    I2C    │
│  - -    │ │ │ │  │   │     │ │   │
│         │ │ │ │  │   │     │ │   │
│         + + + +  + +  +     + +   │
│         - - - -  - -  -     - -   │
└─────────────────────────────────┘

Legend:
+ = 5V Rail
- = GND Rail
│ = Vertical connections
─ = Horizontal connections
```

---

## ✅ CONNECTION CHECKLIST

### **ESP32 to Sensors:**
- [ ] DHT22 DATA to GPIO 4 (D4)
- [ ] DHT22 VCC to 3.3V rail
- [ ] DHT22 GND to GND rail
- [ ] DHT22 has 10K resistor to 3.3V

- [ ] BMP280 SDA to GPIO 21 (D21)
- [ ] BMP280 SCL to GPIO 22 (D22)
- [ ] BMP280 VCC to 3.3V rail
- [ ] BMP280 GND to GND rail
- [ ] BMP280 has optional 4.7K pullups

- [ ] Rain Sensor DO to GPIO 35 (D35)
- [ ] Rain Sensor AO to GPIO 34 (A0)
- [ ] Rain Sensor VCC to 3.3V or 5V rail
- [ ] Rain Sensor GND to GND rail

### **LEDs to GPIO:**
- [ ] Red LED Anode to GPIO 2 through 330Ω resistor
- [ ] Red LED Cathode to GND rail
- [ ] Green LED Anode to GPIO 5 through 330Ω resistor
- [ ] Green LED Cathode to GND rail
- [ ] Yellow LED Anode to GPIO 18 through 330Ω resistor
- [ ] Yellow LED Cathode to GND rail

### **Power:**
- [ ] USB cable connected to ESP32
- [ ] Red wire to 5V rail
- [ ] Black wire to GND rail
- [ ] Breadboard power rails connected to ESP32

---

## 🔍 VOLTAGE LEVELS

```
Voltage Reference Table:

GPIO Pins:
├─ Input HIGH: > 2.5V (usually 3.3V)
├─ Input LOW: < 0.8V (usually 0V)
├─ Max Input: 3.6V (damage if exceeded)
└─ Never apply 5V directly to GPIO!

Analog Pins:
├─ ADC Range: 0V - 3.3V (0-1023 in code)
├─ Not 5V tolerant on direct input
└─ Use voltage divider if 5V source needed

Power Rails:
├─ 3.3V Rail: Powers sensors (DHT22, BMP280)
├─ 5V Rail: Powers LEDs, optional 5V devices
└─ GND Rail: Common ground for all components

Digital Logic:
├─ HIGH (1): ~3.3V
├─ LOW (0): ~0V (GND)
└─ Floating pin: ~1.6V (undefined, avoid!)

```

---

## 🚨 COMMON WIRING MISTAKES

| Mistake | Impact | Fix |
|---------|--------|-----|
| 5V on GPIO | Destroys ESP32 | Use 3.3V or divider |
| Swapped SDA/SCL | I2C not working | Swap GPIO 21 & 22 |
| Missing 10K resistor on DHT | Unreliable readings | Add resistor |
| Wrong I2C address | Sensor not detected | Check I2C scanner |
| GND not connected | No return current | Verify GND continuity |
| LED without resistor | LED burns out | Add 330Ω resistor |
| Loose breadboard wires | Intermittent failures | Press firmly |

---

## 📞 TESTING CONNECTIONS

### **Continuity Test (Multimeter)**

```
1. Set multimeter to Ohms (Ω)
2. Touch one probe to ESP32 pin
3. Touch other probe to component pin
4. Reading should be ~0Ω (connected)
5. ∞ Ω means broken connection
```

### **Voltage Test**

```
1. Set multimeter to DCV (DC Voltage)
2. Black probe to GND
3. Red probe to test point
4. Expected readings:
   - 3.3V rail: ~3.3V
   - 5V rail: ~5V
   - GPIO LOW: ~0V
   - GPIO HIGH: ~3.3V
```

### **Power Draw Test**

```
1. Set multimeter to mA (Current)
2. Disconnect power
3. Break the power line
4. Insert multimeter in line
5. Power on and read current
6. Should be < 500mA with all sensors
```

---

## 🎓 FOR COLLEGE PROJECT

**When presenting hardware:**

1. **Have a physical diagram**
   - Print this connection guide
   - Mark pins with labels
   - Show actual physical setup

2. **Use color-coded wires**
   - Red: 5V/3.3V power
   - Black: GND
   - Yellow: I2C/Data
   - Green: Digital signals

3. **Test all connections before demo**
   - Check every wire
   - Verify voltage at each node
   - Test with multimeter

4. **Document everything**
   - Take photos of final setup
   - Save breadboard layout photo
   - Keep wiring notes

---

**All connections ready? Proceed to upload code!**

See: [ESP32_SENSOR_CODE.ino](ESP32_SENSOR_CODE.ino)
