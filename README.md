# 🎲 Monopoly Bank - Digital Banker & Companion App

A modern, fast, and responsive digital banking companion for the classic Monopoly board game (**Indian Cities Edition**), built with **Modular Vanilla JavaScript**, **Node.js/Express**, and **Socket.io** for real-time multiplayer room synchronization.

---

## 🌟 Key Features

### 1. 🌐 Real-Time Multiplayer Rooms (Socket.io)
- **Create Room**: The Banker / Host creates a room code (e.g. `DELH`, `MUMB`, `GOA1`).
- **Join Room**: Players join from their smartphones or laptops using the 4-letter room code.
- **Instant Synchronization**: Any transaction, rent payment, property purchase, dice roll, or card draw automatically syncs across all connected screens in real-time.
- **Offline / Local Mode Fallback**: Works 100% offline via browser `localStorage` when playing in traditional pass-and-play local mode without hosting a room.

### 2. 🇮🇳 Indian Cities Edition Properties
- Complete set of 22 Indian cities across all 8 standard color groups (Bhubaneshwar, Guwahati, Goa, Agra, Vadodara, Ludhiana, Patna, Bhopal, Indore, Nagpur, Kochi, Lucknow, Chandigarh, Jaipur, Pune, Hyderabad, Ahmedabad, Chennai, Kolkata, Bengaluru, Delhi, Mumbai).
- 4 Indian Central Railway Stations (Chennai Central, New Delhi, Howrah, Chhatrapati Shivaji Terminus).
- 2 Utilities (Electric Company, Water Works).
- Authentic Monopoly rent mathematical scaling (monopoly double-rent, 1-4 houses, hotel).

### 3. 🏠 Houses, Hotels & Mortgage System
- **Build Houses & Hotels**: When a player owns a full color group monopoly, they can build houses and upgrade to a hotel with dynamic rent calculation.
- **Mortgage & Unmortgage**: Cash-strapped players can mortgage properties for 50% cash value (rent becomes ₹0), and unmortgage later by paying 50% + 10% interest.
- **Net Worth Tracking**: Live net worth calculation displayed on each player card (Cash + Property Value + Houses).

### 4. 🎲 Interactive Dice Roller (No Audio)
- Built-in 2-dice graphical roller with rolling animation.
- Detects **Doubles** ("Roll again!") and tracks 3 consecutive doubles ("Go directly to Jail!").
- Dynamically integrates with Utility rent calculations.

### 5. 🎴 Interactive Chance & Community Chest Decks
- 16 Chance cards and 16 Community Chest cards.
- Draw cards with a single click and execute actions with 1-tap buttons:
  - Collect dividends or prizes from Bank.
  - Pay fees or taxes to Bank.
  - Collect or pay money to all players (e.g. Chairman, Birthday).
  - General and street repairs calculation based on owned houses/hotels.

### 6. 🔒 Security Hardening & Clean Architecture
- Sensitive files (`.env`, `package.json`, `server.js`) are protected from public HTTP access.
- Removed dead dependencies (AngularJS, duplicate `moongoose` package).
- MongoDB integration for user accounts and cloud transaction logs, with in-memory / local storage fallback if MongoDB is not running locally.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- (Optional) [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas.

### Installation & Run

1. Clone or navigate to the directory:
   ```bash
   cd Monopoly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` (optional, defaults provided):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/monopoly
   JWT_SECRET=your_super_secret_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser:
   ```
   http://localhost:5000
   ```

---

## 📱 How to Play Multiplayer

1. **Host a Game (Banker)**:
   - On the banker screen, click **Create Room**.
   - Note the 4-letter room code (e.g., `PUNE`).
2. **Players Join**:
   - Other players connect to the banker's IP/URL (e.g. `http://<banker-ip>:5000`).
   - Click **Join Room**, enter the 4-letter code and their name.
3. **Play Together**:
   - Perform transactions, buy properties, roll dice, and draw cards—all synchronized instantly!

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Modular Vanilla ES6+ JavaScript, jQuery 3.7.1, SweetAlert2.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT, bcryptjs.