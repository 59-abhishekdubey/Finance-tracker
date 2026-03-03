// ========== APP STATE ==========
let currentScreen = 'home';
let currentModal = null;

// ========== INITIALIZATION ==========
function initApp() {
    console.log('Finance Tracker initialized');
    
    // Render initial screen
    renderScreen('home');
    
    // Add bottom navigation
    updateBottomNav();
}

// ========== SCREEN MANAGEMENT ==========
function switchScreen(screenId) {
    currentScreen = screenId;
    renderScreen(screenId);
    updateBottomNav();
}

function renderScreen(screenId) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'animate-fadeIn';
    
    let screenContent;
    
    switch(screenId) {
        case 'home':
            screenContent = renderDashboard();
            break;
        case 'stats':
            screenContent = renderStatsScreen();
            break;
        case 'ai':
            screenContent = renderAIScreen();
            break;
        default:
            screenContent = renderDashboard();
    }
    
    app.appendChild(screenContent);
}

function updateBottomNav() {
    // Remove old nav if exists
    const oldNav = document.querySelector('.bottom-nav');
    if (oldNav) {
        oldNav.remove();
    }
    
    // Add new nav
    const nav = createBottomNav(currentScreen);
    document.body.appendChild(nav);
}

// ========== DASHBOARD SCREEN ==========
function renderDashboard() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page title
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.innerHTML = '🪙 Finance Tracker';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    const now = new Date();
    subtitle.textContent = now.toLocaleDateString('en-IN', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Today's spending stat
    const transactions = getTransactions();
    const todaySpending = getTodaySpending(transactions);
    const dailyBudget = getBudget().total / 30;
    const todayPercentage = calculatePercentage(todaySpending, dailyBudget);
    
    const todayStat = createStatLarge(
        formatCurrency(todaySpending),
        "Today's Spending",
        `${todayPercentage}% of daily budget`
    );
    container.appendChild(todayStat);
    
    // Spacing
    const spacer1 = document.createElement('div');
    spacer1.style.height = 'var(--space-xl)';
    container.appendChild(spacer1);
    
    // Budget breakdown card
    const budgetCard = createBudgetCard();
    container.appendChild(budgetCard);
    
    // Spacing
    const spacer2 = document.createElement('div');
    spacer2.style.height = 'var(--space-xl)';
    container.appendChild(spacer2);
    
    // Quick actions
    const actionsGrid = document.createElement('div');
    actionsGrid.style.display = 'grid';
    actionsGrid.style.gridTemplateColumns = '1fr 1fr';
    actionsGrid.style.gap = 'var(--space-md)';
    actionsGrid.style.marginBottom = 'var(--space-xl)';
    
    const addExpenseBtn = createButton(
        'Add Expense',
        showAddExpenseModal,
        'primary',
        'large',
        getIcon('add')
    );
    addExpenseBtn.style.width = '100%';
    
    const aiChatBtn = createButton(
        'AI Advisor',
        () => switchScreen('ai'),
        'secondary',
        'large',
        getIcon('chat')
    );
    aiChatBtn.style.width = '100%';
    
    actionsGrid.appendChild(addExpenseBtn);
    actionsGrid.appendChild(aiChatBtn);
    container.appendChild(actionsGrid);
    
    // Recent transactions
    const recentHeader = document.createElement('h2');
    recentHeader.textContent = 'Recent Transactions';
    recentHeader.style.marginBottom = 'var(--space-lg)';
    container.appendChild(recentHeader);
    
    const transactionList = document.createElement('div');
    transactionList.className = 'transaction-list';
    
    const recentTransactions = transactions.slice(0, 5);
    
    if (recentTransactions.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'text-secondary';
        emptyState.textContent = 'No transactions yet. Add your first expense!';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = 'var(--space-xl)';
        transactionList.appendChild(emptyState);
    } else {
        recentTransactions.forEach(transaction => {
            const item = createTransactionItem(transaction);
            transactionList.appendChild(item);
        });
    }
    
    container.appendChild(transactionList);
    
    return container;
}

