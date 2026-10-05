/**
 * Monopoly Bank - Core Game Script
 * Modular Vanilla Architecture with Real-Time Socket.io Multiplayer
 * Preserved Indian Cities Edition
 */

// -------------------------------------------------------------------------
// DATA DEFINITIONS: INDIAN CITIES, RAILWAYS, UTILITIES, AND CARDS
// -------------------------------------------------------------------------
const INDIAN_PROPERTIES = [
    // Brown Group
    { name: "Bhubaneshwar", price: 60, group: "Brown", rent: 2, houses: [10, 30, 90, 160], hotel: 250, houseCost: 50, mortgage: 30, color: "#955436" },
    { name: "Guwahati", price: 60, group: "Brown", rent: 4, houses: [20, 60, 180, 320], hotel: 450, houseCost: 50, mortgage: 30, color: "#955436" },

    // Light Blue Group
    { name: "Goa", price: 100, group: "Light Blue", rent: 6, houses: [30, 90, 270, 400], hotel: 550, houseCost: 50, mortgage: 50, color: "#aae0fa" },
    { name: "Agra", price: 100, group: "Light Blue", rent: 6, houses: [30, 90, 270, 400], hotel: 550, houseCost: 50, mortgage: 50, color: "#aae0fa" },
    { name: "Vadodara", price: 120, group: "Light Blue", rent: 8, houses: [40, 100, 300, 450], hotel: 600, houseCost: 50, mortgage: 60, color: "#aae0fa" },

    // Pink Group
    { name: "Ludhiana", price: 140, group: "Pink", rent: 10, houses: [50, 150, 450, 625], hotel: 750, houseCost: 100, mortgage: 70, color: "#d93a96" },
    { name: "Patna", price: 140, group: "Pink", rent: 10, houses: [50, 150, 450, 625], hotel: 750, houseCost: 100, mortgage: 70, color: "#d93a96" },
    { name: "Bhopal", price: 160, group: "Pink", rent: 12, houses: [60, 180, 500, 700], hotel: 900, houseCost: 100, mortgage: 80, color: "#d93a96" },

    // Orange Group
    { name: "Indore", price: 180, group: "Orange", rent: 14, houses: [70, 200, 550, 750], hotel: 950, houseCost: 100, mortgage: 90, color: "#f7921c" },
    { name: "Nagpur", price: 180, group: "Orange", rent: 14, houses: [70, 200, 550, 750], hotel: 950, houseCost: 100, mortgage: 90, color: "#f7921c" },
    { name: "Kochi", price: 200, group: "Orange", rent: 16, houses: [80, 220, 600, 800], hotel: 1000, houseCost: 100, mortgage: 100, color: "#f7921c" },

    // Red Group
    { name: "Lucknow", price: 220, group: "Red", rent: 18, houses: [90, 250, 700, 875], hotel: 1050, houseCost: 150, mortgage: 110, color: "#ed1b24" },
    { name: "Chandigarh", price: 220, group: "Red", rent: 18, houses: [90, 250, 700, 875], hotel: 1050, houseCost: 150, mortgage: 110, color: "#ed1b24" },
    { name: "Jaipur", price: 240, group: "Red", rent: 20, houses: [100, 300, 750, 925], hotel: 1100, houseCost: 150, mortgage: 120, color: "#ed1b24" },

    // Yellow Group
    { name: "Pune", price: 260, group: "Yellow", rent: 22, houses: [110, 330, 800, 975], hotel: 1150, houseCost: 150, mortgage: 130, color: "#e6c600" },
    { name: "Hyderabad", price: 260, group: "Yellow", rent: 22, houses: [110, 330, 800, 975], hotel: 1150, houseCost: 150, mortgage: 130, color: "#e6c600" },
    { name: "Ahmedabad", price: 280, group: "Yellow", rent: 24, houses: [120, 360, 850, 1025], hotel: 1200, houseCost: 150, mortgage: 140, color: "#e6c600" },

    // Green Group
    { name: "Chennai", price: 300, group: "Green", rent: 26, houses: [130, 390, 900, 1100], hotel: 1275, houseCost: 200, mortgage: 150, color: "#1fb25a" },
    { name: "Kolkata", price: 300, group: "Green", rent: 26, houses: [130, 390, 900, 1100], hotel: 1275, houseCost: 200, mortgage: 150, color: "#1fb25a" },
    { name: "Bengaluru", price: 320, group: "Green", rent: 28, houses: [150, 450, 1000, 1200], hotel: 1400, houseCost: 200, mortgage: 160, color: "#1fb25a" },

    // Dark Blue Group
    { name: "Delhi", price: 350, group: "Dark Blue", rent: 35, houses: [175, 500, 1100, 1300], hotel: 1500, houseCost: 200, mortgage: 175, color: "#0072bb" },
    { name: "Mumbai", price: 400, group: "Dark Blue", rent: 50, houses: [200, 600, 1400, 1700], hotel: 2000, houseCost: 200, mortgage: 200, color: "#0072bb" },

    // Railroads (Indian Central Railways)
    { name: "Chennai Central Railway Station", price: 200, group: "Railroad", rent: 25, houseCost: 0, mortgage: 100, color: "#221e1f" },
    { name: "New Delhi Railway Station", price: 200, group: "Railroad", rent: 25, houseCost: 0, mortgage: 100, color: "#221e1f" },
    { name: "Howrah Railway Station", price: 200, group: "Railroad", rent: 25, houseCost: 0, mortgage: 100, color: "#221e1f" },
    { name: "Chhatrapati Shivaji Terminus", price: 200, group: "Railroad", rent: 25, houseCost: 0, mortgage: 100, color: "#221e1f" },

    // Utilities
    { name: "Electric Company", price: 150, group: "Utility", rent: 0, houseCost: 0, mortgage: 75, color: "#6d6e71" },
    { name: "Water Works", price: 150, group: "Utility", rent: 0, houseCost: 0, mortgage: 75, color: "#6d6e71" }
];

