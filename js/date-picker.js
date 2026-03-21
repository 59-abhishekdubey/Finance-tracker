// ========== DATE RANGE PICKER ==========

let currentDateRange = {
    startDate: null,
    endDate: null,
    preset: 'all',
    label: 'All Time'
};

let dateRangeCallback = null;

// Create date range picker
function createDateRangePicker(onApply) {
    dateRangeCallback = onApply;
    
    const picker = document.createElement('div');
    picker.className = 'date-range-picker';
    picker.id = 'date-range-picker';
    
    // Trigger button
    const trigger = document.createElement('div');
    trigger.className = 'date-range-trigger';
    trigger.onclick = toggleDateRangePicker;
    
    trigger.innerHTML = `
        <span class="date-range-trigger-icon">📅</span>
        <div class="date-range-trigger-text">
            <span class="date-range-trigger-label">Date Range</span>
            <span class="date-range-trigger-value" id="date-range-value">${currentDateRange.label}</span>
        </div>
        <span style="font-size: 12px; color: var(--color-text-tertiary);">▼</span>
    `;
    
    // Panel
    const panel = document.createElement('div');
    panel.className = 'date-range-panel';
    panel.id = 'date-range-panel';
    
    panel.innerHTML = `
        <div class="date-range-presets">
            <button class="preset-btn active" data-preset="all" onclick="selectPreset('all')">All Time</button>
            <button class="preset-btn" data-preset="today" onclick="selectPreset('today')">Today</button>
            <button class="preset-btn" data-preset="yesterday" onclick="selectPreset('yesterday')">Yesterday</button>
            <button class="preset-btn" data-preset="last7days" onclick="selectPreset('last7days')">Last 7 Days</button>
            <button class="preset-btn" data-preset="last30days" onclick="selectPreset('last30days')">Last 30 Days</button>
            <button class="preset-btn" data-preset="thisMonth" onclick="selectPreset('thisMonth')">This Month</button>
            <button class="preset-btn" data-preset="lastMonth" onclick="selectPreset('lastMonth')">Last Month</button>
            <button class="preset-btn" data-preset="thisYear" onclick="selectPreset('thisYear')">This Year</button>
        </div>
        
        <div class="date-range-custom">
            <div class="date-range-custom-title">Custom Range</div>
            
            <div class="date-input-group">
                <label class="date-input-label">Start Date</label>
                <input type="date" class="date-input" id="custom-start-date">
            </div>
            
            <div class="date-input-group">
                <label class="date-input-label">End Date</label>
                <input type="date" class="date-input" id="custom-end-date">
            </div>
        </div>
        
        <div class="date-range-actions">
            <button class="btn btn-secondary" onclick="closeDateRangePicker()">Cancel</button>
            <button class="btn btn-primary" onclick="applyDateRange()">Apply</button>
        </div>
    `;
    
    picker.appendChild(trigger);
    picker.appendChild(panel);
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const pickerEl = document.getElementById('date-range-picker');
        if (pickerEl && !pickerEl.contains(e.target)) {
            closeDateRangePicker();
        }
    });
    
    return picker;
}

// Toggle date range picker
function toggleDateRangePicker() {
    const panel = document.getElementById('date-range-panel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Close date range picker
function closeDateRangePicker() {
    const panel = document.getElementById('date-range-panel');
    if (panel) {
        panel.classList.remove('show');
    }
}

// Select preset
function selectPreset(preset) {
    // Update active button
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Calculate dates based on preset
    const today = new Date();
    let startDate, endDate, label;
    
    switch(preset) {
        case 'all':
            startDate = null;
            endDate = null;
            label = 'All Time';
            break;
            
        case 'today':
            startDate = getToday();
            endDate = getToday();
            label = 'Today';
            break;
            
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            startDate = yesterday.toISOString().split('T')[0];
            endDate = startDate;
            label = 'Yesterday';
            break;
            
        case 'last7days':
            const last7 = new Date(today);
            last7.setDate(last7.getDate() - 6);
            startDate = last7.toISOString().split('T')[0];
            endDate = getToday();
            label = 'Last 7 Days';
            break;
            
        case 'last30days':
            const last30 = new Date(today);
            last30.setDate(last30.getDate() - 29);
            startDate = last30.toISOString().split('T')[0];
            endDate = getToday();
            label = 'Last 30 Days';
            break;
            
        case 'thisMonth':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            endDate = getToday();
            label = 'This Month';
            break;
            
        case 'lastMonth':
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            startDate = lastMonth.toISOString().split('T')[0];
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            endDate = lastMonthEnd.toISOString().split('T')[0];
            label = 'Last Month';
            break;
            
        case 'thisYear':
            startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
            endDate = getToday();
            label = 'This Year';
            break;
    }
    
    // Update current range
    currentDateRange = { startDate, endDate, preset, label };
    
    // Update custom inputs
    document.getElementById('custom-start-date').value = startDate || '';
    document.getElementById('custom-end-date').value = endDate || '';
}

// Apply date range
function applyDateRange() {
    // Check if custom dates are set
    const customStart = document.getElementById('custom-start-date').value;
    const customEnd = document.getElementById('custom-end-date').value;
    
    if (customStart || customEnd) {
        // Use custom range
        if (!customStart || !customEnd) {
            showErrorToast('Invalid Range', 'Please select both start and end dates');
            return;
        }
        
        if (customStart > customEnd) {
            showErrorToast('Invalid Range', 'Start date must be before end date');
            return;
        }
        
        currentDateRange = {
            startDate: customStart,
            endDate: customEnd,
            preset: 'custom',
            label: `${formatDate(customStart)} - ${formatDate(customEnd)}`
        };
    }
    
    // Update display
    const valueEl = document.getElementById('date-range-value');
    if (valueEl) {
        valueEl.textContent = currentDateRange.label;
    }
    
    // Close panel
    closeDateRangePicker();
    
    // Trigger callback
    if (dateRangeCallback) {
        dateRangeCallback(currentDateRange);
    }
}

// Get current date range
function getCurrentDateRange() {
    return currentDateRange;
}

// Filter transactions by date range
function filterByDateRange(transactions, dateRange = currentDateRange) {
    if (!dateRange.startDate || !dateRange.endDate) {
        return transactions; // All time
    }
    
    return transactions.filter(t => {
        return t.date >= dateRange.startDate && t.date <= dateRange.endDate;
    });
}

// Get date range summary
function getDateRangeSummary(transactions) {
    const filtered = filterByDateRange(transactions);
    
    const totalExpenses = filtered
        .filter(t => t.transactionType !== 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = filtered
        .filter(t => t.transactionType === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = totalIncome - totalExpenses;
    
    const categoryBreakdown = getSpendingByCategory(filtered.filter(t => t.transactionType !== 'income'));
    
    return {
        totalTransactions: filtered.length,
        totalExpenses,
        totalIncome,
        netIncome,
        categoryBreakdown,
        dateRange: currentDateRange
    };
}

// Reset date range
function resetDateRange() {
    selectPreset('all');
    applyDateRange();
}