// ========== BUDGET CARD COMPONENT ==========
function createBudgetCard() {
    const transactions = getTransactions();
    const spent = calculateSpent(transactions);
    const budget = getBudget();
    
    const content = document.createElement('div');
    
    const needsBar = createProgressBar(
        'Needs (50%)',
        spent.needs,
        budget.needs,
        'needs'
    );
    
    const wantsBar = createProgressBar(
        'Wants (30%)',
        spent.wants,
        budget.wants,
        'wants'
    );
    
    const savingsBar = createProgressBar(
        'Savings (20%)',
        spent.savings,
        budget.savings,
        'savings'
    );
    
    content.appendChild(needsBar);
    content.appendChild(wantsBar);
    content.appendChild(savingsBar);
    
    return createCard(
        'Budget Breakdown',
        'Based on 50/30/20 rule',
        content
    );
}

// ========== STATS SCREEN ==========
function renderStatsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = 'Statistics';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Your spending insights';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Histogram
    const transactions = getTransactions();
    const dailyData = getSpendingByDay(transactions, 7);
    const histogram = createHistogram(dailyData);
    container.appendChild(histogram);
    
    // Spacing
    const spacer = document.createElement('div');
    spacer.style.height = 'var(--space-xl)';
    container.appendChild(spacer);
    
    // Weekly total card
    const weeklyTotal = dailyData.reduce((sum, day) => sum + day.amount, 0);
    const weeklyAverage = Math.round(weeklyTotal / 7);
    
    const weeklyCard = createCard(
        'Weekly Summary',
        'Last 7 days',
        null
    );
    
    const summaryGrid = document.createElement('div');
    summaryGrid.style.display = 'grid';
    summaryGrid.style.gridTemplateColumns = '1fr 1fr';
    summaryGrid.style.gap = 'var(--space-lg)';
    
    const totalDiv = document.createElement('div');
    const totalLabel = document.createElement('div');
    totalLabel.className = 'text-secondary';
    totalLabel.style.fontSize = 'var(--font-size-sm)';
    totalLabel.style.marginBottom = 'var(--space-xs)';
    totalLabel.textContent = 'Total Spent';
    
    const totalValue = document.createElement('div');
    totalValue.style.fontSize = 'var(--font-size-2xl)';
    totalValue.style.fontWeight = 'var(--font-bold)';
    totalValue.textContent = formatCurrency(weeklyTotal);
    
    totalDiv.appendChild(totalLabel);
    totalDiv.appendChild(totalValue);
    
    const avgDiv = document.createElement('div');
    const avgLabel = document.createElement('div');
    avgLabel.className = 'text-secondary';
    avgLabel.style.fontSize = 'var(--font-size-sm)';
    avgLabel.style.marginBottom = 'var(--space-xs)';
    avgLabel.textContent = 'Daily Average';
    
    const avgValue = document.createElement('div');
    avgValue.style.fontSize = 'var(--font-size-2xl)';
    avgValue.style.fontWeight = 'var(--font-bold)';
    avgValue.textContent = formatCurrency(weeklyAverage);
    
    avgDiv.appendChild(avgLabel);
    avgDiv.appendChild(avgValue);
    
    summaryGrid.appendChild(totalDiv);
    summaryGrid.appendChild(avgDiv);
    
    weeklyCard.appendChild(summaryGrid);
    container.appendChild(weeklyCard);
    
    // Spacing
    const spacer2 = document.createElement('div');
    spacer2.style.height = 'var(--space-xl)';
    container.appendChild(spacer2);
    
    // All transactions
    const allTransactionsHeader = document.createElement('h2');
    allTransactionsHeader.textContent = 'All Transactions';
    allTransactionsHeader.style.marginBottom = 'var(--space-lg)';
    container.appendChild(allTransactionsHeader);
    
    const transactionList = document.createElement('div');
    transactionList.className = 'transaction-list';
    
    if (transactions.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'text-secondary';
        emptyState.textContent = 'No transactions yet.';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = 'var(--space-xl)';
        transactionList.appendChild(emptyState);
    } else {
        transactions.forEach(transaction => {
            const item = createTransactionItem(transaction);
            transactionList.appendChild(item);
        });
    }
    
    container.appendChild(transactionList);
    
    return container;
}

