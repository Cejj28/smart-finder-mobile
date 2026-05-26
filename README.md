# 📱 SmartFinder — Mobile App (React Native / Expo)

> A cross-platform mobile application for students to report lost and found items, submit claims, and receive notifications — all connected to the SmartFinder backend.

---

## 📋 Project Description

This is the **student-facing mobile app** of the SmartFinder campus Lost & Found platform. Built with React Native and Expo, it allows students to register, browse approved lost/found items, submit their own reports with photos and AI-powered category suggestions, claim found items, and receive in-app notifications.

The app connects to:
- **Django DRF** — for all authentication, CRUD, and user data
- **FastAPI** — for ML-powered category prediction when reporting an item

---

## ✨ Features

- 🔐 **Student Login** — email or username authentication
- 📝 **Student Registration** — self-registration with full name, email, and department
- 🏠 **Home Feed** — browse all approved lost & found items with images
- 📷 **Report Item** — submit a lost or found item with photo, location, description, and AI-suggested category
- 🤖 **ML Category Prediction** — real-time category suggestion powered by the FastAPI ML service
- 🔍 **Smart Match** — view potential matches for your reported items (opposite type, same category)
- 📂 **My Posts** — manage your own submitted reports (view, edit, delete)
- 📋 **Claim Submission** — submit a claim for a found item with proof of ownership
- 🔔 **Notifications** — view and mark in-app notifications as read
- 👤 **Profile** — view and update personal information and change password
- 🌙 **Dark-themed UI** — modern glassmorphism design with teal accent color

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.81 |
| **Platform** | Expo ~54.0.0 |
| **Navigation** | React Navigation v7 (Bottom Tabs) |
| **Storage** | AsyncStorage (token persistence) |
| **Camera / Images** | expo-camera, expo-image-picker |
| **On-Device ML** | TensorFlow.js + MobileNet (image recognition assist) |
| **API Client** | Fetch API with retry logic (handles Render cold starts) |
| **Icons** | @expo/vector-icons (Ionicons) |
| **Primary Backend** | Django DRF (REST API) |
| **ML Backend** | FastAPI `/predict/category` |
| **Deployment** | Expo Go (development) / EAS Build (production APK) |

---

## 📱 App Screens

| Screen | Description |
|---|---|
| **Login** | Email/username + password login with cold-start retry handling |
| **Register** | Student registration form (full name, email, department, password) |
| **Home** | Scrollable feed of all approved lost & found items |
| **Report** | Form to submit a lost/found item — photo, location, description, AI category |
| **My Posts** | User's own item submissions with edit/delete options |
| **Notifications** | In-app notification center with mark-read functionality |
| **Profile** | View and update profile info, change password, logout |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         SmartFinder Mobile App          │
│         (React Native + Expo)           │
├───────────────────┬─────────────────────┤
│  React Navigation │  AsyncStorage       │
│  (Bottom Tabs)    │  (Token: sf_token)  │
└─────────┬─────────┴──────────┬──────────┘
          │                    │
          ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│  Django DRF API  │  │  FastAPI         │
│  (Auth, CRUD,    │  │  /predict/       │
│   Notifications) │  │  category (ML)   │
│  Render.com      │  │  Render.com      │
└──────────────────┘  └──────────────────┘
          │
          ▼
┌──────────────────┐
│  PostgreSQL DB   │
│  + Cloudinary    │
│  (Images)        │
└──────────────────┘
```

**Token Handling:**
1. Student logs in → Django returns a token
2. Token stored in `AsyncStorage` as `sf_token`
3. All subsequent requests include `Authorization: Token <sf_token>`
4. FastAPI uses the same token for ML prediction calls

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your Android/iOS device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 1. Clone the repository
```bash
git clone https://github.com/Cejj28/smart-finder-mobile.git
cd smart-finder-mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the API URL

Open `src/services/api.js` and check the toggle:

```js
const USE_DEPLOYED = true; // true = uses live Render backend
```

- Set to `true` (default) to connect to the deployed backend
- Set to `false` for local development, then update the IP:
  ```js
  'http://192.168.1.100:8000/api' // Replace with your local machine's IP
  ```

### 4. Start the Expo development server
```bash
npm start
# or
npx expo start
```

### 5. Run on your device
- Open **Expo Go** on your phone
- Scan the QR code shown in the terminal or browser
- The app will load on your device

### 6. Run on emulator (optional)
```bash
npm run android   # Android emulator
npm run ios       # iOS simulator (macOS only)
```

---

## 📦 Building an APK (Android)

To generate a standalone APK using Expo Application Services (EAS):

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo account
```bash
eas login
```

### 3. Configure EAS Build
```bash
eas build:configure
```

### 4. Build a preview APK (Android)
```bash
eas build --platform android --profile preview
```

