// ========== HEADER FUNCTIONALITY ==========

// Update header user info
function updateHeaderUser() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update avatar
    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) {
        headerAvatar.textContent = user.avatar || '👤';
    }
    
    // Update username
    const headerUsername = document.getElementById('header-username');
    const dropdownUsername = document.getElementById('dropdown-username');
    if (headerUsername) headerUsername.textContent = user.name;
    if (dropdownUsername) dropdownUsername.textContent = user.name;
    
    // Update email
    const headerEmail = document.getElementById('header-email');
    const dropdownEmail = document.getElementById('dropdown-email');
    if (headerEmail) headerEmail.textContent = user.email;
    if (dropdownEmail) dropdownEmail.textContent = user.email;
}

// Update header title based on current screen
function updateHeaderTitle(screenId) {
    const headerTitle = document.getElementById('header-title');
    if (!headerTitle) return;
    
    const titles = {
        home: 'Dashboard',
        stats: 'Statistics',
        analytics: 'Analytics',
        ai: 'AI Financial Advisor',
        settings: 'Settings',
        profile: 'My Profile'
    };
    
    headerTitle.textContent = titles[screenId] || 'Dashboard';
}

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;
    
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

// ========== SEARCH FUNCTIONALITY ==========
let searchTimeout = null;

function initSearch() {
    const searchInput = document.getElementById('header-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        searchTimeout = setTimeout(() => performSearch(query), 250);
    });

    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            performSearch(this.value.trim());
        }
    });

    // Close search on click outside
    document.addEventListener('click', function(e) {
        const wrapper = document.getElementById('header-search-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            hideSearchResults();
        }
    });
}

function performSearch(query) {
    const transactions = getTransactions();
    const lowerQuery = query.toLowerCase();
    const results = transactions.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        formatCurrency(t.amount).includes(query)
    ).slice(0, 8);

    showSearchResults(results, query);
}

function showSearchResults(results, query) {
    const container = document.getElementById('search-results');
    if (!container) return;
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div class="search-empty">No transactions found for "' + escapeHtml(query) + '"</div>';
    } else {
        results.forEach(t => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = '<span class="search-result-icon">' + getIcon(t.category) + '</span>' +
                '<div class="search-result-info">' +
                    '<div class="search-result-name">' + escapeHtml(t.name) + '</div>' +
                    '<div class="search-result-meta">' + t.category + ' • ' + formatDateRelative(t.date) + '</div>' +
                '</div>' +
                '<div class="search-result-amount">' + formatCurrency(t.amount) + '</div>';
            container.appendChild(item);
        });
    }

    container.classList.add('show');
}

function hideSearchResults() {
    const container = document.getElementById('search-results');
    if (container) container.classList.remove('show');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========== NOTIFICATION FUNCTIONALITY ==========
let notifications = [];

function initNotifications() {
    generateNotifications();
    renderNotifications();
    updateNotificationBadge();
}

function generateNotifications() {
    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);
    notifications = [];

    // Budget warnings
    const totalPercent = (spent.total / budget.total) * 100;
    if (totalPercent >= 90) {
        notifications.push({
            id: 'budget-critical',
            icon: '🚨',
            title: 'Budget Almost Exhausted!',
            message: 'You\'ve used ' + Math.round(totalPercent) + '% of your monthly budget.',
            time: 'Now',
            type: 'danger'
        });
    } else if (totalPercent >= 70) {
        notifications.push({
            id: 'budget-warning',
            icon: '⚠️',
            title: 'Budget Warning',
            message: 'You\'ve used ' + Math.round(totalPercent) + '% of your monthly budget.',
            time: 'Now',
            type: 'warning'
        });
    }

    // Category overspending
    if (spent.wants > budget.wants) {
        notifications.push({
            id: 'wants-over',
            icon: '🛍️',
            title: 'Wants Budget Exceeded',
            message: 'You\'ve overspent on wants by ' + formatCurrency(spent.wants - budget.wants) + '.',
            time: 'Today',
            type: 'danger'
        });
    }
    if (spent.needs > budget.needs) {
        notifications.push({
            id: 'needs-over',
            icon: '💡',
            title: 'Needs Budget Exceeded',
            message: 'You\'ve overspent on needs by ' + formatCurrency(spent.needs - budget.needs) + '.',
            time: 'Today',
            type: 'danger'
        });
    }

    // Today's spending
    const todaySpending = getTodaySpending(transactions);
    const dailyBudget = budget.total / 30;
    if (todaySpending > dailyBudget) {
        notifications.push({
            id: 'daily-over',
            icon: '📊',
            title: 'Daily Limit Exceeded',
            message: 'Today\'s spending (' + formatCurrency(todaySpending) + ') exceeds your daily budget of ' + formatCurrency(Math.round(dailyBudget)) + '.',
            time: 'Today',
            type: 'warning'
        });
    }

    // Recent large transaction
    if (transactions.length > 0) {
        const latest = transactions[0];
        notifications.push({
            id: 'latest-txn',
            icon: getIcon(latest.category),
            title: 'Latest Transaction',
            message: latest.name + ' - ' + formatCurrency(latest.amount),
            time: formatDateRelative(latest.date),
            type: 'info'
        });
    }

    // Tip
    notifications.push({
        id: 'tip',
        icon: '💡',
        title: 'Savings Tip',
        message: 'Track every small expense — they add up fast!',
        time: '',
        type: 'info'
    });
}

function renderNotifications() {
    const list = document.getElementById('notification-list');
    if (!list) return;
    list.innerHTML = '';

    if (notifications.length === 0) {
        list.innerHTML = '<div class="notification-empty">No notifications</div>';
        return;
    }

    notifications.forEach(n => {
        const item = document.createElement('div');
        item.className = 'notification-item notification-' + n.type;
        item.innerHTML = '<span class="notification-item-icon">' + n.icon + '</span>' +
            '<div class="notification-item-content">' +
                '<div class="notification-item-title">' + n.title + '</div>' +
                '<div class="notification-item-message">' + n.message + '</div>' +
                (n.time ? '<div class="notification-item-time">' + n.time + '</div>' : '') +
            '</div>';
        list.appendChild(item);
    });
}

function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;
    const importantCount = notifications.filter(n => n.type === 'danger' || n.type === 'warning').length;
    badge.style.display = importantCount > 0 ? 'block' : 'none';
}

function toggleNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    if (!panel) return;
    const isOpen = panel.classList.contains('show');
    panel.classList.toggle('show');

    // Close profile dropdown if open
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.remove('open');

    if (!isOpen) {
        generateNotifications();
        renderNotifications();
        updateNotificationBadge();
    }
}

function clearAllNotifications() {
    notifications = [];
    renderNotifications();
    updateNotificationBadge();
}

// Close notification panel on outside click
document.addEventListener('click', function(e) {
    const panel = document.getElementById('notification-panel');
    const btn = document.getElementById('notification-btn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('show');
    }
});

// ========== INIT ==========
function initHeader() {
    if (isLoggedIn()) {
        updateHeaderUser();
        initSearch();
        initNotifications();
    }
}

document.addEventListener('DOMContentLoaded', initHeader);