// ========== AI CHAT SCREEN ==========
function renderAIScreen() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100vh';
    container.style.paddingBottom = '80px'; // Space for bottom nav
    
    // Header
    const header = document.createElement('div');
    header.style.padding = 'var(--space-xl)';
    header.style.borderBottom = '1px solid var(--color-border)';
    header.style.backgroundColor = 'var(--color-surface)';
    
    const title = document.createElement('h1');
    title.textContent = '💬 AI Finance Advisor';
    title.style.marginBottom = 'var(--space-xs)';
    title.style.fontSize = 'var(--font-size-2xl)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Ask me anything about your spending';
    subtitle.style.fontSize = 'var(--font-size-sm)';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    
    // Chat messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chat-messages';
    messagesContainer.style.flex = '1';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.padding = 'var(--space-xl)';
    messagesContainer.style.display = 'flex';
    messagesContainer.style.flexDirection = 'column';
    messagesContainer.style.gap = 'var(--space-md)';
    
    // Check if there are any messages in storage
    const chatHistory = localStorage.getItem('chat_history');
    const messages = chatHistory ? JSON.parse(chatHistory) : [];
    
    if (messages.length === 0) {
        // Show welcome message and suggestions
        const welcomeDiv = document.createElement('div');
        welcomeDiv.style.textAlign = 'center';
        welcomeDiv.style.padding = 'var(--space-2xl) 0';
        
        const welcomeText = document.createElement('p');
        welcomeText.className = 'text-secondary';
        welcomeText.textContent = 'Try asking me:';
        welcomeText.style.marginBottom = 'var(--space-lg)';
        welcomeText.style.fontSize = 'var(--font-size-sm)';
        
        welcomeDiv.appendChild(welcomeText);
        
        // Suggested questions
        SUGGESTED_QUESTIONS.forEach(question => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.className = 'btn btn-secondary';
            suggestionBtn.style.width = '100%';
            suggestionBtn.style.marginBottom = 'var(--space-sm)';
            suggestionBtn.style.textAlign = 'left';
            suggestionBtn.style.justifyContent = 'flex-start';
            suggestionBtn.textContent = `"${question}"`;
            suggestionBtn.onclick = () => sendChatMessage(question);
            welcomeDiv.appendChild(suggestionBtn);
        });
        
        messagesContainer.appendChild(welcomeDiv);
    } else {
        // Show existing messages
        messages.forEach(msg => {
            messagesContainer.appendChild(createChatBubble(msg.role, msg.content));
        });
    }
    
    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.style.padding = 'var(--space-lg)';
    inputContainer.style.borderTop = '1px solid var(--color-border)';
    inputContainer.style.backgroundColor = 'var(--color-surface)';
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = 'var(--space-md)';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'chat-input';
    input.className = 'input';
    input.placeholder = 'Ask about your finances...';
    input.style.flex = '1';
    input.style.marginBottom = '0';
    
    const sendBtn = createButton('Send', () => {
        const message = input.value.trim();
        if (message) {
            sendChatMessage(message);
            input.value = '';
        }
    }, 'primary');
    
    // Send on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = input.value.trim();
            if (message) {
                sendChatMessage(message);
                input.value = '';
            }
        }
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendBtn);
    
    // Assemble
    container.appendChild(header);
    container.appendChild(messagesContainer);
    container.appendChild(inputContainer);
    
    return container;
}

// Create chat bubble
function createChatBubble(role, content) {
    const bubble = document.createElement('div');
    bubble.style.display = 'flex';
    bubble.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';
    bubble.className = 'animate-fadeIn';
    
    const messageBox = document.createElement('div');
    messageBox.style.maxWidth = '80%';
    messageBox.style.padding = 'var(--space-md) var(--space-lg)';
    messageBox.style.borderRadius = 'var(--radius-lg)';
    messageBox.style.fontSize = 'var(--font-size-base)';
    messageBox.style.lineHeight = '1.5';
    
    if (role === 'user') {
        messageBox.style.backgroundColor = 'var(--color-primary)';
        messageBox.style.color = 'white';
    } else {
        messageBox.style.backgroundColor = 'var(--color-surface)';
        messageBox.style.border = '1px solid var(--color-border)';
        messageBox.style.color = 'var(--color-text-primary)';
    }
    
    messageBox.textContent = content;
    bubble.appendChild(messageBox);
    
    return bubble;
}

