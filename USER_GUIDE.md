# 📱 Maestro Studio PRO — Complete User & Setup Guide

Welcome to **Maestro Studio PRO**, an enterprise web IDE and automated test recorder for **Maestro** mobile test automation (Android & iOS).

This document provides a simple, step-by-step guide for QA Engineers, SDETs, Automation Leads, and Developers to record, inspect, and generate production-ready mobile automation scripts using **Physical Android Devices, Android Emulators, or iOS Simulators on macOS**.

---

## 🌐 Live Web Application URL
Access the IDE directly in your browser:
👉 **[https://maestro-flow-recorder.netlify.app/](https://maestro-flow-recorder.netlify.app/)**

---

## 💻 Supported Platforms & Devices

| Platform | Physical Android Device | Android Emulator (AVD / Genymotion) | iOS Simulator (Xcode) | Physical iPhone |
| :--- | :---: | :---: | :---: | :---: |
| **Windows PC** | ✅ Supported | ✅ Supported | ❌ *(Apple Limit)* | ❌ *(Apple Limit)* |
| **macOS (Mac)** | ✅ Supported | ✅ Supported | ✅ **Supported** | ✅ **Supported** |

---

## 📋 Prerequisites Checklist

Before using Maestro Studio PRO, ensure your computer has:

1. **Node.js (v18.x or higher)**: [Download Node.js](https://nodejs.org/)
2. **For Android Devices & Emulators**: Android SDK Platform-Tools (`adb`) installed.
3. **For iOS Simulators (macOS only)**: Xcode installed on Mac with Command Line Tools (`xcode-select --install`).

---

## 🚀 Quick Setup Guide

### Option A: Using an Android Emulator (Windows / Mac / Linux)
1. Open **Android Studio** -> Go to **Virtual Device Manager** -> Click **Play ▶️** to start your Android Emulator (e.g. `Pixel 7 - API 34`).
2. Verify the emulator is running by opening terminal and running:
   ```bash
   adb devices
   ```
   *(You will see `emulator-5554 device` listed)*.

---

### Option B: Using a Physical Android Phone (USB Debugging)
1. Plug your Android phone into your computer via USB cable.
2. Enable **USB Debugging** on your phone (Settings > Developer Options > USB Debugging).
3. Confirm connection by running:
   ```bash
   adb devices
   ```

---

### Option C: Using iOS Simulator on macOS (Xcode)
1. On your Mac, open **Xcode** -> Go to **Xcode Menu > Open Developer Tool > Simulator**.
2. Launch your desired iOS Simulator (e.g., `iPhone 15 Pro - iOS 17.2`).
3. *(Optional)* Start WebDriverAgent or Maestro runner on port `8100`:
   ```bash
   # Verify iOS simulator is running
   xcrun simctl list devices | grep Booted
   ```

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

Your running iOS Simulator, Android Emulator, or Physical Phone screen will automatically stream into the web IDE!

---

## 🎬 How to Record & Generate Maestro Test Flows

### 1. Select Device / Simulator & Start Recording
- Select your connected iOS Simulator (`iPhone 15 Pro`), Android Emulator (`emulator-5554`), or Physical Device from the top toolbar dropdown.
- Click the red **`START RECORDING`** button in the top right corner.

### 2. Interactive Controls
- **Tap Elements**: Click anywhere on the screen mirror to tap buttons, cards, and controls on your simulator/emulator.
- **Type Text**: Click any input field; a **`Send Text`** bar will appear below the phone screen. Type your text and press `Enter` to send text to your simulator/device.
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
- A full-screen **UI Inspector Dialog** will open, allowing you to browse the complete accessibility tree, view Resource IDs / Accessibility Labels, Bounds, Class Names, and copy selectors with 1 click!

### 6. Exporting Your Maestro YAML Test Script
- In the right-hand Monaco YAML Code Editor, review your clean, production-ready script.
- Click **`Export`** to download your `flow.yaml` file!

---

## 🧪 Executing Exported Flows with Maestro CLI

To run your exported test script on your iOS Simulator or Android Emulator using the Maestro CLI:

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

For 95% of users, ADB & iOS WDA path detection is **100% automatic**. 

If you have installed Android SDK or WebDriverAgent in a custom directory:
1. Click **Preferences** on the left sidebar in the web app.
2. Enter your custom file path under **ADB Binary Path** or **WDA Server Endpoint** (`http://localhost:8100`).
3. Click **Save Preferences**.

---

## ❓ Frequently Asked Questions (FAQ)

#### **Q1: Does this work with iOS Simulators on Mac?**
- **YES!** Launch Xcode Simulator on your Mac, run `npm run dev` in `backend`, and select your booted iOS Simulator from the dropdown.

#### **Q2: Does this work with Android Studio Emulators?**
- **YES!** Start your AVD emulator from Android Studio, run `npm run dev` in `backend`, and select `emulator-5554` from the device dropdown.

#### **Q3: Does this work with Genymotion / BlueStacks?**
- **YES!** Any Android emulator that communicates with `adb` is automatically detected and supported.

---

## 📞 Support & Community
For issues, feature requests, or contributions, visit our GitHub repository:
👉 **[https://github.com/Pankj699/maestro-flow-recorder](https://github.com/Pankj699/maestro-flow-recorder)**
