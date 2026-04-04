/*
 * ESP32 Smart Lock — Science fair firmware
 *
 * BLE (not Classic Bluetooth): use a BLE scanner app or your app — it will not
 * show like a speaker in phone Settings → Bluetooth on many phones (esp. iPhone).
 *
 * BLE: Nordic UART Service (NUS) — many mobile BLE libraries use this pattern.
 *   Write UUID ...0002... = phone → ESP32 (commands)
 *   Notify UUID ...0003... = ESP32 → phone (optional status)
 *
 * Commands from app (plain text, case-insensitive) — matches Package Control / Patrol app:
 *   OPEN              — stepper to "open" position → notify OK:OPENED
 *   LOCK              — stepper to "closed" position → notify OK:LOCKED
 *   CLOSE             — same as LOCK (legacy alias)
 *   STATUS?           — notify LOCKED or UNLOCKED (logical latch state)
 *   PIN:1234          — set one-time unlock PIN (digits 0–9, length 4–8) → OK:PINSET or PIN_BAD
 *   SETPIN:1234       — same as PIN:
 *
 * Keypad: keys appear on line 2; press D to submit. * clears the entry.
 *
 * Libraries: Keypad, LiquidCrystal, AccelStepper (28BYJ-48 + ULN2003).
 */

#include <LiquidCrystal.h>
#include <Keypad.h>
#include <AccelStepper.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ---------- Pin map (ESP32 DEVKIT V1) ----------
// LCD 16x2 (4-bit): avoid UART0 (GPIO1/3) and input-only pins (34,35,36,39).
constexpr uint8_t LCD_RS = 19;
constexpr uint8_t LCD_E  = 18;
constexpr uint8_t LCD_D4 = 23;
constexpr uint8_t LCD_D5 = 5;
constexpr uint8_t LCD_D6 = 17;
constexpr uint8_t LCD_D7 = 16;

// Keypad: 4 row pins, 4 column pins (order must match your keypad ribbon).
byte kpRowPins[4] = { 25, 26, 27, 14 };
byte kpColPins[4] = { 32, 33, 4, 2 };

// 28BYJ-48 via ULN2003: wire ESP32 → driver IN1..IN4 in order (13→IN1, 15→IN2, …).
// AccelStepper FULL4WIRE expects coil order; swapping IN2/IN3 in software matches most 28BYJ-48 cables.
constexpr uint8_t STEP_IN1 = 13;
constexpr uint8_t STEP_IN2 = 15;
constexpr uint8_t STEP_IN3 = 21;
constexpr uint8_t STEP_IN4 = 22;

// ---------- Nordic UART Service UUIDs ----------
#define NUS_SERVICE_UUID      "6E400001-B5A3-F393-E0A9-E50E24DCCA7E"
#define NUS_RX_UUID           "6E400002-B5A3-F393-E0A9-E50E24DCCA7E"  // write from phone
#define NUS_TX_UUID           "6E400003-B5A3-F393-E0A9-E50E24DCCA7E"  // notify to phone

// ---------- Hardware ----------
LiquidCrystal lcd(LCD_RS, LCD_E, LCD_D4, LCD_D5, LCD_D6, LCD_D7);

const char keys[4][4] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
Keypad keypad = Keypad(makeKeymap(keys), kpRowPins, kpColPins, 4, 4);

AccelStepper stepper(AccelStepper::FULL4WIRE, STEP_IN1, STEP_IN3, STEP_IN2, STEP_IN4);

BLEServer* pServer = nullptr;
BLECharacteristic* pTxCharacteristic = nullptr;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// ---------- One-time PIN ----------
String activePin;
bool pinConsumed = true;  // no valid PIN until app sends one

String inputBuffer;
constexpr uint8_t PIN_MIN_LEN = 4;
constexpr uint8_t PIN_MAX_LEN = 8;
constexpr uint8_t LCD_COLS = 16;

// Motor travel (AccelStepper steps). FULL4WIRE: ~1024 steps ≈ one output shaft revolution on 28BYJ-48.
// Increase for more travel; if it turns the wrong way, use negative OPEN or swap IN1↔IN4 on the driver.
constexpr long STEPPER_POS_CLOSED = 0;
constexpr long STEPPER_POS_OPEN = 1024;

/** Logical state for STATUS? (OPEN / LOCK / keypad unlock). */
bool boxUnlocked = false;

unsigned long feedbackUntil = 0;
enum FeedbackMode { FB_NONE, FB_GRANTED, FB_DENIED };
FeedbackMode feedbackMode = FB_NONE;

portMUX_TYPE bleMux = portMUX_INITIALIZER_UNLOCKED;
volatile bool bleHasCommand = false;
String bleCommand;

