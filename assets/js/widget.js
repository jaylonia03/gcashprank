// Widget functionality
function initWidget() {
    const balanceElement = document.getElementById('balance');
    const transactionsElement = document.getElementById('transactions');
    const addFundsBtn = document.getElementById('addFunds');
    const deductFundsBtn = document.getElementById('deductFunds');
    const transactionAmount = document.getElementById('transactionAmount');
    const transactionDesc = document.getElementById('transactionDesc');
    const transactionsList = document.getElementById('transactionsList');
    
    let transactions = [];
    
    // Load transactions from localStorage if available
    const savedData = localStorage.getItem('bankWidgetData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.bankId === selectedBank.id) {
            transactions = data.transactions || [];
        }
    }
    
    // Update UI
    updateBalance();
    renderTransactions();
    renderTransactionsList();
    
    // Event listeners
    addFundsBtn.addEventListener('click', () => {
        addTransaction(true);
    });
    
    deductFundsBtn.addEventListener('click', () => {
        addTransaction(false);
    });
    
    // Add transaction
    function addTransaction(isIncome) {
        const amount = parseFloat(transactionAmount.value);
        const description = transactionDesc.value.trim();
        
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (!description) {
            alert('Please enter a description');
            return;
        }
        
        const transaction = {
            id: Date.now(),
            amount: isIncome ? amount : -amount,
            description,
            date: new Date().toLocaleString(),
            type: isIncome ? 'income' : 'expense'
        };
        
        transactions.unshift(transaction);
        updateBalance();
        renderTransactions();
        renderTransactionsList();
        
        // Clear inputs
        transactionAmount.value = '';
        transactionDesc.value = '';
        
        // Save to localStorage
        saveWidgetData();
    }
    
    // Update balance
    function updateBalance() {
        const balance = transactions.reduce((total, t) => total + t.amount, 0);
        balanceElement.textContent = `₱${balance.toFixed(2)}`;
    }
    
    // Render recent transactions in widget
    function renderTransactions() {
        if (transactions.length === 0) {
            transactionsElement.innerHTML = `
                <div class="transaction">
                    <span class="transaction-desc">No transactions yet</span>
                    <span class="transaction-amount"></span>
                </div>
            `;
            return;
        }
        
        const recentTransactions = transactions.slice(0, 3);
        transactionsElement.innerHTML = '';
        
        recentTransactions.forEach(t => {
            const transactionEl = document.createElement('div');
            transactionEl.className = 'transaction';
            
            transactionEl.innerHTML = `
                <span class="transaction-desc">${t.description}</span>
                <span class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}₱${Math.abs(t.amount).toFixed(2)}
                </span>
                <span class="transaction-date">${t.date}</span>
            `;
            
            transactionsElement.appendChild(transactionEl);
        });
    }
    
    // Render full transactions list
    function renderTransactionsList() {
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p>No transactions yet</p>';
            return;
        }
        
        transactionsList.innerHTML = '';
        
        transactions.forEach(t => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            transactionItem.innerHTML = `
                <div>
                    <div class="transaction-desc">${t.description}</div>
                    <div class="transaction-date">${t.date}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}₱${Math.abs(t.amount).toFixed(2)}
                </div>
                <button class="undo-btn" data-id="${t.id}">
                    <i class="fas fa-undo"></i>
                </button>
            `;
            
            transactionsList.appendChild(transactionItem);
        });
        
        // Add undo event listeners
        document.querySelectorAll('.undo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                undoTransaction(id);
            });
        });
    }
    
    // Undo transaction
    function undoTransaction(id) {
        transactions = transactions.filter(t => t.id !== id);
        updateBalance();
        renderTransactions();
        renderTransactionsList();
        saveWidgetData();
    }
    
    // Get current transactions
    function getTransactions() {
        return transactions;
    }
    
    // Save widget data
    function saveWidgetData() {
        const widgetData = {
            bankId: selectedBank.id,
            transactions: transactions,
            size: widgetSize
        };
        
        localStorage.setItem('bankWidgetData', JSON.stringify(widgetData));
    }
}