const CHANCE_CARDS = [
    { title: "Elected Chairman", text: "You have been elected Chairman of the Board. Pay each player ₹50.", action: "pay_all", amount: 50 },
    { title: "Building and Loan Matures", text: "Your building and loan matured. Collect ₹150 from Bank.", action: "collect_bank", amount: 150 },
    { title: "Bank Dividend", text: "Bank pays you dividend of ₹50.", action: "collect_bank", amount: 50 },
    { title: "Poor Tax", text: "Pay Poor Tax of ₹15 to the Bank.", action: "pay_bank", amount: 15 },
    { title: "Advance to GO", text: "Advance to GO. Collect ₹200.", action: "collect_bank", amount: 200 },
    { title: "Speeding Fine", text: "Speeding fine! Pay ₹15 to the Bank.", action: "pay_bank", amount: 15 },
    { title: "Trip to New Delhi Station", text: "Take a trip to New Delhi Railway Station. If you pass GO, collect ₹200.", action: "collect_bank", amount: 200 },
    { title: "General Repairs", text: "Make general repairs on all property: Pay ₹25 per house and ₹100 per hotel.", action: "repairs", houseFee: 25, hotelFee: 100 },
    { title: "Competition Prize", text: "You won second prize in an Indian cities trivia contest. Collect ₹10.", action: "collect_bank", amount: 10 }
];

const COMMUNITY_CARDS = [
    { title: "Advance to GO", text: "Advance to GO. Collect ₹200 from the Bank.", action: "collect_bank", amount: 200 },
    { title: "Bank Error in Your Favor", text: "Bank error in your favor. Collect ₹200 from the Bank.", action: "collect_bank", amount: 200 },
    { title: "Doctor's Fee", text: "Doctor's fee. Pay ₹50 to the Bank.", action: "pay_bank", amount: 50 },
    { title: "From Sale of Stock", text: "From sale of stock you get ₹45.", action: "collect_bank", amount: 45 },
    { title: "Grand Opera Opening", text: "Grand Opera Opening! Collect ₹50 from every player for opening night seats.", action: "collect_all", amount: 50 },
    { title: "Holiday Fund Matures", text: "Holiday Fund matures. Receive ₹100 from Bank.", action: "collect_bank", amount: 100 },
    { title: "Income Tax Refund", text: "Income tax refund. Collect ₹20 from Bank.", action: "collect_bank", amount: 20 },
    { title: "Life Insurance Matures", text: "Life insurance matures. Collect ₹100 from Bank.", action: "collect_bank", amount: 100 },
    { title: "Hospital Bill", text: "Pay Hospital fees of ₹100 to the Bank.", action: "pay_bank", amount: 100 },
    { title: "School Tax", text: "Pay School Tax of ₹150 to the Bank.", action: "pay_bank", amount: 150 },
    { title: "Consultancy Services", text: "Receive ₹25 for professional services rendered.", action: "collect_bank", amount: 25 },
    { title: "Family Inheritance", text: "You inherit ₹100 from family.", action: "collect_bank", amount: 100 },
    { title: "Birthday Gift", text: "It is your Birthday! Collect ₹10 from every player.", action: "collect_all", amount: 10 },
    { title: "Street Repairs Assessment", text: "Assessed for street repairs. Pay ₹40 per house, ₹115 per hotel.", action: "repairs", houseFee: 40, hotelFee: 115 }
];

// -------------------------------------------------------------------------
// DATA CLASSES & STATE
// -------------------------------------------------------------------------
class Player {
    constructor(name) {
        this.name = name;
        this.balance = 1500;
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
        this.properties = [];
    }
}

class Property {
    constructor(data) {
        this.name = data.name;
        this.price = data.price;
        this.group = data.group;
        this.rent = data.rent;
        this.color = data.color;
        this.houses = data.houses || [];
        this.hotel = data.hotel || 0;
        this.houseCost = data.houseCost || 0;
        this.mortgage = data.mortgage || Math.floor(data.price / 2);
        this.houseCount = 0; // 0-4 houses, 5 = hotel
        this.isMortgaged = false;
        this.owner = null;
    }
}

// Global Application State
let players = [];
let properties = [];
let currentTransaction = null;
let currentDrawnCard = null;
let lastDiceRoll = 7;
let consecutiveDoubles = 0;
const PRESET_PASSKEY = "0000";
const API_URL = window.location.origin;

// Real-Time Multiplayer State
let socket = null;
let currentRoomCode = null;
let isRoomHost = false;

