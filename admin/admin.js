// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Socket.IO connection
    const socket = io('/', {
        path: '/api/socket'
    });

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const userList = document.getElementById('userList');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const mediaGrid = document.getElementById('mediaGrid');
    const userInfoPanel = document.getElementById('userInfoPanel');

    // State Management
    let currentUser = null;
    let currentChat = null;
    let chats = new Map();
    let mediaFiles = [];

    // Authentication
    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // TODO: Implement proper authentication
        if (username === 'admin' && password === 'admin123') {
            loginForm.style.display = 'none';
            adminDashboard.style.display = 'flex';
            initializeAdmin();
        } else {
            alert('Invalid credentials');
        }
    }

    function handleLogout() {
        loginForm.style.display = 'flex';
        adminDashboard.style.display = 'none';
        socket.disconnect();
    }

    // Admin Panel Initialization
    function initializeAdmin() {
        // Connect to Socket.IO
        socket.connect();
        
        // Socket event listeners
        socket.on('connect', () => {
            console.log('Connected to server as admin');
            socket.emit('admin-connect');
        });

        socket.on('new-user', handleNewUser);
        socket.on('user-disconnected', handleUserDisconnect);
        socket.on('new-message', handleIncomingMessage);
        
        // Load initial data
        loadActiveChats();
        loadMediaFiles();
        loadSettings();
    }

    // Tab Navigation
    function switchTab(tabName) {
        // Remove active class from all sections and nav buttons
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected section and button
        document.getElementById(`${tabName}Section`).classList.add('active');
        document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    }

    // Chat Management
    function loadActiveChats() {
        // TODO: Implement API call to load active chats
        // For now, using dummy data
        const dummyChats = [
            { id: 1, name: 'User 1', status: 'active', lastMessage: 'Hello' },
            { id: 2, name: 'User 2', status: 'waiting', lastMessage: 'Need help' }
        ];
        
        renderUserList(dummyChats);
    }

    function renderUserList(users) {
        userList.innerHTML = users.map(user => `
            <div class="user-item ${user.status}" onclick="selectUser(${user.id})">
                <div class="user-info">
                    <span class="user-name">${user.name}</span>
                    <span class="last-message">${user.lastMessage}</span>
                </div>
                <span class="status-badge ${user.status}"></span>
            </div>
        `).join('');
    }

    function selectUser(userId) {
        currentUser = userId;
        loadUserChat(userId);
        updateChatHeader(userId);
    }

    function loadUserChat(userId) {
        // TODO: Implement API call to load chat history
        chatMessages.innerHTML = ''; // Clear current messages
        if (chats.has(userId)) {
            renderMessages(chats.get(userId));
        }
    }

    function handleIncomingMessage(message) {
        if (!chats.has(message.userId)) {
            chats.set(message.userId, []);
        }
        chats.get(message.userId).push(message);
        
        if (currentUser === message.userId) {
            renderMessage(message);
        }
        
        // Update user list to show new message
        updateUserListItem(message);
    }

    function sendMessage(event) {
        event.preventDefault();
        const input = chatForm.querySelector('input');
        const message = input.value.trim();
        
        if (message && currentUser) {
            socket.emit('admin-reply', {
                userId: currentUser,
                message: message,
                timestamp: new Date()
            });
            
            input.value = '';
        }
    }

    // Media Management
    function loadMediaFiles() {
        // TODO: Implement API call to load media files
        fetch('/api/media')
            .then(response => response.json())
            .then(files => {
                mediaFiles = files;
                renderMediaGrid();
            })
            .catch(error => console.error('Error loading media files:', error));
    }

    function renderMediaGrid() {
        mediaGrid.innerHTML = mediaFiles.map(file => `
            <div class="media-item">
                <img src="${file.url}" alt="${file.name}">
                <div class="media-info">
                    <span>${file.name}</span>
                    <button onclick="deleteMedia('${file.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function handleMediaUpload(event) {
        const files = event.target.files;
        const formData = new FormData();
        
        for (let file of files) {
            formData.append('media', file);
        }
        
        // TODO: Implement API call to upload media
        fetch('/api/media/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            loadMediaFiles(); // Reload media grid
        })
        .catch(error => console.error('Error uploading files:', error));
    }

    // Settings Management
    function loadSettings() {
        // TODO: Implement API call to load settings
        const settings = localStorage.getItem('adminSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            applySettings(parsedSettings);
        }
    }

    function saveSettings() {
        const settings = {
            autoReply: document.getElementById('autoReply').checked,
            autoReplyMessage: document.getElementById('autoReplyMessage').value,
            soundNotification: document.getElementById('soundNotification').checked,
            desktopNotification: document.getElementById('desktopNotification').checked
        };
        
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        alert('Settings saved successfully');
    }

    // User Info Panel
    function showUserInfo() {
        if (currentUser) {
            userInfoPanel.classList.add('active');
            loadUserInfo(currentUser);
        }
    }

    function toggleUserInfo() {
        userInfoPanel.classList.toggle('active');
    }

    function loadUserInfo(userId) {
        // TODO: Implement API call to load user info
        document.getElementById('userId').textContent = userId;
        document.getElementById('chatStartTime').textContent = new Date().toLocaleString();
        document.getElementById('detailedStatus').textContent = 'Active';
    }

    function saveNotes() {
        const notes = document.getElementById('userNotes').value;
        // TODO: Implement API call to save user notes
        alert('Notes saved successfully');
    }

    // Event Listeners
    document.getElementById('chatForm').addEventListener('submit', sendMessage);
    document.getElementById('mediaUpload').addEventListener('change', handleMediaUpload);
    
    // Initialize tooltips, if using a tooltip library
    // initializeTooltips();
});

// Utility Functions
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

function showNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: message });
            }
        });
    }
}
