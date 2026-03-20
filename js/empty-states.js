// ========== EMPTY STATES ==========

// Create generic empty state
function createEmptyState(config) {
    const {
        icon = '📭',
        title = 'No data yet',
        description = 'Get started by adding your first item.',
        actions = [],
        suggestions = [],
        compact = false
    } = config;
    
    const container = document.createElement('div');
    container.className = compact ? 'empty-state empty-state-compact' : 'empty-state';
    
    // Icon
    const iconEl = document.createElement('div');
    iconEl.className = 'empty-state-icon';
    iconEl.textContent = icon;
    container.appendChild(iconEl);
    
    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'empty-state-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
    
    // Description
    const descEl = document.createElement('p');
    descEl.className = 'empty-state-description';
    descEl.textContent = description;
    container.appendChild(descEl);
    
    // Actions
    if (actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'empty-state-actions';
        
        actions.forEach(action => {
            const btn = createButton(
                action.label,
                action.onClick,
                action.variant || 'primary',
                action.size || 'large',
                action.icon
            );
            actionsContainer.appendChild(btn);
        });
        
        container.appendChild(actionsContainer);
    }
    
    // Suggestions
    if (suggestions.length > 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'empty-state-suggestions';
        
        const suggestionsTitle = document.createElement('div');
        suggestionsTitle.className = 'empty-state-suggestions-title';
        suggestionsTitle.textContent = 'Try adding:';
        suggestionsContainer.appendChild(suggestionsTitle);
        
        const suggestionList = document.createElement('div');
        suggestionList.className = 'suggestion-list';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.onclick = suggestion.onClick;
            
            item.innerHTML = `
                <span class="suggestion-icon">${suggestion.icon}</span>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    ${suggestion.amount ? `<div class="suggestion-amount">${suggestion.amount}</div>` : ''}
                </div>
            `;
            
            suggestionList.appendChild(item);
        });
        
        suggestionsContainer.appendChild(suggestionList);
        container.appendChild(suggestionsContainer);
    }
    
    return container;
}

// Empty state for no transactions
function createNoTransactionsEmpty() {
    return createEmptyState({
        icon: '💸',
        title: 'No transactions yet',
        description: 'Start tracking your expenses to get insights into your spending habits and reach your financial goals.',
        actions: [
            {
                label: 'Add First Expense',
                onClick: showAddExpenseModal,
                variant: 'primary',
                icon: '+'
            }
        ],
        suggestions: [
            {
                icon: '🍔',
                title: 'Grocery Shopping',
                amount: 'Food · ₹500',
                onClick: () => quickAddExpense('Grocery Shopping', 500, 'food')
            },
            {
                icon: '⛽',
                title: 'Fuel',
                amount: 'Transport · ₹1,000',
                onClick: () => quickAddExpense('Fuel', 1000, 'transport')
            },
            {
                icon: '💡',
                title: 'Electricity Bill',
                amount: 'Bills · ₹800',
                onClick: () => quickAddExpense('Electricity Bill', 800, 'bills')
            }
        ]
    });
}

// Quick add expense from suggestion
function quickAddExpense(name, amount, category) {
    const transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: getToday(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: getCategoryType(category)
    };
    
    addTransaction(transaction);
    
    // Show success toast
    showToast({
        type: 'success',
        title: 'Transaction Added!',
        message: `${name} - ${formatCurrency(amount)}`
    });
    
    // Reload current screen
    renderScreen(activeScreen);
}

// Empty state for no analytics data
function createNoAnalyticsEmpty() {
    return createEmptyState({
        icon: '📊',
        title: 'Not enough data',
        description: 'Track at least 7 days of expenses to see meaningful analytics and insights.',
        compact: true
    });
}

// Empty state for no search results
function createNoResultsEmpty(searchTerm) {
    return createEmptyState({
        icon: '🔍',
        title: 'No results found',
        description: searchTerm ? `No transactions match "${searchTerm}". Try different keywords or filters.` : 'Try adjusting your filters to see more results.',
        actions: [
            {
                label: 'Clear Filters',
                onClick: resetFilters,
                variant: 'secondary'
            }
        ],
        compact: true
    });
}

// Empty state for AI chat
function createAIChatEmpty() {
    return createEmptyState({
        icon: '🤖',
        title: 'AI Financial Advisor',
        description: 'Ask me anything about your spending, budgets, or financial goals. I\'m here to help!',
        suggestions: [
            {
                icon: '💰',
                title: 'How much can I spend today?',
                onClick: () => sendAIMessage('How much can I spend today?')
            },
            {
                icon: '📈',
                title: 'How am I doing this month?',
                onClick: () => sendAIMessage('How am I doing this month?')
            },
            {
                icon: '🎯',
                title: 'Tips to save more money?',
                onClick: () => sendAIMessage('Tips to save more money?')
            }
        ],
        compact: true
    });
}

// Helper function to send AI message (if you have AI chat)
function sendAIMessage(message) {
    const input = document.getElementById('ai-input');
    if (input) {
        input.value = message;
        const form = input.closest('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}

// Error state component
function createErrorState(config) {
    const {
        code = '500',
        title = 'Something went wrong',
        message = 'We encountered an unexpected error. Please try again.',
        actions = []
    } = config;
    
    const container = document.createElement('div');
    container.className = 'error-container';
    
    container.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-code">${code}</div>
        <h2 class="error-title">${title}</h2>
        <p class="error-message">${message}</p>
    `;
    
    if (actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'error-actions';
        
        actions.forEach(action => {
            const btn = createButton(
                action.label,
                action.onClick,
                action.variant || 'primary',
                'large'
            );
            actionsContainer.appendChild(btn);
        });
        
        container.appendChild(actionsContainer);
    }
    
    return container;
}

// 404 Not Found
function create404Error() {
    return createErrorState({
        code: '404',
        title: 'Page Not Found',
        message: 'The page you\'re looking for doesn\'t exist or has been moved.',
        actions: [
            {
                label: 'Go to Dashboard',
                onClick: () => navigateTo('home')
            }
        ]
    });
}

// Network Error
function createNetworkError() {
    return createErrorState({
        code: '🔌',
        title: 'Connection Lost',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        actions: [
            {
                label: 'Retry',
                onClick: () => location.reload()
            }
        ]
    });
}

// ========== TOAST NOTIFICATIONS ==========

let toastTimeout = null;

// Show toast notification
function showToast(config) {
    const {
        type = 'info', // success, error, warning, info
        title = '',
        message = '',
        duration = 4000,
        closeable = true
    } = config;
    
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        ${closeable ? '<button class="toast-close" onclick="closeToast(this)">×</button>' : ''}
    `;
    
    document.body.appendChild(toast);
    
    // Auto close
    if (duration > 0) {
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            closeToast(toast);
        }, duration);
    }
}

// Close toast
function closeToast(element) {
    const toast = element.classList ? element : element.closest('.toast');
    if (!toast) return;
    
    toast.classList.add('closing');
    
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Quick toast helpers
function showSuccessToast(title, message) {
    showToast({ type: 'success', title, message });
}

function showErrorToast(title, message) {
    showToast({ type: 'error', title, message });
}

function showWarningToast(title, message) {
    showToast({ type: 'warning', title, message });
}

function showInfoToast(title, message) {
    showToast({ type: 'info', title, message });
}