// -------------------------------------------------------------------------
// SOCKET.IO & MULTIPLAYER SYSTEM
// -------------------------------------------------------------------------
function initSocket() {
    if (typeof io === 'undefined') {
        console.warn("Socket.io client library not loaded. Running in standalone local mode.");
        return;
    }

    try {
        socket = io();

        socket.on('connect', () => {
            console.log("Connected to Monopoly Bank Server via Socket.io");
        });

        socket.on('player-joined', ({ player, members, gameState }) => {
            Swal.fire({
                title: `${player.name} joined the room!`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
            if (gameState && !isRoomHost) {
                applyGameState(gameState);
            }
        });

        socket.on('state-updated', ({ gameState, actionLog }) => {
            applyGameState(gameState);
            if (actionLog) {
                appendTransactionToHistoryUI(actionLog);
            }
        });

        socket.on('player-left', ({ members }) => {
            console.log("A player left the room. Remaining members:", members);
        });

        socket.on('disconnect', () => {
            console.log("Disconnected from server.");
        });

    } catch (err) {
        console.error("Socket initialization error:", err);
    }
}

function broadcastStateUpdate(actionLog) {
    if (socket && currentRoomCode) {
        socket.emit('sync-game-state', {
            roomCode: currentRoomCode,
            gameState: {
                players,
                properties,
                lastDiceRoll
            },
            actionLog
        });
    }
}

function openCreateRoomModal() {
    if (!checkAuth()) return;
    document.getElementById('createRoomModal').style.display = 'flex';
}

function closeCreateRoomModal() {
    document.getElementById('createRoomModal').style.display = 'none';
}

function confirmCreateRoom() {
    if (!socket) {
        Swal.fire({ title: 'Multiplayer server unavailable', text: 'Playing in Local Offline mode.', icon: 'warning' });
        closeCreateRoomModal();
        return;
    }

    const hostName = document.getElementById('createRoomHostName').value.trim() || 'Banker';
    socket.emit('create-room', { 
        hostName, 
        initialGameState: { players, properties, lastDiceRoll } 
    }, (res) => {
        if (res && res.success) {
            currentRoomCode = res.roomCode;
            isRoomHost = true;
            updateRoomUI(currentRoomCode, true);
            closeCreateRoomModal();
            Swal.fire({
                title: 'Room Created!',
                html: `Room Code: <strong style="font-size: 1.5rem; color: #0072bb;">${res.roomCode}</strong><br>Share this code with your friends to join on their devices!`,
                icon: 'success'
            });
        } else {
            Swal.fire({ title: 'Error creating room', text: res?.error || 'Unknown error', icon: 'error' });
        }
    });
}

function openJoinRoomModal() {
    document.getElementById('joinRoomModal').style.display = 'flex';
}

function closeJoinRoomModal() {
    document.getElementById('joinRoomModal').style.display = 'none';
}

function confirmJoinRoom() {
    if (!socket) {
        Swal.fire({ title: 'Multiplayer server unavailable', text: 'Playing in Local Offline mode.', icon: 'warning' });
        closeJoinRoomModal();
        return;
    }

    const roomCode = document.getElementById('joinRoomCodeInput').value.trim().toUpperCase();
    const playerName = document.getElementById('joinRoomPlayerName').value.trim();

    if (!roomCode || roomCode.length < 4) {
        Swal.fire({ title: 'Invalid Room Code', text: 'Please enter a valid 4-character room code.', icon: 'error' });
        return;
    }

    if (!playerName) {
        Swal.fire({ title: 'Name Required', text: 'Please enter your player name.', icon: 'error' });
        return;
    }

    socket.emit('join-room', { roomCode, playerName }, (res) => {
        if (res && res.success) {
            currentRoomCode = res.roomCode;
            isRoomHost = res.isHost;
            updateRoomUI(currentRoomCode, isRoomHost);

            if (res.gameState) {
                applyGameState(res.gameState);
            }

            // If player does not exist in game, add them automatically
            let existingPlayer = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
            if (!existingPlayer) {
                const newP = new Player(playerName);
                players.push(newP);
                updatePlayersDisplay();
                updatePropertyDisplay();
                broadcastStateUpdate(`${playerName} joined the game`);
            }

            closeJoinRoomModal();
            Swal.fire({
                title: 'Joined Room!',
                text: `Connected to Room ${res.roomCode} as ${playerName}`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({ title: 'Error joining room', text: res?.error || 'Room not found', icon: 'error' });
        }
    });
}

function leaveRoom() {
    if (socket && currentRoomCode) {
        socket.disconnect();
        socket.connect();
    }
    currentRoomCode = null;
    isRoomHost = false;
    updateRoomUI(null, false);
    Swal.fire({ title: 'Switched to Local Mode', text: 'You are now playing in offline local banker mode.', icon: 'info' });
}

function updateRoomUI(code, isHost) {
    const badge = document.getElementById('roomStatusText');
    const leaveBtn = document.getElementById('leaveRoomBtn');
    const createBtn = document.getElementById('createRoomBtn');
    const joinBtn = document.getElementById('joinRoomBtn');

    if (code) {
        badge.innerHTML = `Room: <span class="room-code-tag">${code}</span> (${isHost ? 'Host' : 'Member'})`;
        leaveBtn.style.display = 'inline-flex';
        createBtn.style.display = 'none';
        joinBtn.style.display = 'none';
    } else {
        badge.innerHTML = `Mode: <strong>Local Offline</strong>`;
        leaveBtn.style.display = 'none';
        createBtn.style.display = 'inline-flex';
        joinBtn.style.display = 'inline-flex';
    }
}

function applyGameState(state) {
    if (!state) return;
    if (state.players) players = state.players;
    if (state.properties) properties = state.properties;
    if (state.lastDiceRoll) lastDiceRoll = state.lastDiceRoll;
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveDataLocally();
}

// -------------------------------------------------------------------------
// DATA PERSISTENCE & INITIALIZATION
// -------------------------------------------------------------------------
function initializeProperties() {
    properties = INDIAN_PROPERTIES.map(p => new Property(p));
}

function loadData() {
    const storedPlayers = localStorage.getItem('monopolyPlayers');
    const storedProperties = localStorage.getItem('monopolyProperties');

    if (storedProperties) {
        try {
            properties = JSON.parse(storedProperties);
        } catch (e) {
            initializeProperties();
        }
    } else {
        initializeProperties();
    }

    if (storedPlayers) {
        try {
            players = JSON.parse(storedPlayers);
        } catch (e) {
            players = [];
        }
    }

    updatePlayersDisplay();
    updatePropertyDisplay();
}

function saveData() {
    saveDataLocally();
    broadcastStateUpdate();
}

function saveDataLocally() {
    localStorage.setItem('monopolyPlayers', JSON.stringify(players));
    localStorage.setItem('monopolyProperties', JSON.stringify(properties));
}

function resetLocalData() {
    localStorage.removeItem('monopolyPlayers');
    localStorage.removeItem('monopolyProperties');

    players = [];
    initializeProperties();

    updatePlayersDisplay();
    updatePropertyDisplay();
    broadcastStateUpdate('Game was reset');

    Swal.fire({
        title: 'Game Reset!',
        text: 'All players and property ownerships have been reset to bank defaults.',
        icon: 'success'
    });
}

function resetDataWithPasskey() {
    showPasskeyModal();
}

// -------------------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------------------
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

function checkAuth() {
    if (!isAuthenticated()) {
        Swal.fire({
            title: 'Please Login',
            text: 'You must be logged in to access this feature.',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
        return false;
    }
    return true;
}

function showPopup(id) {
    document.getElementById(id).style.display = 'block';
}

function hidePopup(id) {
    document.getElementById(id).style.display = 'none';
}

async function register() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !email || !password) {
        Swal.fire({ title: 'All fields are required', icon: 'error' });
        return;
    }

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({ title: data.message, icon: 'success' });
            hidePopup('register-popup');
        } else {
            Swal.fire({ title: 'Registration Failed', text: data.message || 'Error', icon: 'error' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error', text: err.message, icon: 'error' });
    }
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        Swal.fire({ title: 'Email and password required', icon: 'error' });
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            document.getElementById('logout-btn').style.display = 'inline-block';
            hidePopup('login-popup');
            Swal.fire({ title: `Welcome, ${data.username || 'Banker'}!`, icon: 'success', timer: 1800, showConfirmButton: false });
            fetchTransactions();
        } else {
            Swal.fire({ title: 'Login Failed', text: data.message || 'Invalid Credentials', icon: 'error' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error', text: err.message, icon: 'error' });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    document.getElementById('logout-btn').style.display = 'none';
    Swal.fire({ title: 'Logged Out', icon: 'info', timer: 1500, showConfirmButton: false });
}

// -------------------------------------------------------------------------
// GAME CALCULATIONS & CORE MONOPOLY RULES
// -------------------------------------------------------------------------
function ownsMonopoly(ownerName, groupName) {
    if (!ownerName || groupName === "Railroad" || groupName === "Utility") return false;
    const groupProperties = properties.filter(p => p.group === groupName);
    return groupProperties.length > 0 && groupProperties.every(p => p.owner === ownerName);
}

function calculateCurrentRent(property) {
    if (property.isMortgaged) return 0;

    // Railroad logic
    if (property.group === "Railroad") {
        const ownedRailroads = properties.filter(p => p.group === "Railroad" && p.owner === property.owner).length;
        switch (ownedRailroads) {
            case 1: return 25;
            case 2: return 50;
            case 3: return 100;
            case 4: return 200;
            default: return 25;
        }
    }

    // Utility logic
    if (property.group === "Utility") {
        const ownedUtilities = properties.filter(p => p.group === "Utility" && p.owner === property.owner).length;
        const multiplier = ownedUtilities === 2 ? 10 : 4;
        return multiplier * lastDiceRoll;
    }

    // Standard Property
    const houses = property.houseCount || 0;
    if (houses === 0) {
        const hasMonopoly = ownsMonopoly(property.owner, property.group);
        return hasMonopoly ? property.rent * 2 : property.rent;
    } else if (houses >= 1 && houses <= 4) {
        return property.houses && property.houses[houses - 1] ? property.houses[houses - 1] : property.rent * (houses + 1);
    } else if (houses === 5) {
        return property.hotel || property.rent * 10;
    }

    return property.rent;
}

function calculateNetWorth(player) {
    let total = player.balance;
    const playerProps = properties.filter(p => p.owner === player.name);

    playerProps.forEach(p => {
        if (p.isMortgaged) {
            total += Math.floor(p.price / 2);
        } else {
            total += p.price;
            total += (p.houseCount || 0) * (p.houseCost || 0);
        }
    });

    return total;
}

// -------------------------------------------------------------------------
// PLAYER & PROPERTY UI RENDERING
// -------------------------------------------------------------------------
function updatePlayersDisplay() {
    const container = document.getElementById('playersContainer');
    if (!container) return;
    container.innerHTML = '';

    if (players.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 20px;">No players in the game. Add players above to begin!</div>`;
        return;
    }

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';

        const netWorth = calculateNetWorth(player);
        const ownedProps = properties.filter(p => p.owner === player.name);

        let propertiesHtml = '';
        if (ownedProps.length > 0) {
            propertiesHtml = `<div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: #333;">Properties (${ownedProps.length}):</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">`;

            ownedProps.forEach(prop => {
                const currentRent = calculateCurrentRent(prop);
                let houseBadge = '';
                if (prop.houseCount === 5) {
                    houseBadge = `<span class="house-indicator" style="background:#e12d39; color:white;">🏨 Hotel</span>`;
                } else if (prop.houseCount > 0) {
                    houseBadge = `<span class="house-indicator" style="background:#2b6cb0; color:white;">🏠 x ${prop.houseCount}</span>`;
                }

                const mortgageBadge = prop.isMortgaged ? `<span class="prop-badge-mortgaged" style="padding: 2px 6px; border-radius: 4px; color: white; font-size: 0.75rem;">Mortgaged</span>` : '';

                const canBuild = ownsMonopoly(player.name, prop.group) && prop.group !== "Railroad" && prop.group !== "Utility" && !prop.isMortgaged;

                propertiesHtml += `
                    <li style="padding: 10px; margin: 6px 0; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span style="width: 14px; height: 14px; border-radius: 50%; display: inline-block; background-color: ${prop.color};"></span>
                                ${prop.name} ${houseBadge} ${mortgageBadge}
                            </span>
                            <span style="font-size: 0.85rem; color: #4a5568;">Rent: &#8377;${currentRent}</span>
                        </div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${canBuild && (prop.houseCount || 0) < 5 ? `<button onclick="buildHouse('${player.id}', '${prop.name}')" style="padding: 4px 8px; font-size: 0.75rem; background: #2b6cb0;"><i class="fas fa-home"></i> +House (&#8377;${prop.houseCost})</button>` : ''}
                            ${(prop.houseCount || 0) > 0 ? `<button onclick="sellHouse('${player.id}', '${prop.name}')" style="padding: 4px 8px; font-size: 0.75rem; background: #d69e2e;"><i class="fas fa-hammer"></i> -House</button>` : ''}
                            ${!prop.isMortgaged ? `<button onclick="mortgageProperty('${player.id}', '${prop.name}')" style="padding: 4px 8px; font-size: 0.75rem; background: #718096;"><i class="fas fa-university"></i> Mortgage (&#8377;${prop.mortgage})</button>` : `<button onclick="unmortgageProperty('${player.id}', '${prop.name}')" style="padding: 4px 8px; font-size: 0.75rem; background: #38a169;"><i class="fas fa-undo"></i> Unmortgage (&#8377;${Math.floor(prop.mortgage * 1.1)})</button>`}
                            <button onclick="sellProperty('${player.id}', '${prop.name}')" style="padding: 4px 8px; font-size: 0.75rem; background: #c53030;"><i class="fas fa-trash"></i> Sell</button>
                        </div>
                    </li>
                `;
            });
            propertiesHtml += '</ul></div>';
        } else {
            propertiesHtml = `<div style="margin-top: 10px; font-size: 0.85rem; color: #a0aec0; font-style: italic;">No properties owned</div>`;
        }

        const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'P';

        playerCard.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${initials}</div>
                <h3 class="player-name">${player.name}</h3>
            </div>
            <div class="player-balance">&#8377;${player.balance.toLocaleString('en-IN')}</div>
            <div class="player-net-worth"><i class="fas fa-chart-line"></i> Net Worth: &#8377;${netWorth.toLocaleString('en-IN')}</div>
            <div class="player-actions" style="display: flex; gap: 8px; margin-bottom: 15px;">
                <button onclick="showTransactionModal('receive', '${player.id}')" style="flex: 1; padding: 8px; font-size: 0.85rem;"><i class="fas fa-plus"></i> Collect</button>
                <button onclick="showTransactionModal('pay', '${player.id}')" style="flex: 1; padding: 8px; font-size: 0.85rem;"><i class="fas fa-minus"></i> Pay</button>
                <button onclick="removePlayer('${player.id}')" style="padding: 8px 12px; background: #e53e3e; font-size: 0.85rem;"><i class="fas fa-user-times"></i></button>
            </div>
            ${propertiesHtml}
        `;
        container.appendChild(playerCard);
    });
}

function updatePropertyDisplay() {
    const container = document.getElementById('propertiesContainer');
    if (!container) return;
    container.innerHTML = '';

    const groupedProperties = properties.reduce((acc, prop) => {
        if (!acc[prop.group]) {
            acc[prop.group] = [];
        }
        acc[prop.group].push(prop);
        return acc;
    }, {});

    Object.entries(groupedProperties).forEach(([group, props]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'property-group';

        const groupColor = props[0].color || '#0072bb';

        let groupHtml = `
            <div class="property-group-header" style="background-color: ${groupColor};">
                ${group}
            </div>
        `;

        props.forEach(prop => {
            let ownerInfo = 'Bank';
            let rentButton = '';
            const currentRent = calculateCurrentRent(prop);

            if (prop.owner) {
                ownerInfo = `<span style="color: #2b6cb0; font-weight: 600;">${prop.owner}</span>`;
                if (!prop.isMortgaged) {
                    rentButton = `<button onclick="payRent('${prop.name}')" style="padding: 6px 12px; font-size: 0.85rem; margin-top: 8px; width: 100%;"><i class="fas fa-hand-holding-usd"></i> Pay Rent (&#8377;${currentRent})</button>`;
                } else {
                    rentButton = `<div style="font-size: 0.8rem; color: #a0aec0; margin-top: 5px; font-style: italic;">Mortgaged (Rent is &#8377;0)</div>`;
                }
            }

            let houseInfo = '';
            if (prop.houseCount === 5) {
                houseInfo = ` | <span style="color:#e12d39; font-weight: 600;">🏨 Hotel</span>`;
            } else if (prop.houseCount > 0) {
                houseInfo = ` | <span style="color:#2b6cb0; font-weight: 600;">🏠 x ${prop.houseCount}</span>`;
            }

            groupHtml += `
                <div class="property-item" style="border-left: 4px solid ${prop.color};">
                    <div style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <strong class="property-name">${prop.name}</strong>
                            <span class="property-price">&#8377;${prop.price}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #4a5568; margin-top: 4px;">
                            <span>Base: &#8377;${prop.rent}${houseInfo}</span>
                            <span>Owner: ${ownerInfo}</span>
                        </div>
                        ${rentButton}
                    </div>
                </div>
            `;
        });

        groupDiv.innerHTML = groupHtml;
        container.appendChild(groupDiv);
    });
}

// -------------------------------------------------------------------------
// GAME ACTIONS: PLAYERS, HOUSES, MORTGAGES, TRANSACTIONS
// -------------------------------------------------------------------------
function addPlayer() {
    const nameInput = document.getElementById('newPlayerName');
    const name = nameInput.value.trim();

    if (!name) {
        Swal.fire({ title: 'Please enter a player name', icon: 'warning' });
        return;
    }

    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        Swal.fire({ title: 'Player already exists', text: 'Please use a unique name.', icon: 'warning' });
        return;
    }

    const player = new Player(name);
    players.push(player);
    nameInput.value = '';

    const logMsg = `Added new player ${player.name} with &#8377;1,500`;
    addTransaction(logMsg);
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

function removePlayer(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    Swal.fire({
        title: `Remove ${player.name}?`,
        text: 'All properties owned by this player will be returned to the Bank!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
    }).then(result => {
        if (result.isConfirmed) {
            properties.forEach(p => {
                if (p.owner === player.name) {
                    p.owner = null;
                    p.houseCount = 0;
                    p.isMortgaged = false;
                }
            });

            players = players.filter(p => p.id !== playerId);
            const logMsg = `Removed player ${player.name}. Assets returned to Bank.`;
            addTransaction(logMsg);
            updatePlayersDisplay();
            updatePropertyDisplay();
            saveData();
        }
    });
}

// House & Hotel Construction
function buildHouse(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property) return;

    if (!ownsMonopoly(player.name, property.group)) {
        Swal.fire({ title: 'Monopoly Required', text: 'You must own all properties in this color group to build houses!', icon: 'warning' });
        return;
    }

    if (property.houseCount >= 5) {
        Swal.fire({ title: 'Max Upgraded', text: 'This property already has a Hotel!', icon: 'info' });
        return;
    }

    const cost = property.houseCost || 50;
    if (player.balance < cost) {
        Swal.fire({ title: 'Insufficient Funds', text: `You need &#8377;${cost} to build.`, icon: 'error' });
        return;
    }

    player.balance -= cost;
    property.houseCount = (property.houseCount || 0) + 1;

    const buildingType = property.houseCount === 5 ? 'Hotel' : `House #${property.houseCount}`;
    const logMsg = `${player.name} built a ${buildingType} on ${property.name} for &#8377;${cost}`;

    Swal.fire({ title: 'Built Successfully!', text: logMsg, icon: 'success' });
    addTransaction(logMsg);
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

function sellHouse(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property || (property.houseCount || 0) <= 0) return;

    const refund = Math.floor((property.houseCost || 50) / 2);
    player.balance += refund;
    property.houseCount -= 1;

    const logMsg = `${player.name} sold a building on ${property.name} for &#8377;${refund}`;
    Swal.fire({ title: 'Building Sold', text: logMsg, icon: 'info' });
    addTransaction(logMsg);
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

// Mortgage & Unmortgage
function mortgageProperty(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property) return;

    if (property.houseCount > 0) {
        Swal.fire({ title: 'Sell Buildings First', text: 'You must sell all houses/hotels before mortgaging this property!', icon: 'warning' });
        return;
    }

    property.isMortgaged = true;
    player.balance += property.mortgage;

    const logMsg = `${player.name} mortgaged ${property.name} and received &#8377;${property.mortgage}`;
    Swal.fire({ title: 'Property Mortgaged', text: logMsg, icon: 'info' });
    addTransaction(logMsg);
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

function unmortgageProperty(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property) return;

    const cost = Math.floor(property.mortgage * 1.1); // Mortgage value + 10%
    if (player.balance < cost) {
        Swal.fire({ title: 'Insufficient Funds', text: `You need &#8377;${cost} to unmortgage.`, icon: 'error' });
        return;
    }

    player.balance -= cost;
    property.isMortgaged = false;

    const logMsg = `${player.name} unmortgaged ${property.name} for &#8377;${cost}`;
    Swal.fire({ title: 'Property Unmortgaged', text: logMsg, icon: 'success' });
    addTransaction(logMsg);
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

// Buying & Selling Property
function showPropertyModal() {
    const propertySelect = document.getElementById('propertySelect');
    const playerSelect = document.getElementById('playerSelect');

    propertySelect.innerHTML = '';
    playerSelect.innerHTML = '';

    const availableProperties = properties.filter(p => !p.owner);
    if (availableProperties.length === 0) {
        Swal.fire({ title: 'No Available Properties', text: 'All properties are currently owned by players!', icon: 'info' });
        return;
    }

    if (players.length === 0) {
        Swal.fire({ title: 'No Players Found', text: 'Add players to the game before purchasing properties.', icon: 'warning' });
        return;
    }

    availableProperties.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop.name;
        option.textContent = `${prop.name} (${prop.group}) - ₹${prop.price}`;
        propertySelect.appendChild(option);
    });

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = `${player.name} - ₹${player.balance}`;
        playerSelect.appendChild(option);
    });

    document.getElementById('propertyModal').style.display = 'flex';
}

function cancelPropertyPurchase() {
    document.getElementById('propertyModal').style.display = 'none';
}

function confirmPropertyPurchase() {
    const propertyName = document.getElementById('propertySelect').value;
    const playerId = document.getElementById('playerSelect').value;
    const property = properties.find(p => p.name === propertyName);
    const player = players.find(p => p.id === playerId);

    if (!property || !player) {
        Swal.fire({ title: 'Please select a valid property and player', icon: 'error' });
        return;
    }

    if (player.balance < property.price) {
        Swal.fire({ title: 'Insufficient Funds', text: `${player.name} needs ₹${property.price} to buy ${property.name}.`, icon: 'error' });
        return;
    }

    player.balance -= property.price;
    property.owner = player.name;

    const logMsg = `${player.name} bought ${property.name} from Bank for ₹${property.price}`;
    Swal.fire({ title: 'Purchase Successful!', text: logMsg, icon: 'success' });
    addTransaction(logMsg);

    cancelPropertyPurchase();
    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

function sellProperty(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property) return;

    if (property.houseCount > 0) {
        Swal.fire({ title: 'Sell Houses First', text: 'Sell all houses/hotel before selling property.', icon: 'warning' });
        return;
    }

    const sellPrice = Math.floor(property.price / 2);
    player.balance += sellPrice;
    property.owner = null;
    property.isMortgaged = false;

    const logMsg = `${player.name} sold ${property.name} back to Bank for ₹${sellPrice}`;
    Swal.fire({ title: 'Property Sold', text: logMsg, icon: 'info' });
    addTransaction(logMsg);

    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData();
}

// Rent Payment
function payRent(propertyName) {
    const property = properties.find(p => p.name === propertyName);
    if (!property || !property.owner) return;

    const owner = players.find(p => p.name === property.owner);
    if (!owner) return;

    const potentialPayers = players.filter(p => p.name !== owner.name);
    if (potentialPayers.length === 0) {
        Swal.fire({ title: 'No other players', text: 'There are no other players to pay rent.', icon: 'info' });
        return;
    }

    const currentRent = calculateCurrentRent(property);

    const inputOptions = {};
    potentialPayers.forEach(p => {
        inputOptions[p.id] = `${p.name} (Balance: ₹${p.balance})`;
    });

    Swal.fire({
        title: `Pay Rent for ${property.name}`,
        html: `<div style="text-align: left; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 4px 0;"><strong>Owner:</strong> ${owner.name}</p>
            <p style="margin: 4px 0;"><strong>Rent Due:</strong> <span style="font-size: 1.2rem; color: #e53e3e; font-weight: bold;">₹${currentRent}</span></p>
        </div><br>Select paying player:`,
        input: 'select',
        inputOptions: inputOptions,
        inputPlaceholder: 'Select player',
        showCancelButton: true,
        confirmButtonText: 'Pay Rent'
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const payer = players.find(p => p.id === result.value);
            if (!payer) return;

            if (payer.balance < currentRent) {
                Swal.fire({ title: 'Insufficient Funds', text: `${payer.name} does not have ₹${currentRent} to pay rent!`, icon: 'error' });
                return;
            }

            payer.balance -= currentRent;
            owner.balance += currentRent;

            const logMsg = `${payer.name} paid ₹${currentRent} rent to ${owner.name} for ${property.name}`;
            Swal.fire({ title: 'Rent Paid!', text: logMsg, icon: 'success' });
            addTransaction(logMsg);

            updatePlayersDisplay();
            updatePropertyDisplay();
            saveData();
        }
    });
}

// Direct Player Transactions
function showPlayerTransactionModal() {
    if (players.length < 2) {
        Swal.fire({ title: 'Need at least 2 players', text: 'Add at least 2 players to perform transfers.', icon: 'info' });
        return;
    }

    const fromOptions = {};
    const toOptions = {};
    players.forEach(p => {
        fromOptions[p.id] = `${p.name} (₹${p.balance})`;
        toOptions[p.id] = `${p.name} (₹${p.balance})`;
    });

    Swal.fire({
        title: 'Player-to-Player Transfer',
        html: `
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">From Player:</label>
                    <select id="swalFromPlayer" class="swal2-select" style="width: 100%; margin: 5px 0;">
                        ${players.map(p => `<option value="${p.id}">${p.name} (₹${p.balance})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">To Player:</label>
                    <select id="swalToPlayer" class="swal2-select" style="width: 100%; margin: 5px 0;">
                        ${players.map((p, idx) => `<option value="${p.id}" ${idx === 1 ? 'selected' : ''}>${p.name} (₹${p.balance})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Amount (₹):</label>
                    <input type="number" id="swalAmount" class="swal2-input" placeholder="Amount" min="1" style="width: 100%; margin: 5px 0;">
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Reason (Optional):</label>
                    <input type="text" id="swalReason" class="swal2-input" placeholder="Rent, Trade, Deal..." style="width: 100%; margin: 5px 0;">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Transfer Money',
        preConfirm: () => {
            const fromId = document.getElementById('swalFromPlayer').value;
            const toId = document.getElementById('swalToPlayer').value;
            const amount = parseInt(document.getElementById('swalAmount').value, 10);
            const reason = document.getElementById('swalReason').value.trim();

            if (fromId === toId) {
                Swal.showValidationMessage('Cannot transfer money to the same player!');
                return false;
            }
            if (!amount || isNaN(amount) || amount <= 0) {
                Swal.showValidationMessage('Please enter a valid transfer amount!');
                return false;
            }
            return { fromId, toId, amount, reason };
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const { fromId, toId, amount, reason } = result.value;
            const fromPlayer = players.find(p => p.id === fromId);
            const toPlayer = players.find(p => p.id === toId);

            if (!fromPlayer || !toPlayer) return;

            if (fromPlayer.balance < amount) {
                Swal.fire({ title: 'Insufficient Funds', text: `${fromPlayer.name} does not have ₹${amount}!`, icon: 'error' });
                return;
            }

            fromPlayer.balance -= amount;
            toPlayer.balance += amount;

            const reasonText = reason ? ` for "${reason}"` : '';
            const logMsg = `${fromPlayer.name} transferred ₹${amount} to ${toPlayer.name}${reasonText}`;
            Swal.fire({ title: 'Transfer Complete!', text: logMsg, icon: 'success' });
            addTransaction(logMsg);

            updatePlayersDisplay();
            saveData();
        }
    });
}

// Pay Bank
function payBank() {
    if (players.length === 0) {
        Swal.fire({ title: 'No players in game', icon: 'info' });
        return;
    }

    Swal.fire({
        title: 'Pay to Bank',
        html: `
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Paying Player:</label>
                    <select id="swalBankPlayer" class="swal2-select" style="width: 100%; margin: 5px 0;">
                        ${players.map(p => `<option value="${p.id}">${p.name} (₹${p.balance})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Amount (₹):</label>
                    <input type="number" id="swalBankAmount" class="swal2-input" placeholder="Amount" min="1" style="width: 100%; margin: 5px 0;">
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Reason:</label>
                    <select id="swalBankReason" class="swal2-select" style="width: 100%; margin: 5px 0;">
                        <option value="Income Tax">Income Tax</option>
                        <option value="Luxury Tax">Luxury Tax</option>
                        <option value="Property Repairs">Property Repairs</option>
                        <option value="Jail Fine">Jail Fine (₹50)</option>
                        <option value="Chance Card Fee">Chance Card Fee</option>
                        <option value="Community Chest Fee">Community Chest Fee</option>
                        <option value="Other">Other Bank Payment</option>
                    </select>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Pay Bank',
        preConfirm: () => {
            const playerId = document.getElementById('swalBankPlayer').value;
            const amount = parseInt(document.getElementById('swalBankAmount').value, 10);
            const reason = document.getElementById('swalBankReason').value;

            if (!amount || isNaN(amount) || amount <= 0) {
                Swal.showValidationMessage('Please enter a valid amount!');
                return false;
            }
            return { playerId, amount, reason };
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const { playerId, amount, reason } = result.value;
            const player = players.find(p => p.id === playerId);
            if (!player) return;

            if (player.balance < amount) {
                Swal.fire({ title: 'Insufficient Funds', text: `${player.name} does not have ₹${amount}!`, icon: 'error' });
                return;
            }

            player.balance -= amount;
            const logMsg = `${player.name} paid ₹${amount} to Bank for ${reason}`;
            Swal.fire({ title: 'Payment Confirmed', text: logMsg, icon: 'success' });
            addTransaction(logMsg);

            updatePlayersDisplay();
            saveData();
        }
    });
}

// Pay All Players
function payAllPlayers() {
    if (players.length < 2) {
        Swal.fire({ title: 'Need at least 2 players', icon: 'info' });
        return;
    }

    Swal.fire({
        title: 'Pay All Players',
        html: `
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Paying Player:</label>
                    <select id="swalPayAllPlayer" class="swal2-select" style="width: 100%; margin: 5px 0;">
                        ${players.map(p => `<option value="${p.id}">${p.name} (₹${p.balance})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-weight: 500; font-size: 0.9rem;">Amount Per Player (₹):</label>
                    <input type="number" id="swalPayAllAmount" class="swal2-input" placeholder="e.g. 50" min="1" style="width: 100%; margin: 5px 0;">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Distribute Money',
        preConfirm: () => {
            const playerId = document.getElementById('swalPayAllPlayer').value;
            const amount = parseInt(document.getElementById('swalPayAllAmount').value, 10);
            if (!amount || isNaN(amount) || amount <= 0) {
                Swal.showValidationMessage('Please enter a valid amount!');
                return false;
            }
            return { playerId, amount };
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const { playerId, amount } = result.value;
            const payingPlayer = players.find(p => p.id === playerId);
            if (!payingPlayer) return;

            const otherPlayers = players.filter(p => p.id !== playerId);
            const totalRequired = amount * otherPlayers.length;

            if (payingPlayer.balance < totalRequired) {
                Swal.fire({ title: 'Insufficient Funds', text: `${payingPlayer.name} needs ₹${totalRequired} to pay ₹${amount} to each player!`, icon: 'error' });
                return;
            }

            payingPlayer.balance -= totalRequired;
            otherPlayers.forEach(p => p.balance += amount);

            const logMsg = `${payingPlayer.name} paid ₹${amount} to each player (Total: ₹${totalRequired})`;
            Swal.fire({ title: 'Payment Successful!', text: logMsg, icon: 'success' });
            addTransaction(logMsg);

            updatePlayersDisplay();
            saveData();
        }
    });
}

// Receive / Pay Modal
function showTransactionModal(type, playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    currentTransaction = { type, playerId };
    document.getElementById('transactionModalTitle').textContent = type === 'receive' ? `Collect Money for ${player.name}` : `Pay Money from ${player.name}`;
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionModal').style.display = 'flex';
}

function cancelTransaction() {
    currentTransaction = null;
    document.getElementById('transactionModal').style.display = 'none';
}

function confirmTransaction() {
    if (!currentTransaction) return;

    const amount = parseInt(document.getElementById('transactionAmount').value, 10);
    if (!amount || isNaN(amount) || amount <= 0) {
        Swal.fire({ title: 'Please enter a valid amount', icon: 'error' });
        return;
    }

    const player = players.find(p => p.id === currentTransaction.playerId);
    if (!player) return;

    let logMsg = '';
    if (currentTransaction.type === 'receive') {
        player.balance += amount;
        logMsg = `${player.name} collected ₹${amount} from Bank`;
    } else {
        if (player.balance < amount) {
            Swal.fire({ title: 'Insufficient Funds', text: `${player.name} does not have ₹${amount}!`, icon: 'error' });
            return;
        }
        player.balance -= amount;
        logMsg = `${player.name} paid ₹${amount} to Bank`;
    }

    addTransaction(logMsg);
    cancelTransaction();
    updatePlayersDisplay();
    saveData();
}

// Passkey Game Reset
function showPasskeyModal() {
    Swal.fire({
        title: 'Reset Game Confirmation',
        text: 'Enter the banker reset passkey to reset the game data:',
        input: 'password',
        inputPlaceholder: 'Enter passkey (default: 0000)',
        showCancelButton: true,
        confirmButtonText: 'Reset Game'
    }).then(result => {
        if (result.isConfirmed) {
            if (result.value === PRESET_PASSKEY) {
                resetLocalData();
            } else {
                Swal.fire({ title: 'Incorrect Passkey', icon: 'error' });
            }
        }
    });
}

// -------------------------------------------------------------------------
// DICE ROLLER WIDGET (Clean Visual, No Audio)
// -------------------------------------------------------------------------
function rollDice() {
    const die1El = document.getElementById('die1');
    const die2El = document.getElementById('die2');
    const resultText = document.getElementById('diceResultText');

    die1El.classList.add('rolling');
    die2El.classList.add('rolling');

    setTimeout(() => {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const total = roll1 + roll2;
        const isDoubles = (roll1 === roll2);

        die1El.textContent = roll1;
        die2El.textContent = roll2;

        die1El.classList.remove('rolling');
        die2El.classList.remove('rolling');

        lastDiceRoll = total;

        if (isDoubles) {
            consecutiveDoubles += 1;
            if (consecutiveDoubles === 3) {
                resultText.innerHTML = `<strong>Rolled ${roll1} + ${roll2} = ${total} (3 Doubles in a row! GO TO JAIL!)</strong>`;
                consecutiveDoubles = 0;
            } else {
                resultText.innerHTML = `<strong>Rolled ${roll1} + ${roll2} = ${total} (DOUBLES! Roll again!)</strong>`;
            }
        } else {
            consecutiveDoubles = 0;
            resultText.textContent = `Rolled ${roll1} + ${roll2} = ${total}`;
        }

        const logMsg = `Dice Roll: ${roll1} + ${roll2} = ${total}${isDoubles ? ' (DOUBLES)' : ''}`;
        addTransaction(logMsg);
        broadcastStateUpdate(logMsg);
    }, 350);
}

// -------------------------------------------------------------------------
// INTERACTIVE CHANCE & COMMUNITY CHEST CARDS (No Audio)
// -------------------------------------------------------------------------
function drawCard(deckType) {
    if (players.length === 0) {
        Swal.fire({ title: 'No players in game', text: 'Add players first before drawing cards!', icon: 'warning' });
        return;
    }

    const deck = deckType === 'Chance' ? CHANCE_CARDS : COMMUNITY_CARDS;
    const card = deck[Math.floor(Math.random() * deck.length)];
    currentDrawnCard = { ...card, deckType };

    const headerEl = document.getElementById('cardHeader');
    headerEl.textContent = deckType === 'Chance' ? 'Chance Card' : 'Community Chest';
    headerEl.className = `game-card-header ${deckType.toLowerCase()}`;

    document.getElementById('cardText').textContent = card.text;

    // Populate player dropdown
    const select = document.getElementById('cardPlayerSelect');
    select.innerHTML = '';
    players.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} (Balance: ₹${p.balance})`;
        select.appendChild(opt);
    });

    document.getElementById('cardModal').style.display = 'flex';
}

function cancelCardModal() {
    currentDrawnCard = null;
    document.getElementById('cardModal').style.display = 'none';
}

function confirmCardAction() {
    if (!currentDrawnCard) return;

    const playerId = document.getElementById('cardPlayerSelect').value;
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const { action, amount, text } = currentDrawnCard;
    let logMsg = '';

    if (action === 'collect_bank') {
        player.balance += amount;
        logMsg = `${player.name} drew "${text}" and collected ₹${amount} from Bank`;
    } else if (action === 'pay_bank') {
        player.balance -= amount;
        logMsg = `${player.name} drew "${text}" and paid ₹${amount} to Bank`;
    } else if (action === 'pay_all') {
        const others = players.filter(p => p.id !== player.id);
        const total = amount * others.length;
        player.balance -= total;
        others.forEach(o => o.balance += amount);
        logMsg = `${player.name} drew "${text}" and paid ₹${amount} to each player`;
    } else if (action === 'collect_all') {
        const others = players.filter(p => p.id !== player.id);
        const total = amount * others.length;
        others.forEach(o => o.balance -= amount);
        player.balance += total;
        logMsg = `${player.name} drew "${text}" and collected ₹${amount} from each player`;
    } else if (action === 'repairs') {
        const ownedProps = properties.filter(p => p.owner === player.name);
        let totalHouses = 0;
        let totalHotels = 0;
        ownedProps.forEach(p => {
            if (p.houseCount === 5) totalHotels += 1;
            else totalHouses += (p.houseCount || 0);
        });
        const fee = (totalHouses * currentDrawnCard.houseFee) + (totalHotels * currentDrawnCard.hotelFee);
        player.balance -= fee;
        logMsg = `${player.name} paid ₹${fee} for street/general repairs (${totalHouses} houses, ${totalHotels} hotels)`;
    } else {
        logMsg = `${player.name} drew: "${text}"`;
    }

    Swal.fire({ title: 'Card Action Executed', text: logMsg, icon: 'info' });
    addTransaction(logMsg);
    cancelCardModal();
    updatePlayersDisplay();
    saveData();
}

// -------------------------------------------------------------------------
// TRANSACTION LOGGING & HISTORY
// -------------------------------------------------------------------------
function appendTransactionToHistoryUI(text) {
    const historyList = document.getElementById("History");
    if (!historyList) return;

    const li = document.createElement("li");
    li.className = "transaction-item";
    li.innerHTML = `
        <span class="transaction-text">${text}</span>
        <span class="transaction-date" style="font-size: 0.8rem; color: #718096; margin-left: 10px;">${new Date().toLocaleTimeString()}</span>
    `;

    // Remove empty placeholder
    const firstLi = historyList.querySelector('li');
    if (firstLi && firstLi.textContent.includes('No transactions')) {
        historyList.innerHTML = '';
    }

    historyList.insertBefore(li, historyList.firstChild);
}

async function fetchTransactions() {
    const token = localStorage.getItem('token');
    const historyList = document.getElementById("History");
    if (!historyList) return;

    if (!token) {
        historyList.innerHTML = "<li>Login to sync cloud transaction history (Local transactions still show above)</li>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return;

        const transactions = await response.json();
        historyList.innerHTML = "";

        if (!transactions || transactions.length === 0) {
            historyList.innerHTML = "<li>No transactions logged yet.</li>";
            return;
        }

        transactions.forEach(t => {
            const li = document.createElement("li");
            li.className = "transaction-item";
            li.innerHTML = `
                <span class="transaction-text">${t.history}</span>
                <span class="transaction-date" style="font-size: 0.8rem; color: #718096; margin-left: 10px;">${new Date(t.createdAt).toLocaleTimeString()}</span>
            `;
            historyList.appendChild(li);
        });
    } catch (err) {
        console.error("Error fetching transactions:", err);
    }
}

async function addTransaction(historyText) {
    appendTransactionToHistoryUI(historyText);

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ history: historyText })
        });
    } catch (err) {
        // Silently handle if offline
    }
}

// -------------------------------------------------------------------------
// INITIALIZATION ON DOM READY
// -------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initSocket();

    if (isAuthenticated()) {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        fetchTransactions();
    }
});