// Send message function
function sendChatMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    
    // Clear suggestions if they exist
    const suggestions = messagesContainer.querySelector('div[style*="text-align: center"]');
    if (suggestions) {
        messagesContainer.innerHTML = '';
    }
    
    // Add user message
    messagesContainer.appendChild(createChatBubble('user', message));
    
    // Get AI response
    const transactions = getTransactions();
    const budget = getBudget();
    const aiResponse = getAIResponse(message, transactions, budget);
    
    // Add AI response after short delay
    setTimeout(() => {
        messagesContainer.appendChild(createChatBubble('ai', aiResponse));
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
    
    // Save to chat history
    const chatHistory = localStorage.getItem('chat_history');
    const messages = chatHistory ? JSON.parse(chatHistory) : [];
    messages.push({ role: 'user', content: message });
    messages.push({ role: 'ai', content: aiResponse });
    localStorage.setItem('chat_history', JSON.stringify(messages));
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// ========== ADD EXPENSE MODAL ==========
function showAddExpenseModal() {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = 'var(--space-lg)';
    
    // Amount input
    const amountGroup = document.createElement('div');
    amountGroup.className = 'input-group';
    amountGroup.style.marginBottom = '0';
    
    const amountLabel = document.createElement('label');
    amountLabel.className = 'input-label';
    amountLabel.textContent = 'Amount';
    
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'input input-amount';
    amountInput.id = 'expense-amount';
    amountInput.placeholder = '0';
    amountInput.required = true;
    amountInput.step = '0.01';
    amountInput.min = '0';
    
    amountGroup.appendChild(amountLabel);
    amountGroup.appendChild(amountInput);
    
    // Category selector
    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'input-group';
    categoryGroup.style.marginBottom = '0';
    
    const categoryLabel = document.createElement('label');
    categoryLabel.className = 'input-label';
    categoryLabel.textContent = 'Category';
    
    const categoryGrid = document.createElement('div');
    categoryGrid.className = 'category-grid';
    categoryGrid.id = 'category-grid';
    
    const categories = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'savings', 'other'];
    let selectedCategory = 'food';
    
    categories.forEach(cat => {
        const pill = createCategoryPill(
            cat,
            cat === selectedCategory,
            (category) => {
                selectedCategory = category;
                // Update all pills
                categoryGrid.querySelectorAll('.category-pill').forEach(p => {
                    p.classList.remove('active');
                });
                event.target.closest('.category-pill').classList.add('active');
            }
        );
        categoryGrid.appendChild(pill);
    });
    
    categoryGroup.appendChild(categoryLabel);
    categoryGroup.appendChild(categoryGrid);
    
    // Note input
    const noteGroup = document.createElement('div');
    noteGroup.className = 'input-group';
    noteGroup.style.marginBottom = '0';
    
    const noteLabel = document.createElement('label');
    noteLabel.className = 'input-label';
    noteLabel.textContent = 'Note (Optional)';
    
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.className = 'input';
    noteInput.id = 'expense-note';
    noteInput.placeholder = 'What did you buy?';
    
    noteGroup.appendChild(noteLabel);
    noteGroup.appendChild(noteInput);
    
    // Date input
    const dateGroup = document.createElement('div');
    dateGroup.className = 'input-group';
    dateGroup.style.marginBottom = '0';
    
    const dateLabel = document.createElement('label');
    dateLabel.className = 'input-label';
    dateLabel.textContent = 'Date';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'input';
    dateInput.id = 'expense-date';
    dateInput.value = getToday();
    dateInput.required = true;
    
    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);
    
    // Submit button
    const submitBtn = createButton(
        'Add Expense',
        null,
        'primary',
        'large'
    );
    submitBtn.type = 'submit';
    submitBtn.style.width = '100%';
    
    // Assemble form
    form.appendChild(amountGroup);
    form.appendChild(categoryGroup);
    form.appendChild(noteGroup);
    form.appendChild(dateGroup);
    form.appendChild(submitBtn);
    
    // Form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const amount = amountInput.value;
        const note = noteInput.value || selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        const date = dateInput.value;
        
        if (!isValidAmount(amount)) {
            alert('Please enter a valid amount');
            return;
        }
        
        const transaction = {
            name: note,
            amount: amount,
            category: selectedCategory,
            date: date
        };
        
        addTransaction(transaction);
        
        // Close modal and refresh
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        
        // Refresh current screen
        renderScreen(currentScreen);
    };
    
    // Create and show modal
    currentModal = createModal('Add Expense', form, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
    
    // Auto-focus amount input
    setTimeout(() => {
        amountInput.focus();
    }, 100);
}

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    console.log('App ready!');
});