> ✅ **Pre-built Standing APK**: You can directly download the pre-compiled Android APK or scan its installation QR code here: [Expo Standalone APK Build](https://expo.dev/accounts/cejj28/projects/smart-finder-mobile/builds/c160b358-995a-4def-9215-670aa1e169cc) (No developer setup required).

---

## 🚀 Deployment

| Platform | Status | Access |
|---|---|---|
| **Expo Go (Development)** | ✅ Active | Scan QR code via `npm start` |
| **Android APK (EAS Build)** | ✅ Live APK | [Download APK / Scan QR Code](https://expo.dev/accounts/cejj28/projects/smart-finder-mobile/builds/c160b358-995a-4def-9215-670aa1e169cc) |
| **iOS (TestFlight)** | ❌ Not configured | Requires Apple Developer account |
| **Backend (Django)** | ✅ Live | [https://smart-finder-django.onrender.com](https://smart-finder-django.onrender.com) |
| **ML Service (FastAPI)** | ✅ Live | [https://smart-finder-fastapi.onrender.com](https://smart-finder-fastapi.onrender.com) |

---

## 🔑 Test Account

| Role | Username | Password |
|---|---|---|
| **Student** | `student1` | `123456` |

> ⚠️ The backend is hosted on Render's free tier. **The first login after inactivity may take 30–60 seconds** while the server wakes up. The app handles this automatically with retry logic and shows a "Server is waking up..." hint if login takes longer than 4 seconds.

---

## 👥 Team Members and Roles

| Name | Role |
|---|---|
| **Clint John Mila** | Project Lead & Full-Stack Developer — system architecture, service integration, deployment |
| **Daniel Luzaga** | Backend Developer — Django REST API, database models, authentication, business logic |
| **Vladimir Bautista** | Frontend Developer — React web admin UI, component design, CSS design system |
| **Joed Binson Rauto** | Mobile Developer & QA Tester — React Native mobile app, testing, bug reporting |

---

## ⚠️ Known Limitations

- **Render Free Tier Cold Start** — The Django and FastAPI backends spin down after ~15 minutes of inactivity. The first request (login) may time out and automatically retry. A "Server is waking up..." message is shown to the user during this period.
- **No Push Notifications** — Notifications are in-app only. The app does not use Expo Push Notifications; users must open the app to see new notifications.
- **No Offline Mode** — The app requires an active internet connection. No data is cached locally for offline use.
- **Expo Go Limitations** — Some native modules (camera, TensorFlow.js) may behave differently on Expo Go vs. a standalone build. A production APK via EAS Build is recommended for full feature testing.
- **TensorFlow.js on Mobile** — On-device image recognition (MobileNet) is resource-intensive and may be slow on older devices.
- **Image Compression** — Images are not compressed before upload; large photos may be slow to upload on slow connections.
- **iOS Not Tested** — The app is primarily developed and tested on Android via Expo Go. iOS compatibility has not been verified due to the lack of an Apple Developer account.
- **Student Role Only** — The mobile app is intended for students only. Admin functionality is only available on the Web Admin Panel.

---

## 📸 Screenshots

Here is a visual walk-through of the student mobile application:

### 🔐 1. Login Screen
*The dark-themed student login screen featuring the SmartFinder logo.*
![Mobile Login Screen](screenshots/screenshot-login.jfif)

### 📝 2. Student Registration Screen
*The registration form for students to sign up with their details.*
![Mobile Registration Screen](screenshots/screenshot-register.jfif)

### 🏠 3. Home Feed
*The home feed showing real-time lost and found item reports with photos.*
![Mobile Home Feed](screenshots/screenshot-home.jfif)

### ➕ 4. Report Item Form
*The intuitive report item screen including AI-powered category prediction.*
![Mobile Report Item Form](screenshots/screenshot-report.jfif)

### 📁 5. My Posts
*Viewing and tracking all the items that the student has personally reported.*
![Mobile My Posts](screenshots/screenshot-myposts.jfif)

### 🔔 6. Notifications Feed
*The list of notifications for claim approvals, replies, and status updates.*
![Mobile Notifications Feed](screenshots/screenshot-notifications.jfif)

### 👤 7. Student Profile Screen
*The student profile view showing account information and the sign-out option.*
![Mobile Student Profile Screen](screenshots/screenshot-profile.jfif)

---

## 📁 Related Repositories

| Repo | Description |
|---|---|
| [smart-finder](https://github.com/Cejj28/smart-finder) | React web admin panel |
| [smart-finder-backend](https://github.com/Cejj28/smart-finder-backend) | Django DRF primary backend |
| [smart-finder-fastapi](https://github.com/Cejj28/smart-finder-fastapi) | FastAPI analytics & ML service |

---

*IT323 — Application Development and Emerging Technologies | Final Project*