void sendBleStatus(const char* msg) {
  if (deviceConnected && pTxCharacteristic != nullptr) {
    pTxCharacteristic->setValue(msg);
    pTxCharacteristic->notify();
  }
}

void requestMotorOpen() {
  stepper.moveTo(STEPPER_POS_OPEN);
}

void requestMotorClose() {
  stepper.moveTo(STEPPER_POS_CLOSED);
}

void commandOpen() {
  boxUnlocked = true;
  requestMotorOpen();
  sendBleStatus("OK:OPENED");
}

void commandLock() {
  boxUnlocked = false;
  requestMotorClose();
  sendBleStatus("OK:LOCKED");
}

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* s) override {
    (void)s;
    deviceConnected = true;
  }
  void onDisconnect(BLEServer* s) override {
    (void)s;
    deviceConnected = false;
  }
};

class RxCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* c) override {
    String v = c->getValue().c_str();
    if (v.length() == 0) return;
    portENTER_CRITICAL(&bleMux);
    bleCommand = v;
    bleHasCommand = true;
    portEXIT_CRITICAL(&bleMux);
  }
};

void setActivePin(const String& p) {
  activePin = p;
  pinConsumed = false;
  inputBuffer = "";
  feedbackUntil = 0;
  feedbackMode = FB_NONE;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("PIN ready (once)");
  lcd.setCursor(0, 1);
  lcd.print("Enter & press D");
  delay(800);
  showEnterPrompt();
  sendBleStatus("OK:PINSET");
}

bool isValidPinChars(const String& s) {
  for (unsigned i = 0; i < s.length(); i++) {
    char ch = s[i];
    if (ch < '0' || ch > '9') return false;
  }
  return true;
}

void handleBleCommand(String cmd) {
  cmd.trim();
  Serial.print(F("[BLE RX] "));
  Serial.println(cmd);

  String upper = cmd;
  upper.toUpperCase();

  if (upper == "OPEN") {
    Serial.println(F("[BLE] OPEN -> motor open, TX OK:OPENED"));
    commandOpen();
    return;
  }
  if (upper == "LOCK" || upper == "CLOSE") {
    Serial.println(F("[BLE] LOCK/CLOSE -> motor close, TX OK:LOCKED"));
    commandLock();
    return;
  }
  if (upper == "STATUS?") {
    const char* st = boxUnlocked ? "UNLOCKED" : "LOCKED";
    Serial.print(F("[BLE] STATUS? -> TX "));
    Serial.println(st);
    sendBleStatus(st);
    return;
  }
  if (upper.startsWith("PIN:")) {
    String p = cmd.substring(4);
    p.trim();
    if (p.length() >= PIN_MIN_LEN && p.length() <= PIN_MAX_LEN && isValidPinChars(p)) {
      Serial.print(F("[BLE] PIN: accepted, length "));
      Serial.print(p.length());
      Serial.println(F(" digits, TX OK:PINSET"));
      setActivePin(p);
    } else {
      Serial.println(F("[BLE] PIN: rejected, TX PIN_BAD"));
      sendBleStatus("PIN_BAD");
    }
    return;
  }
  if (upper.startsWith("SETPIN:")) {
    String p = cmd.substring(7);
    p.trim();
    if (p.length() >= PIN_MIN_LEN && p.length() <= PIN_MAX_LEN && isValidPinChars(p)) {
      Serial.print(F("[BLE] SETPIN: accepted, length "));
      Serial.print(p.length());
      Serial.println(F(" digits, TX OK:PINSET"));
      setActivePin(p);
    } else {
      Serial.println(F("[BLE] SETPIN: rejected, TX PIN_BAD"));
      sendBleStatus("PIN_BAD");
    }
    return;
  }
  Serial.println(F("[BLE] unknown command, TX UNKNOWN_CMD"));
  sendBleStatus("UNKNOWN_CMD");
}

void showEnterPrompt() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter PIN:");
  lcd.setCursor(0, 1);
  lcd.print(inputBuffer);
  for (int i = inputBuffer.length(); i < LCD_COLS; i++) lcd.print(' ');
}

void showFeedback() {
  lcd.clear();
  if (feedbackMode == FB_GRANTED) {
    lcd.setCursor(0, 0);
    lcd.print("PIN correct");
    lcd.setCursor(0, 1);
    lcd.print("Access granted");
  } else if (feedbackMode == FB_DENIED) {
    lcd.setCursor(0, 0);
    lcd.print("PIN wrong");
    lcd.setCursor(0, 1);
    lcd.print("Access denied");
  }
}

