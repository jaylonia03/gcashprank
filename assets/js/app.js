// Banks data
const banks = [
    {
        id: 'gcash',
        name: 'GCash',
        description: 'Mobile wallet and cashless payments',
        icon: 'assets/images/gcash.png'
    },
    {
        id: 'maya',
        name: 'Maya',
        description: 'Digital bank and wallet',
        icon: 'assets/images/maya.png'
    },
    {
        id: 'atome',
        name: 'Atome',
        description: 'Buy now, pay later service',
        icon: 'assets/images/atome.png'
    },
    {
        id: 'gotyme',
        name: 'GoTyme',
        description: 'Digital banking by Robinsons Bank',
        icon: 'assets/images/gotyme.png'
    },
    {
        id: 'cimb',
        name: 'CIMB Bank',
        description: 'Digital bank with high interest savings',
        icon: 'assets/images/cimb.png'
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'International online payments',
        icon: 'assets/images/paypal.png'
    },
    {
        id: 'seabank',
        name: 'SeaBank',
        description: 'Digital bank by Sea Limited',
        icon: 'assets/images/seabank.png'
    },
    {
        id: 'unionbank',
        name: 'UnionBank',
        description: 'Philippine digital bank',
        icon: 'assets/images/unionbank.png'
    },
    {
        id: 'cebuana',
        name: 'Cebuana e-savings',
        description: 'Micro savings from Cebuana Lhuillier',
        icon: 'assets/images/cebuana.png'
    },
    {
        id: 'wise',
        name: 'Wise',
        description: 'International money transfers',
        icon: 'assets/images/wise.png'
    }
];

// DOM elements
const banksGrid = document.getElementById('banksGrid');
const widgetPreview = document.getElementById('widgetPreview');
const widgetDisplay = document.getElementById('widgetDisplay');
const installBtn = document.getElementById('installBtn');
const saveWidgetBtn = document.getElementById('saveWidget');
const increaseSizeBtn = document.getElementById('increaseSize');
const decreaseSizeBtn = document.getElementById('decreaseSize');
const widgetContainer = document.getElementById('widgetContainer');

// Current selected bank
let selectedBank = null;
let widgetSize = 1;

// Initialize the app
function init() {
    renderBanks();
    setupEventListeners();
    registerServiceWorker();
    checkInstallPrompt();
}

// Render bank cards
function renderBanks() {
    banksGrid.innerHTML = '';
    
    banks.forEach(bank => {
        const bankCard = document.createElement('div');
        bankCard.className = 'bank-card';
        bankCard.dataset.id = bank.id;
        
        bankCard.innerHTML = `
            <img src="${bank.icon}" alt="${bank.name}" class="bank-img">
            <div class="bank-info">
                <h3 class="bank-name">${bank.name}</h3>
                <p class="bank-desc">${bank.description}</p>
                <button class="select-btn" data-id="${bank.id}">Select</button>
            </div>
        `;
        
        banksGrid.appendChild(bankCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Bank selection
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-btn')) {
            const bankId = e.target.dataset.id;
            selectBank(bankId);
        }
    });
    
    // Widget size controls
    increaseSizeBtn.addEventListener('click', () => {
        if (widgetSize < 1.5) {
            widgetSize += 0.1;
            updateWidgetSize();
        }
    });
    
    decreaseSizeBtn.addEventListener('click', () => {
        if (widgetSize > 0.7) {
            widgetSize -= 0.1;
            updateWidgetSize();
        }
    });
    
    // Save widget
    saveWidgetBtn.addEventListener('click', saveWidgetToHomeScreen);
}

// Select a bank
function selectBank(bankId) {
    selectedBank = banks.find(bank => bank.id === bankId);
    
    // Update UI
    document.querySelectorAll('.bank-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.id === bankId) {
            card.classList.add('selected');
        }
    });
    
    // Show widget preview
    widgetPreview.classList.add('active');
    
    // Render widget preview
    renderWidgetPreview();
}

// Render widget preview
function renderWidgetPreview() {
    if (!selectedBank) return;
    
    widgetDisplay.innerHTML = `
        <div class="widget-header">
            <img src="${selectedBank.icon}" alt="${selectedBank.name}" class="widget-bank-icon">
            <h3 class="widget-bank-name">${selectedBank.name}</h3>
        </div>
        <div class="balance" id="balance">₱0.00</div>
        <div class="transactions" id="transactions">
            <div class="transaction">
                <span class="transaction-desc">No transactions yet</span>
                <span class="transaction-amount"></span>
            </div>
        </div>
    `;
    
    // Initialize widget functionality
    initWidget();
}

// Update widget size
function updateWidgetSize() {
    widgetContainer.style.transform = `scale(${widgetSize})`;
}

// Register service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// Check for install prompt
function checkInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });
    
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install prompt');
                } else {
                    console.log('User dismissed install prompt');
                }
                deferredPrompt = null;
                installBtn.classList.add('hidden');
            });
        }
    });
}

// Save widget to home screen
function saveWidgetToHomeScreen() {
    if (!selectedBank) return;
    
    // Save widget data to localStorage
    const widgetData = {
        bankId: selectedBank.id,
        transactions: getTransactions(),
        size: widgetSize
    };
    
    localStorage.setItem('bankWidgetData', JSON.stringify(widgetData));
    
    // Show installation instructions
    alert('To add this widget to your home screen:\n\n1. Tap the share button in your browser\n2. Select "Add to Home Screen"\n\nOn iPhone: Use Safari browser\nOn Android: Use Chrome browser');
}

// Initialize the app
init();
