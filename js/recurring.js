// ============================================
// RECURRING TRANSACTIONS MODULE (FIXED)
// ============================================

let recurringTransactions = [];

function initRecurring() {
    loadRecurringTransactions();
    renderRecurringList();
    setupRecurringEventListeners();
}

function setupRecurringEventListeners() {
    const addBtn = document.getElementById('add-recurring-btn');
    if (addBtn) {
        addBtn.addEventListener('click', openAddRecurringModal);
    }
}

function loadRecurringTransactions() {
    const saved = localStorage.getItem('finance_tracker_recurring');
    if (saved) {
        try {
            recurringTransactions = JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load recurring transactions:', e);
            recurringTransactions = [];
        }
    }
}

function saveRecurringTransactions() {
    localStorage.setItem('finance_tracker_recurring', JSON.stringify(recurringTransactions));
}

function renderRecurringList() {
    const container = document.getElementById('recurring-list');
    if (!container) return;
    
    if (recurringTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔄</div>
                <h3>No Recurring Transactions</h3>
                <p>Add subscriptions, bills, or regular income here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recurringTransactions
        .map(item => createRecurringItemHTML(item))
        .join('');
}

function createRecurringItemHTML(item) {
    return `
        <div class="recurring-item" data-id="${item.id}">
            <div class="recurring-info">
                <div class="recurring-category">${getCategoryIcon(item.category)}</div>
                <div class="recurring-details">
                    <div class="recurring-name">${item.name}</div>
                    <div class="recurring-frequency">${item.frequency}</div>
                </div>
            </div>
            <div class="recurring-amount ${item.type}">
                ${item.type === 'income' ? '+' : '-'}₹${item.amount}
            </div>
            <div class="recurring-actions">
                <button onclick="toggleRecurring('${item.id}')" class="btn-icon" title="Toggle Active">
                    ${item.isActive ? '✓' : '○'}
                </button>
                <button onclick="deleteRecurring('${item.id}')" class="btn-icon" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function openAddRecurringModal() {
    // Implementation for modal
    alert('Add recurring transaction modal - to be implemented');
}

function toggleRecurring(id) {
    const item = recurringTransactions.find(t => t.id === id);
    if (item) {
        item.isActive = !item.isActive;
        saveRecurringTransactions();
        renderRecurringList();
    }
}

function deleteRecurring(id) {
    if (confirm('Delete this recurring transaction?')) {
        recurringTransactions = recurringTransactions.filter(t => t.id !== id);
        saveRecurringTransactions();
        renderRecurringList();
    }
}

// Export functions to global scope
if (typeof globalThis !== 'undefined') {
    globalThis.initRecurring = initRecurring;
    globalThis.toggleRecurring = toggleRecurring;
    globalThis.deleteRecurring = deleteRecurring;
}

console.log('✅ Recurring module loaded');
