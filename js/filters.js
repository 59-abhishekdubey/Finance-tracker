// ========== ADVANCED TRANSACTION FILTERING ==========

let currentFilters = {
    category: 'all',
    dateRange: 'all', // all, today, week, month, custom
    minAmount: null,
    maxAmount: null,
    searchTerm: ''
};

// Apply all active filters
function applyFilters(transactions) {
    let filtered = [...transactions];
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(t => t.category === currentFilters.category);
    }
    
    // Date range filter
    const now = new Date();
    switch(currentFilters.dateRange) {
        case 'today':
            filtered = filtered.filter(t => t.date === getToday());
            break;
        case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
            break;
        case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
            break;
    }
    
    // Amount range filter
    if (currentFilters.minAmount !== null) {
        filtered = filtered.filter(t => t.amount >= currentFilters.minAmount);
    }
    if (currentFilters.maxAmount !== null) {
        filtered = filtered.filter(t => t.amount <= currentFilters.maxAmount);
    }
    
    // Search term filter
    if (currentFilters.searchTerm) {
        const search = currentFilters.searchTerm.toLowerCase();
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(search) ||
            t.category.toLowerCase().includes(search)
        );
    }
    
    return filtered;
}

// Create advanced filter panel
function createFilterPanel() {
    const panel = document.createElement('div');
    panel.className = 'filter-panel';
    
    panel.innerHTML = `
        <div class="filter-panel-header">
            <h3>🔍 Filter Transactions</h3>
            <button class="btn btn-ghost btn-small" onclick="resetFilters()">Reset All</button>
        </div>
        
        <div class="filter-grid">
            <!-- Category Filter -->
            <div class="filter-group">
                <label class="filter-label">Category</label>
                <select id="filter-category" class="filter-select" onchange="updateFilter('category', this.value)">
                    <option value="all">All Categories</option>
                    <option value="food">🍔 Food</option>
                    <option value="transport">🚗 Transport</option>
                    <option value="shopping">🛍️ Shopping</option>
                    <option value="bills">💡 Bills</option>
                    <option value="entertainment">🎮 Entertainment</option>
                    <option value="savings">💰 Savings</option>
                    <option value="other">📦 Other</option>
                </select>
            </div>
            
            <!-- Date Range Filter -->
            <div class="filter-group">
                <label class="filter-label">Date Range</label>
                <select id="filter-date" class="filter-select" onchange="updateFilter('dateRange', this.value)">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                </select>
            </div>
            
            <!-- Amount Range -->
            <div class="filter-group">
                <label class="filter-label">Min Amount</label>
                <input type="number" id="filter-min" class="filter-input" placeholder="₹0" onchange="updateFilter('minAmount', parseFloat(this.value) || null)">
            </div>
            
            <div class="filter-group">
                <label class="filter-label">Max Amount</label>
                <input type="number" id="filter-max" class="filter-input" placeholder="No limit" onchange="updateFilter('maxAmount', parseFloat(this.value) || null)">
            </div>
            
            <!-- Search -->
            <div class="filter-group filter-group-wide">
                <label class="filter-label">Search</label>
                <input type="text" id="filter-search" class="filter-input" placeholder="Search transaction name..." oninput="updateFilter('searchTerm', this.value)">
            </div>
        </div>
        
        <div class="filter-results" id="filter-results-count"></div>
    `;
    
    return panel;
}

// Update a specific filter
function updateFilter(filterKey, value) {
    currentFilters[filterKey] = value;
    applyAndDisplayFilters();
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        category: 'all',
        dateRange: 'all',
        minAmount: null,
        maxAmount: null,
        searchTerm: ''
    };
    
    // Reset UI inputs
    const categoryInput = document.getElementById('filter-category');
    const dateInput = document.getElementById('filter-date');
    const minInput = document.getElementById('filter-min');
    const maxInput = document.getElementById('filter-max');
    const searchInput = document.getElementById('filter-search');
    
    if (categoryInput) categoryInput.value = 'all';
    if (dateInput) dateInput.value = 'all';
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';
    if (searchInput) searchInput.value = '';
    
    applyAndDisplayFilters();
}

// Apply filters and update display
function applyAndDisplayFilters() {
    const transactions = getTransactions();
    const filtered = applyFilters(transactions);
    
    // Update results count
    const resultsCount = document.getElementById('filter-results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filtered.length} of ${transactions.length} transactions`;
    }
    
    // Update transaction list
    const listContainer = document.getElementById('filtered-transaction-list');
    if (listContainer) {
        listContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions match your filters</p>';
        } else {
            filtered.forEach(transaction => {
                listContainer.appendChild(createTransactionItem(transaction, true));
            });
        }
    }
}
