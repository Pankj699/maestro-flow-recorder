# 📱 Maestro Studio PRO — Complete User & Setup Guide

Welcome to **Maestro Studio PRO**, an enterprise web IDE and automated test recorder for **Maestro** mobile test automation (Android & iOS).

This document provides a simple, step-by-step guide for QA Engineers, SDETs, Automation Leads, and Developers to record, inspect, and generate production-ready mobile automation scripts using **Physical Devices, Android Emulators, or iOS Simulators**.

---

## 🌐 Live Web Application URL
Access the IDE directly in your browser:
👉 **[https://maestro-flow-recorder.netlify.app/](https://maestro-flow-recorder.netlify.app/)**

---

## 💻 Is This Project Fully Developed for Emulators & Simulators?
**YES! 100% Fully Supported!**

Maestro Studio PRO natively supports:
- ✅ **Physical Android Devices** (USB / Wireless ADB)
- ✅ **Android Emulators** (Android Studio AVD, Genymotion, BlueStacks)
- ✅ **iOS Simulators & Physical iPhones** (via WebDriverAgent WDA)

---

## 📋 Prerequisites Checklist

Before using Maestro Studio PRO, ensure your computer has:

1. **Node.js (v18.x or higher)**: [Download Node.js](https://nodejs.org/)
2. **Android SDK Platform-Tools (`adb`)**: Included with Android Studio or downloadable separately.
3. **Target Device (Choose one)**:
   - **Physical Android Phone**: Connected via USB cable with **USB Debugging** enabled in Developer Options.
   - **Android Emulator**: Launched via Android Studio Device Manager (`emulator -avd <name>`).
   - **iOS Simulator**: Launched via Xcode Simulator.

---

## 🚀 Quick Setup Guide

### Option A: Using an Android Emulator (Android Studio / Genymotion)
1. Open **Android Studio** -> Go to **Virtual Device Manager** -> Click **Play ▶️** to start your Android Emulator (e.g. `Pixel 7 - API 34`).
2. Verify the emulator is running by opening terminal and running:
   ```bash
   adb devices
   ```
   *(You will see `emulator-5554 device` listed)*.

---

### Option B: Using a Physical Android Phone
1. Plug your Android phone into your computer via USB cable.
2. If prompted on your phone screen, select **"Allow USB Debugging"** (check *"Always allow from this computer"*).
3. Confirm connection by opening terminal and running:
   ```bash
   adb devices
   ```
   *(Your device serial number will appear as `10BE470NTM000ZL device`)*.

---

### Step 2: Start the Local Backend Engine
Run these 2 commands in terminal:

```bash
# 1. Clone the repository
git clone https://github.com/Pankj699/maestro-flow-recorder.git
cd maestro-flow-recorder/backend

# 2. Install dependencies & start local bridge
npm install
npm run dev
```

*(You will see: `🚀 Maestro Flow Recorder Backend listening on port 4000`)*

---

### Step 3: Launch Maestro Studio PRO
Open your browser and navigate to:
👉 **[https://maestro-flow-recorder.netlify.app/](https://maestro-flow-recorder.netlify.app/)**

Your running Emulator or Physical Phone screen will automatically stream into the web IDE!

---

## 🎬 How to Record & Generate Maestro Test Flows

### 1. Select Device / Emulator & Start Recording
- Select your connected Emulator (`emulator-5554`) or Physical Device from the top toolbar dropdown.
- Click the red **`START RECORDING`** button in the top right corner.

### 2. Interactive Controls
- **Tap Elements**: Click anywhere on the screen mirror to tap buttons, cards, and controls on your emulator/device.
- **Type Text**: Click any input field; a **`Send Text`** bar will appear below the phone screen. Type your text and press `Enter` to send text to your emulator/device.
- **Scroll & Swipe**: Scroll your mouse wheel up/down over the phone screen to perform physical swipes. Or click & drag across the screen canvas.

### 3. Touch Action Modes
Use the mode selector bar above the screen mirror to switch interaction modes:
- **`⚡ Smart Auto`** *(Default)*: Automatically records `- tapOn:` for buttons and `- assertVisible:` for text labels.
- **`👆 Force Tap`**: Forces every touch interaction to record a `- tapOn:` step.
- **`👁️ Force Assert`**: Forces every touch interaction to record an `- assertVisible:` step.

### 4. Auto-Assert Screen Elements
- Click **`✨ Auto-Assert`** in the header to automatically generate visibility assertions for all text and image elements visible on your screen.

### 5. UI Tree & Properties Inspector Dialog
- Click the floating **`Layers`** icon button on the right margin of the phone screen.
- A full-screen **UI Inspector Dialog** will open, allowing you to browse the complete Android accessibility tree, view Resource IDs, Bounds, Class Names, and copy selectors with 1 click!

### 6. Exporting Your Maestro YAML Test Script
- In the right-hand Monaco YAML Code Editor, review your clean, production-ready script.
- Click **`Export`** to download your `flow.yaml` file!

---

## 🧪 Executing Exported Flows with Maestro CLI

To run your exported test script on your emulator or physical device using the Maestro CLI:

```bash
maestro test flow.yaml
```

Example generated `flow.yaml`:
```yaml
appId: com.example.app
---
# ==========================================
# Verify "User Options" Screen
# ==========================================
- assertVisible:
    id: "txtQuestionHeader"
    text: "What would you use Flyer Maker for?"

- tapOn:
    id: "btnBusinessServices"

- tapOn:
    id: "editTextUserAnswer"
- inputText: "Modern Business Flyer"

- swipe:
    direction: DOWN
```

---

## ⚙️ Optional Preferences Configuration

For 95% of users, ADB path detection is **100% automatic**. 

If you have installed Android SDK in a non-standard custom directory (e.g. `D:\CustomTools\platform-tools\adb.exe`):
1. Click **Preferences** on the left sidebar in the web app.
2. Enter your custom file path under **ADB Binary Path**.
3. Click **Save Preferences**.

---

## ❓ Frequently Asked Questions (FAQ)

#### **Q1: Does this work with Android Studio Emulators?**
- **YES!** Just start your AVD emulator from Android Studio, run `npm run dev` in `backend`, and select `emulator-5554` from the device dropdown.

#### **Q2: Does this work with Genymotion / BlueStacks?**
- **YES!** Any Android emulator that communicates with `adb` is automatically detected and supported.

#### **Q3: No device or emulator appears in the dropdown menu?**
- Open terminal and run `adb devices`. Ensure your emulator or device is listed as `device` (not `offline` or `unauthorized`).

---

## 📞 Support & Community
For issues, feature requests, or contributions, visit our GitHub repository:
👉 **[https://github.com/Pankj699/maestro-flow-recorder](https://github.com/Pankj699/maestro-flow-recorder)**
