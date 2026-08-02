# 📱 Maestro Studio PRO — Mobile Test Recorder & IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)](https://www.typescriptlang.org/)
[![Maestro](https://img.shields.io/badge/Engine-Maestro%20v1.34-indigo.svg)](https://maestro.mobile.dev/)

**Maestro Studio PRO** is a production-grade, enterprise web-based IDE and automated test recorder for **Maestro** mobile test automation (iOS & Android). It provides real-time low-latency screen mirroring of physical mobile devices, 1-click accessibility UI tree inspection, smart auto-assertions, and instant Maestro YAML test code generation.

---

## 🌟 Key Features

### 1. 📱 Low-Latency Live Screen Mirroring (250ms Sync)
- Stream physical Android device screens via high-speed ADB binary streaming into the browser.
- Direct interactive touch execution on physical devices with <50ms input latency.

### 2. ⚡ Touch Action Modes
- **`⚡ Smart Auto`**: Intelligently detects interactive controls for `- tapOn:` actions and static labels for `- assertVisible:` steps.
- **`👆 Force Tap`**: Forces every touch interaction to record a `- tapOn:` step.
- **`👁️ Force Assert`**: Forces every touch interaction to record an `- assertVisible:` step.

### 3. 🖱️ Mouse Wheel Scrolling & Swipe Gestures
- **Mouse Wheel Scroll**: Scroll your mouse wheel over the phone mirror to perform physical ADB swipes up/down and record clean `- swipe: direction: DOWN/UP` steps.
- **Click & Drag**: Click and drag across the screen canvas to execute physical swipe gestures on your device.

### 4. ⌨️ Physical Device Text Typing & Conditional Input Bar
- A dynamic **Send Text** bar automatically appears below the device mirror when an input field is active on your phone.
- Types characters directly into active input fields on your physical phone via ADB and pairs the recorded step with the target field's Resource ID:
  ```yaml
  - tapOn:
      id: "editTextUserAnswer"
  - inputText: "Modern Business Flyer"
  ```
- Filters out soft keyboard key taps so your generated script remains clean and concise.

### 5. 🌳 UI Tree & Node Properties Inspector Dialog
- Click the floating **`Layers`** button on the mobile screen margin to launch a full-screen **UI Inspector Dialog Box**.
- Browse the full Android accessibility hierarchy tree, inspect Resource IDs, Accessibility IDs, Class Names, Bounds Rectangles, XPath locators, and state flags (Clickable, Focusable, Enabled).
- 1-click copy for all element locators.

### 6. ✨ Auto-Assert Screen Elements
- 1-click auto-generation of visibility assertions for all visible text and image elements on the current screen.
- Pairs `id` + `text` into single dual-validation assertions with descriptive ASCII section headers:
  ```yaml
  # ==========================================
  # Verify "User Preferences" Screen
  # ==========================================
  - assertVisible:
      id: "txtHeaderTitle"
      text: "What would you use Flyer Maker for?"
  ```

### 7. 🪄 AI Refactor & Assertion Generator
- Automatically merges rapid inputs, removes accidental duplicate taps, formats section headers, and replaces hardcoded test strings with reusable Maestro variables `${USER_EMAIL}`.

### 8. 💻 Resizable IDE Layout & Monaco YAML Code Editor
- **Resizable Panels**: Built with draggable splitters (`react-resizable-panels`) allowing you to resize panel widths or maximize the code editor to 100% Fullscreen.
- **Monaco Code Editor**: VS Code aesthetic with line numbers, search & replace (`Ctrl+F`), font size scaling (`+` / `-`), word wrap toggles, copy to clipboard, and 1-click `.yaml` file export.
- **Cursor Position Step Insertion**: Click any line in the code editor to insert new recorded steps directly at your cursor line index.

---

## 📋 Prerequisites & Requirements

Before setting up Maestro Studio PRO, ensure you have the following installed on your machine:

1. **Node.js**: `v18.x` or higher ([Download Node.js](https://nodejs.org/))
2. **Android SDK Platform-Tools (`adb`)**:
   - `adb` must be installed and added to your system PATH.
   - Test by running `adb devices` in your terminal.
3. **Physical Android Device or Emulator**:
   - Connected via USB with **USB Debugging** enabled in Developer Options.
4. **Maestro CLI** *(Optional, for executing generated flows)*:
   - Install via `curl -FsSL "https://get.maestro.mobile.dev" | bash`

---

## 🚀 Quick Start Guide

Follow these steps to get Maestro Studio PRO up and running locally:

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/maestro-flow-recorder.git
cd maestro-flow-recorder
```

### Step 2: Install All Dependencies
Run the root setup command to install dependencies for both `backend` and `frontend`:
```bash
npm run setup
```
*(Alternatively, install manually in each folder: `cd backend && npm install` and `cd frontend && npm install`)*

### Step 3: Connect Your Android Device
1. Connect your Android phone to your PC via USB cable.
2. Ensure **USB Debugging** is enabled on your device.
3. Run `adb devices` in terminal and confirm your device serial number appears (e.g. `10BE470NTM000ZL device`).

### Step 4: Start the Application

#### Option A: Running Development Servers
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*(Backend server runs on `http://localhost:4000`)*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*(Frontend dev server runs on `http://localhost:3000`)*

#### Option B: Building for Production
```bash
npm run build
npm start
```

### Step 5: Open Maestro Studio in Browser
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📖 How to Record Your First Maestro Test Flow

1. **Select Device**: Choose your connected Android device from the top toolbar dropdown. The live 250ms screen stream will start automatically.
2. **Click `START RECORDING`**: Click the electric red button in the top right to start recording test actions.
3. **Interact with Device**:
   - **Tap Elements**: Click anywhere on the phone mirror screen to tap buttons and controls.
   - **Type Text**: Tap an input field; type your text in the **`Send Text`** bar below the screen and press `Enter`.
   - **Scroll / Swipe**: Scroll your mouse wheel over the phone mirror screen to scroll up and down.
4. **Auto-Assert Screen**: Click **`✨ Auto-Assert Screen Elements`** to automatically capture assertions for all visible texts & images on the current screen.
5. **Inspect UI Tree**: Click the floating **`Layers`** icon button on the right margin of the device mirror to launch the full **UI Tree Inspector Dialog Box**.
6. **Export Script**: Click **`Export YAML`** in the right Monaco editor header to save your production-ready `flow.yaml` test file!

---

## 🧪 Executing Generated Flows with Maestro CLI

To run your exported `flow.yaml` test flow using the Maestro CLI:

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

## 📁 Project Structure

```
maestro-flow-recorder/
├── backend/                        # Express + Socket.IO + ADB Integration Service
│   ├── src/
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   ├── RecordingService.ts     # Flow events management & session recorder
│   │   │   │   ├── SmartSelectorEngine.ts  # Element selector matching & auto-assertions
│   │   │   │   └── YAMLGenerator.ts        # Maestro YAML code generator & ASCII section headers
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   │   ├── bridge/
│   │   │   │   └── ADBBridge.ts            # Physical ADB screencap, tap, swipe, input text & uiautomator dump
│   │   │   └── websocket/
│   │   │       └── SocketHandler.ts        # Live screen frame & interaction WebSocket handlers
│   │   └── index.ts
│   └── package.json
├── frontend/                       # React + Redux Toolkit + Tailwind CSS + Monaco Editor
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── CustomResizeHandle.tsx  # Resizable panel splitters
│   │   │   │   └── WalkthroughTour.tsx     # Interactive 5-step IDE feature tour
│   │   │   ├── device/
│   │   │   │   ├── DeviceMirror.tsx        # Physical device canvas, touch mode pills & text bar
│   │   │   │   └── DeviceSelector.tsx      # Device selection dropdown & status
│   │   │   ├── flow/
│   │   │   │   └── LiveYamlEditor.tsx      # Monaco YAML editor, word wrap & line status bar
│   │   │   ├── inspector/
│   │   │   │   ├── HierarchyTree.tsx       # DevTools UI accessibility tree inspector
│   │   │   │   ├── NodeInspector.tsx       # Property cards & attribute copy buttons
│   │   │   │   └── UIInspectorModal.tsx    # Full-screen UI Tree Inspector dialog box modal
│   │   │   └── layout/
│   │   │       ├── Header.tsx              # Toolbar, device status, tour & recording CTA
│   │   │       └── Sidebar.tsx             # Linear/VS Code collapsible navigation sidebar
│   │   ├── pages/
│   │   │   └── RecorderPage.tsx            # Main resizable 2-panel IDE workspace layout
│   │   └── App.tsx
│   └── package.json
├── package.json                    # Root setup & build scripts
└── README.md                       # Documentation & Quick Start Guide
```

---

## 🛠️ Key Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + B` / `Cmd + B` | Toggle Navigation Sidebar |
| `Ctrl + Shift + T` / `Cmd + Shift + T` | Open UI Tree & Node Properties Inspector Dialog |
| `Ctrl + Shift + E` / `Cmd + Shift + E` | Toggle Monaco YAML Code Editor Panel |
| `Ctrl + F` / `Cmd + F` | Search inside Monaco YAML Code Editor |

---

## 🔧 Troubleshooting

- **No Device Appears in Dropdown**:
  - Run `adb devices` in your command line. Ensure your device is authorized and listed as `device` (not `unauthorized` or `offline`).
  - Re-plug your USB cable and accept the *"Allow USB Debugging"* prompt on your Android phone screen.
- **Screen Streaming / Tap Lag**:
  - Ensure high-speed USB 3.0 port connection.
  - Decreasing background app usage on phone improves `uiautomator dump` speed.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ for QA Engineers, SDETs, and Mobile Developers.