void trySubmitPin() {
  if (pinConsumed || activePin.length() == 0) {
    feedbackMode = FB_DENIED;
    feedbackUntil = millis() + 2500;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("No active PIN");
    lcd.setCursor(0, 1);
    lcd.print("Use app first");
    sendBleStatus("NO_PIN");
    inputBuffer = "";
    return;
  }
  if (inputBuffer.length() < PIN_MIN_LEN) {
    feedbackMode = FB_DENIED;
    feedbackUntil = millis() + 2000;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Too short");
    lcd.setCursor(0, 1);
    lcd.print("Min 4 digits");
    inputBuffer = "";
    delay(1500);
    showEnterPrompt();
    return;
  }

  if (inputBuffer == activePin) {
    pinConsumed = true;
    activePin = "";
    feedbackMode = FB_GRANTED;
    feedbackUntil = millis() + 3000;
    showFeedback();
    boxUnlocked = true;
    requestMotorOpen();
    sendBleStatus("OK:OPENED");
  } else {
    feedbackMode = FB_DENIED;
    feedbackUntil = millis() + 3000;
    showFeedback();
    sendBleStatus("UNLOCK_FAIL");
  }
  inputBuffer = "";
}

void setupBle() {
  BLEDevice::init("ESP32-SmartLock");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService* service = pServer->createService(NUS_SERVICE_UUID);

  BLECharacteristic* rx = service->createCharacteristic(
      NUS_RX_UUID,
      BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
  rx->setCallbacks(new RxCallbacks());

  pTxCharacteristic = service->createCharacteristic(
      NUS_TX_UUID,
      BLECharacteristic::PROPERTY_NOTIFY);
  pTxCharacteristic->addDescriptor(new BLE2902());

  service->start();

  BLEAdvertising* adv = BLEDevice::getAdvertising();

  // Main packet: discoverable + NUS service UUID (name is in scan response — 31-byte limit).
  BLEAdvertisementData advData;
  advData.setFlags(0x06);  // general discoverable, BR/EDR not supported
  advData.setCompleteServices(BLEUUID(NUS_SERVICE_UUID));

  BLEAdvertisementData scanData;
  scanData.setName("ESP32-SmartLock");

  adv->setAdvertisementData(advData);
  adv->setScanResponseData(scanData);
  adv->setScanResponse(true);
  adv->setMinPreferred(0x06);
  adv->setMaxPreferred(0x12);

  BLEDevice::startAdvertising();
}

void setup() {
  Serial.begin(115200);
  lcd.begin(16, 2);
  keypad.setDebounceTime(30);
  keypad.setHoldTime(500);

  pinMode(STEP_IN1, OUTPUT);
  pinMode(STEP_IN2, OUTPUT);
  pinMode(STEP_IN3, OUTPUT);
  pinMode(STEP_IN4, OUTPUT);
  digitalWrite(STEP_IN1, LOW);
  digitalWrite(STEP_IN2, LOW);
  digitalWrite(STEP_IN3, LOW);
  digitalWrite(STEP_IN4, LOW);

  stepper.setMaxSpeed(1000);
  stepper.setAcceleration(600);
  stepper.setMinPulseWidth(20);
  stepper.setCurrentPosition(STEPPER_POS_CLOSED);

  showEnterPrompt();
  setupBle();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("BLE: SmartLock");
  lcd.setCursor(0, 1);
  lcd.print("Waiting phone...");
  delay(1200);
  showEnterPrompt();
}

void loop() {
  stepper.run();

  if (bleHasCommand) {
    portENTER_CRITICAL(&bleMux);
    String c = bleCommand;
    bleHasCommand = false;
    portEXIT_CRITICAL(&bleMux);
    handleBleCommand(c);
  }

  if (feedbackMode != FB_NONE && millis() > feedbackUntil) {
    feedbackMode = FB_NONE;
    showEnterPrompt();
  }

  if (feedbackMode == FB_NONE) {
    char key = keypad.getKey();
    if (key) {
      if (key == 'D') {
        trySubmitPin();
      } else if (key == '*') {
        inputBuffer = "";
        showEnterPrompt();
      } else if (key >= '0' && key <= '9') {
        if (inputBuffer.length() < PIN_MAX_LEN) {
          inputBuffer += key;
          lcd.setCursor(0, 1);
          if (inputBuffer.length() <= LCD_COLS) {
            lcd.print(inputBuffer);
            for (int i = inputBuffer.length(); i < LCD_COLS; i++) lcd.print(' ');
          } else {
            String tail = inputBuffer.substring(inputBuffer.length() - LCD_COLS);
            lcd.print(tail);
          }
        }
      }
      // A, B, C, # ignored for PIN entry (science-fair simplicity)
    }
  } else {
    delay(10);
  }

  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->getAdvertising()->start();
    oldDeviceConnected = deviceConnected;
  } else if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
    sendBleStatus("CONNECTED");
  }

  delay(1);
}
