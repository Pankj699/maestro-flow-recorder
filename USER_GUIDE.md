# 📱 Maestro Studio PRO — Complete User & Setup Guide

Welcome to **Maestro Studio PRO**, an enterprise web IDE and automated test recorder for **Maestro** mobile test automation (Android & iOS).

This document provides a simple, step-by-step guide for QA Engineers, SDETs, Automation Leads, and Developers to record, inspect, and generate production-ready mobile automation scripts.

---

## 🌐 Live Web Application URL
Access the IDE directly in your browser:
👉 **[https://maestro-flow-recorder.netlify.app/](https://maestro-flow-recorder.netlify.app/)**

---

## 📋 Prerequisites Checklist

Before using Maestro Studio PRO with a physical Android device, ensure your computer has:

1. **Node.js (v18.x or higher)**: [Download Node.js](https://nodejs.org/)
2. **Android SDK Platform-Tools (`adb`)**: Included with Android Studio or downloadable separately.
3. **Physical Android Device or Emulator**: Connected to your PC via USB cable.
4. **USB Debugging Enabled**:
   - On your phone, go to **Settings > About Phone** -> Tap **Build Number** 7 times to enable *Developer Options*.
   - Go to **Settings > Developer Options** -> Enable **USB Debugging**.

---

## 🚀 Quick Setup Guide (3 Steps)

### Step 1: Connect Your Phone via USB
1. Plug your Android phone into your computer via USB cable.
2. If prompted on your phone screen, select **"Allow USB Debugging"** (check *"Always allow from this computer"*).
3. Confirm connection by opening terminal and running:
   ```bash
   adb devices
   ```
   *(Your device serial number should appear as `device`)*.

---

### Step 2: Start the Local Backend Engine
Because your phone is connected physically to your PC via USB, a lightweight local bridge engine runs on your machine to stream the screen into your browser.

Open your command prompt or terminal and run:

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

Your live physical phone screen will automatically stream into the web IDE!

---

## 🎬 How to Record & Generate Maestro Test Flows

### 1. Select Device & Start Recording
- Select your connected device from the top toolbar dropdown.
- Click the red **`START RECORDING`** button in the top right corner.

### 2. Interactive Phone Controls
- **Tap Elements**: Click anywhere on the phone screen mirror to tap buttons, cards, and controls.
- **Type Text**: Click any input field on your phone; a **`Send Text`** bar will appear below the phone screen. Type your text and press `Enter` to send text to your physical device.
- **Scroll & Swipe**: Scroll your mouse wheel up/down over the phone screen to perform physical swipes. Or click & drag across the screen canvas.

### 3. Touch Action Modes
Use the mode selector bar above the phone mirror to switch interaction modes:
- **`⚡ Smart Auto`** *(Default)*: Automatically records `- tapOn:` for buttons and `- assertVisible:` for text labels.
- **`👆 Force Tap`**: Forces every touch interaction to record a `- tapOn:` step.
- **`👁️ Force Assert`**: Forces every touch interaction to record an `- assertVisible:` step.

### 4. Auto-Assert Screen Elements
- Click **`✨ Auto-Assert`** in the header to automatically generate visibility assertions for all text and image elements visible on your phone screen.

### 5. UI Tree & Properties Inspector Dialog
- Click the floating **`Layers`** icon button on the right margin of the phone screen.
- A full-screen **UI Inspector Dialog** will open, allowing you to browse the complete Android accessibility tree, view Resource IDs, Bounds, Class Names, and copy selectors with 1 click!

### 6. Exporting Your Maestro YAML Test Script
- In the right-hand Monaco YAML Code Editor, review your clean, production-ready script.
- Click **`Export`** to download your `flow.yaml` file!

---

## 🧪 Executing Exported Flows with Maestro CLI

To run your exported test script on your physical device using the Maestro CLI:

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

#### **Q1: No device appears in the dropdown menu?**
- Make sure USB Debugging is enabled on your Android device.
- Unplug and re-plug your USB cable.
- Run `adb devices` in terminal to ensure your phone is listed as `device` (not `unauthorized`).

#### **Q2: Do I need to keep the terminal backend window open while recording?**
- Yes! The local backend window bridges low-latency ADB screen frames and touch inputs between your physical USB phone and the Netlify web app.

#### **Q3: Can I run this offline without internet?**
- Yes! Simply start both backend and frontend locally (`npm run dev` in both folders) and access `http://localhost:3000`.

---

## 📞 Support & Community
For issues, feature requests, or contributions, visit our GitHub repository:
👉 **[https://github.com/Pankj699/maestro-flow-recorder](https://github.com/Pankj699/maestro-flow-recorder)**
