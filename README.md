# Farizas Project — ESP32 Smart Lock

A science-fair style **smart lock** for a small box: a phone app connects over **Bluetooth Low Energy (BLE)** to an **ESP32**, which drives a **stepper motor** (latch), shows status on a **16×2 LCD**, and accepts a **one-time PIN** from a **4×4 keypad**.

---

## What it does

- **Open / lock from the app** — Sends BLE commands to move the motor to an “open” or “closed” position.
- **One-time PIN** — The app can push a random numeric PIN to the ESP32. That PIN works **once**; after a successful unlock it is cleared until the app sets a new one.
- **Keypad + LCD** — Digits appear on the second line of the display; **D** submits the PIN; **\*** clears entry. The LCD shows **Access granted** or **Access denied** (and related messages).
- **Status** — The app can query whether the box is logically **LOCKED** or **UNLOCKED**.

Firmware lives in **`esp32_smart_lock/`**. The companion mobile/web app is in **`package-patrol/`** (Vue + Ionic + Capacitor, using `@capacitor-community/bluetooth-le`).

---

## Repository layout

| Path | Purpose |
|------|--------|
| `esp32_smart_lock/esp32_smart_lock.ino` | Arduino sketch for the ESP32 |
| `package-patrol/` | Ionic/Vue app: connect, open/lock, PIN generation, history |

---

## Hardware

### Main parts

- **ESP32** (tested with a **DEVKIT V1**-style board)
- **16×2 LCD**, **HD44780**-style, **parallel 4-bit** interface (not I2C in the default sketch)
- **4×4 membrane keypad** (8-pin ribbon)
- **28BYJ-48** stepper motor + **ULN2003** driver board
- **10 kΩ potentiometer** (LCD contrast)
- **5 V** for the motor driver (shared **GND** with the ESP32; use a solid 5 V source if the motor stalls or the board resets)

### ESP32 pin map (default sketch)

**LCD (4-bit)**

| LCD pin | Signal | ESP32 GPIO |
|---------|--------|------------|
| 1 | VSS | GND |
| 2 | VDD | 5 V (e.g. `VIN` if appropriate for your module) |
| 3 | V0 | Pot wiper (pot ends → 5 V and GND) |
| 4 | RS | **19** |
| 5 | R/W | GND |
| 6 | E | **18** |
| 11–14 | D4–D7 | **23**, **5**, **17**, **16** |
| 15–16 | Backlight | Per module (often A → 5 V via resistor, K → GND) |

**Keypad** — If keys are wrong, reorder `kpRowPins` / `kpColPins` in the sketch or swap ribbon wires.

| Role | GPIO |
|------|------|
| Rows | **25**, **26**, **27**, **14** |
| Columns | **32**, **33**, **4**, **2** |

**Stepper (ULN2003 → ESP32)**

| Driver pin | ESP32 GPIO |
|------------|------------|
| IN1 | **13** |
| IN2 | **15** |
| IN3 | **21** |
| IN4 | **22** |
| GND | GND |
| Motor 5 V | **5 V** (not 3.3 V) |

The sketch uses **AccelStepper** in **FULL4WIRE** with software order **IN1, IN3, IN2, IN4** to match typical **28BYJ-48** wiring.

**Notes**

- ESP32 I/O is **3.3 V**. Many LCD modules work with 3.3 V logic; if the display is unreliable, use level shifters on the data lines.
- Avoid using **GPIO 34–39** for outputs (input-only on many ESP32 boards).
- **GPIO 1 / 3** are used for USB serial; the sketch keeps them free.

---

## Arduino IDE — setup

1. **Board support** — Install the **Espressif ESP32** package via Boards Manager (add the Espressif JSON URL in Preferences if needed).
2. **Board** — e.g. **ESP32 Dev Module**.
3. **Libraries** (Library Manager):
   - **Keypad** (Mark Stanley / Alexander Brevig)
   - **AccelStepper** (Mike McCauley)
   - **LiquidCrystal** (usually bundled; install if missing)

Do **not** use the generic Arduino **Servo** library for this project; the motor is a **stepper**, not a hobby servo.

Open **`esp32_smart_lock/esp32_smart_lock.ino`**, select the correct **COM port**, and upload.

---

## Bluetooth (BLE) — important

The ESP32 advertises as **BLE**, **not** Classic Bluetooth (SPP).

- On **iPhone**, you generally **will not** see the device under **Settings → Bluetooth** like a speaker. Use **your app** or a BLE scanner (e.g. **nRF Connect**, **LightBlue**).
- **Android** may show BLE devices while scanning; behavior varies. **Location / nearby devices** permission is often required for scanning.

**Advertising name:** `ESP32-SmartLock`

**Nordic UART Service (NUS)** — common for “serial over BLE”:

| Role | UUID |
|------|------|
| Service | `6E400001-B5A3-F393-E0A9-E50E24DCCA7E` |
| RX (write from phone → ESP32) | `6E400002-B5A3-F393-E0A9-E50E24DCCA7E` |
| TX (notify ESP32 → phone) | `6E400003-B5A3-F393-E0A9-E50E24DCCA7E` |

Enable **notifications** on the TX characteristic if you want status strings from the firmware.

---

## BLE command protocol (text)

Send **plain UTF-8 text** to the **RX** characteristic (case-insensitive unless noted). Typical responses are sent on **TX** via **notify**.

| Command | Action | Typical TX notify |
|---------|--------|------------------|
| `OPEN` | Move stepper to open position; logical **unlocked** | `OK:OPENED` |
| `LOCK` or `CLOSE` | Move stepper to closed position; logical **locked** | `OK:LOCKED` |
| `STATUS?` | Reply with latch state | `LOCKED` or `UNLOCKED` |
| `PIN:123456` or `SETPIN:123456` | Set **one-time** PIN (**4–8** digits only) | `OK:PINSET` or `PIN_BAD` |

**Keypad**

- Type digits; they appear on the LCD.
- **D** — submit PIN.
- **\*** — clear entry.

After a **correct** PIN, the PIN is **consumed** (single use). Wrong PIN or missing PIN shows the appropriate LCD message and notify where implemented.

**Serial debug** — With **115200** baud, the sketch logs received BLE lines and command handling to **Serial Monitor**.

---

## Tuning the stepper

In the sketch:

- **`STEPPER_POS_OPEN`** — Step count for “open” vs **`STEPPER_POS_CLOSED` (0)**. Default **1024** is roughly **one output revolution** for **28BYJ-48** in **FULL4WIRE**; adjust for your mechanism.
- **`setMaxSpeed`** / **`setAcceleration`** — Increase cautiously if steps are missed.
- If the motor **does not turn** or only buzzes: check **5 V** on the driver, **common GND**, and ribbon seating; try swapping two motor wires or flipping the sign of **`STEPPER_POS_OPEN`**.

---

## Companion app (`package-patrol`)

Vue 3 + Ionic + Capacitor project for **iOS/Android** (and web where BLE is supported).

```bash
cd package-patrol
npm install
npm run dev
```

Use Capacitor workflows (`npx cap sync`, etc.) to run on a device. The app is expected to use the **same NUS UUIDs** and command strings as above.

---

## License / credits

School / science-fair use. Adapt pins, commands, and motor constants to match your build and app.
