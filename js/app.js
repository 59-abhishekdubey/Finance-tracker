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
    const landingPage = document.getElementById('landing-page');
    const loginPage = document.getElementById('login-page');
    const registerPage = document.getElementById('register-page');
    
    // Hide all pages first
    if (app) app.style.display = 'none';
    if (landingPage) landingPage.style.display = 'none';
    if (loginPage) loginPage.style.display = 'none';
    if (registerPage) registerPage.style.display = 'none';
    
    // Show appropriate page
    switch(screenId) {
        case 'landing':
            if (landingPage) landingPage.style.display = 'block';
            break;
            
        case 'login':
            if (loginPage) loginPage.style.display = 'block';
            break;
            
        case 'register':
            if (registerPage) registerPage.style.display = 'block';
            break;
            
        case 'home':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderDashboard());
            }
            break;
            
        case 'stats':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderStatsScreen());
            }
            break;
            
        case 'analytics':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderAnalyticsScreen());
            }
            break;
            
        case 'ai':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderAIScreen());
            }
            break;
            
        case 'settings':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderSettingsScreen());
            }
            break;
            
        case 'profile':
            if (app) {
                app.style.display = 'block';
                app.innerHTML = '';
                app.className = 'animate-fadeIn';
                app.appendChild(renderProfileScreen());
            }
            break;
            
        default:
            if (landingPage) landingPage.style.display = 'block';
    }
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

// ========== DASHBOARD SCREEN (MODERN WITH CHARTS) ==========
function renderDashboard() {
    // Create wrapper container
    const wrapper = document.createElement('div');
    
    // Add insights widget at top if there's any
    const insights = createInsightsWidget();
    if (insights) {
        wrapper.appendChild(insights);
    }
    
    // Add modern dashboard
    const dashboardContent = renderModernDashboard();
    wrapper.appendChild(dashboardContent);
    
    // Check for alerts and show if needed
    const alerts = checkBudgetAlerts();
    if (alerts.length > 0) {
        showAlertBanner(alerts[0]);
    }
    
    return wrapper;
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

// ========== EDIT TRANSACTION MODAL ==========
function showEditTransactionModal(transaction) {
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
    amountInput.value = transaction.amount;
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
    
    const categories = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'savings', 'other'];
    let selectedCategory = transaction.category;
    
    categories.forEach(cat => {
        const pill = createCategoryPill(
            cat,
            cat === selectedCategory,
            (category) => {
                selectedCategory = category;
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
    noteLabel.textContent = 'Note';
    
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.className = 'input';
    noteInput.value = transaction.name;
    
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
    dateInput.value = transaction.date;
    dateInput.required = true;
    
    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);
    
    // Submit button
    const submitBtn = createButton(
        'Save Changes',
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
        
        const updates = {
            amount: amountInput.value,
            category: selectedCategory,
            name: noteInput.value,
            date: dateInput.value
        };
        
        updateTransaction(transaction.id, updates);
        
        // Close modal
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        
        // Refresh current screen
        renderScreen(currentScreen);
    };
    
    // Create and show modal
    currentModal = createModal('Edit Transaction', form, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
    
    // Auto-focus amount input
    setTimeout(() => {
        amountInput.focus();
    }, 100);
}

// ========== DELETE CONFIRMATION ==========
function showDeleteConfirmation(transaction) {
    const content = document.createElement('div');
    content.style.textAlign = 'center';
    
    const warning = document.createElement('div');
    warning.textContent = '⚠️';
    warning.style.fontSize = '48px';
    warning.style.marginBottom = 'var(--space-lg)';
    
    const message = document.createElement('p');
    message.textContent = 'Are you sure you want to delete this transaction?';
    message.style.marginBottom = 'var(--space-md)';
    message.style.color = 'var(--color-text-primary)';
    
    const transactionInfo = document.createElement('div');
    transactionInfo.style.padding = 'var(--space-md)';
    transactionInfo.style.backgroundColor = 'var(--color-bg-secondary)';
    transactionInfo.style.borderRadius = 'var(--radius-md)';
    transactionInfo.style.marginBottom = 'var(--space-xl)';
    
    const name = document.createElement('div');
    name.textContent = transaction.name;
    name.style.fontWeight = 'var(--font-semibold)';
    name.style.marginBottom = 'var(--space-xs)';
    
    const amount = document.createElement('div');
    amount.textContent = formatCurrency(transaction.amount);
    amount.style.fontSize = 'var(--font-size-xl)';
    amount.style.color = 'var(--color-danger)';
    
    transactionInfo.appendChild(name);
    transactionInfo.appendChild(amount);
    
    const disclaimer = document.createElement('p');
    disclaimer.textContent = 'This action cannot be undone.';
    disclaimer.style.fontSize = 'var(--font-size-sm)';
    disclaimer.style.color = 'var(--color-text-tertiary)';
    disclaimer.style.marginBottom = 'var(--space-lg)';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'grid';
    buttonContainer.style.gridTemplateColumns = '1fr 1fr';
    buttonContainer.style.gap = 'var(--space-md)';
    
    const cancelBtn = createButton('Cancel', () => {
        currentModal.remove();
        currentModal = null;
    }, 'secondary', 'large');
    
    const deleteBtn = createButton('Delete', () => {
        deleteTransaction(transaction.id);
        currentModal.remove();
        currentModal = null;
        renderScreen(currentScreen);
    }, 'primary', 'large');
    deleteBtn.style.backgroundColor = 'var(--color-danger)';
    deleteBtn.style.borderColor = 'var(--color-danger)';
    
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(deleteBtn);
    
    content.appendChild(warning);
    content.appendChild(message);
    content.appendChild(transactionInfo);
    content.appendChild(disclaimer);
    content.appendChild(buttonContainer);
    
    currentModal = createModal('Delete Transaction', content, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
}

// ========== SETTINGS SCREEN ==========
function renderSettingsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '⚙️ Settings';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Manage your budget and data';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Budget Settings Card
    const budgetCard = createCard(
        'Budget Settings',
        'Customize your monthly budget',
        null
    );
    
    const budgetForm = document.createElement('form');
    budgetForm.style.display = 'flex';
    budgetForm.style.flexDirection = 'column';
    budgetForm.style.gap = 'var(--space-lg)';
    
    const currentBudget = getBudget();
    const percentages = getBudgetPercentages();
    
    // Total Budget
    const totalGroup = document.createElement('div');
    totalGroup.className = 'input-group';
    totalGroup.style.marginBottom = '0';
    
    const totalLabel = document.createElement('label');
    totalLabel.className = 'input-label';
    totalLabel.textContent = 'Monthly Budget (₹)';
    
    const totalInput = document.createElement('input');
    totalInput.type = 'number';
    totalInput.className = 'input';
    totalInput.value = currentBudget.total;
    totalInput.required = true;
    totalInput.min = '0';
    totalInput.step = '100';
    
    totalGroup.appendChild(totalLabel);
    totalGroup.appendChild(totalInput);
    
    // Percentages
    const percentGroup = document.createElement('div');
    percentGroup.style.display = 'grid';
    percentGroup.style.gridTemplateColumns = 'repeat(3, 1fr)';
    percentGroup.style.gap = 'var(--space-md)';
    
    // Needs
    const needsDiv = document.createElement('div');
    const needsLabel = document.createElement('label');
    needsLabel.className = 'input-label';
    needsLabel.textContent = 'Needs (%)';
    const needsInput = document.createElement('input');
    needsInput.type = 'number';
    needsInput.className = 'input';
    needsInput.value = percentages.needs;
    needsInput.min = '0';
    needsInput.max = '100';
    needsDiv.appendChild(needsLabel);
    needsDiv.appendChild(needsInput);
    
    // Wants
    const wantsDiv = document.createElement('div');
    const wantsLabel = document.createElement('label');
    wantsLabel.className = 'input-label';
    wantsLabel.textContent = 'Wants (%)';
    const wantsInput = document.createElement('input');
    wantsInput.type = 'number';
    wantsInput.className = 'input';
    wantsInput.value = percentages.wants;
    wantsInput.min = '0';
    wantsInput.max = '100';
    wantsDiv.appendChild(wantsLabel);
    wantsDiv.appendChild(wantsInput);
    
    // Savings
    const savingsDiv = document.createElement('div');
    const savingsLabel = document.createElement('label');
    savingsLabel.className = 'input-label';
    savingsLabel.textContent = 'Savings (%)';
    const savingsInput = document.createElement('input');
    savingsInput.type = 'number';
    savingsInput.className = 'input';
    savingsInput.value = percentages.savings;
    savingsInput.min = '0';
    savingsInput.max = '100';
    savingsDiv.appendChild(savingsLabel);
    savingsDiv.appendChild(savingsInput);
    
    percentGroup.appendChild(needsDiv);
    percentGroup.appendChild(wantsDiv);
    percentGroup.appendChild(savingsDiv);
    
    // Save button
    const saveBtn = createButton('Save Budget', null, 'primary', 'large');
    saveBtn.type = 'submit';
    saveBtn.style.width = '100%';
    
    budgetForm.appendChild(totalGroup);
    budgetForm.appendChild(percentGroup);
    budgetForm.appendChild(saveBtn);
    
    budgetForm.onsubmit = (e) => {
        e.preventDefault();
        
        const total = parseFloat(totalInput.value);
        const needs = parseFloat(needsInput.value);
        const wants = parseFloat(wantsInput.value);
        const savings = parseFloat(savingsInput.value);
        
        if (needs + wants + savings !== 100) {
            alert('Percentages must add up to 100%!');
            return;
        }
        
        updateBudgetAmounts(total, needs, wants, savings);
        alert('✅ Budget updated successfully!');
        renderScreen('settings');
    };
    
    budgetCard.appendChild(budgetForm);
    container.appendChild(budgetCard);
    
    // Spacing
    const spacer1 = document.createElement('div');
    spacer1.style.height = 'var(--space-xl)';
    container.appendChild(spacer1);
    
    // Data Management Card
    const dataCard = createCard(
        'Data Management',
        'Export or clear your data',
        null
    );
    
    const dataActions = document.createElement('div');
    dataActions.style.display = 'flex';
    dataActions.style.flexDirection = 'column';
    dataActions.style.gap = 'var(--space-md)';
    
    // Export button
    const exportBtn = createButton('📥 Export Data (CSV)', exportDataToCSV, 'secondary', 'large');
    exportBtn.style.width = '100%';
    exportBtn.style.justifyContent = 'flex-start';
    
    // Reset budget button
    const resetBudgetBtn = createButton('🔄 Reset to Default Budget', () => {
        if (confirm('Reset budget to default (₹15,000 with 50/30/20 split)?')) {
            resetToDefaultBudget();
            alert('✅ Budget reset to defaults!');
            renderScreen('settings');
        }
    }, 'secondary', 'large');
    resetBudgetBtn.style.width = '100%';
    resetBudgetBtn.style.justifyContent = 'flex-start';
    
    // Clear all button
    const clearBtn = createButton('🗑️ Clear All Transactions', () => {
        if (clearAllTransactions()) {
            alert('✅ All transactions deleted!');
            renderScreen('settings');
        }
    }, 'secondary', 'large');
    clearBtn.style.width = '100%';
    clearBtn.style.justifyContent = 'flex-start';
    clearBtn.style.color = 'var(--color-danger)';
    
    dataActions.appendChild(exportBtn);
    dataActions.appendChild(resetBudgetBtn);
    dataActions.appendChild(clearBtn);
    
    dataCard.appendChild(dataActions);
    container.appendChild(dataCard);
    
    return container;
}

// ========== ANALYTICS SCREEN ==========
function renderAnalyticsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '📊 Analytics';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Understand your spending patterns';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Get data
    const transactions = getTransactions();
    const budget = getBudget();
    const categoryData = getSpendingByCategory(transactions);
    const totalSpending = getTotalSpending(transactions);
    
    // Check if there's data
    if (categoryData.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = 'var(--space-3xl)';
        
        const emptyIcon = document.createElement('div');
        emptyIcon.textContent = '📊';
        emptyIcon.style.fontSize = '64px';
        emptyIcon.style.marginBottom = 'var(--space-lg)';
        
        const emptyText = document.createElement('p');
        emptyText.className = 'text-secondary';
        emptyText.textContent = 'No spending data yet. Add some expenses to see analytics!';
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyText);
        container.appendChild(emptyState);
        
        return container;
    }
    
    // Budget Health Score
    const healthScore = calculateHealthScore(transactions, budget);
    const healthInfo = getHealthScoreLabel(healthScore);
    const healthCard = createHealthScore(healthScore, healthInfo.label, healthInfo.emoji, healthInfo.color);
    container.appendChild(healthCard);
    
    // Spacing
    const spacer1 = document.createElement('div');
    spacer1.style.height = 'var(--space-xl)';
    container.appendChild(spacer1);
    
    // Week comparison
    const comparison = getWeekComparison(transactions);
    const comparisonCard = createCard(
        'Week Over Week',
        'How you\'re doing compared to last week',
        null
    );
    
    const comparisonContent = document.createElement('div');
    comparisonContent.style.display = 'grid';
    comparisonContent.style.gridTemplateColumns = '1fr 1fr';
    comparisonContent.style.gap = 'var(--space-lg)';
    
    const thisWeekDiv = document.createElement('div');
    const thisWeekLabel = document.createElement('div');
    thisWeekLabel.className = 'text-secondary';
    thisWeekLabel.style.fontSize = 'var(--font-size-sm)';
    thisWeekLabel.style.marginBottom = 'var(--space-xs)';
    thisWeekLabel.textContent = 'This Week';
    
    const thisWeekValue = document.createElement('div');
    thisWeekValue.style.fontSize = 'var(--font-size-2xl)';
    thisWeekValue.style.fontWeight = 'var(--font-bold)';
    thisWeekValue.textContent = formatCurrency(comparison.thisWeek);
    
    thisWeekDiv.appendChild(thisWeekLabel);
    thisWeekDiv.appendChild(thisWeekValue);
    
    const lastWeekDiv = document.createElement('div');
    const lastWeekLabel = document.createElement('div');
    lastWeekLabel.className = 'text-secondary';
    lastWeekLabel.style.fontSize = 'var(--font-size-sm)';
    lastWeekLabel.style.marginBottom = 'var(--space-xs)';
    lastWeekLabel.textContent = 'Last Week';
    
    const lastWeekValue = document.createElement('div');
    lastWeekValue.style.fontSize = 'var(--font-size-2xl)';
    lastWeekValue.style.fontWeight = 'var(--font-bold)';
    lastWeekValue.textContent = formatCurrency(comparison.lastWeek);
    
    lastWeekDiv.appendChild(lastWeekLabel);
    lastWeekDiv.appendChild(lastWeekValue);
    
    comparisonContent.appendChild(thisWeekDiv);
    comparisonContent.appendChild(lastWeekDiv);
    
    // Difference indicator
    if (comparison.lastWeek > 0) {
        const differenceDiv = document.createElement('div');
        differenceDiv.style.gridColumn = '1 / -1';
        differenceDiv.style.marginTop = 'var(--space-md)';
        differenceDiv.style.padding = 'var(--space-md)';
        differenceDiv.style.borderRadius = 'var(--radius-md)';
        differenceDiv.style.textAlign = 'center';
        differenceDiv.style.fontSize = 'var(--font-size-sm)';
        differenceDiv.style.fontWeight = 'var(--font-medium)';
        
        if (comparison.isIncrease) {
            differenceDiv.style.backgroundColor = 'var(--color-danger-light)';
            differenceDiv.style.color = 'var(--color-danger)';
            differenceDiv.textContent = `↑ ${formatCurrency(Math.abs(comparison.difference))} more (${Math.abs(comparison.percentChange)}% increase)`;
        } else {
            differenceDiv.style.backgroundColor = 'var(--color-success-light)';
            differenceDiv.style.color = 'var(--color-success)';
            differenceDiv.textContent = `↓ ${formatCurrency(Math.abs(comparison.difference))} less (${Math.abs(comparison.percentChange)}% decrease)`;
        }
        
        comparisonContent.appendChild(differenceDiv);
    }
    
    comparisonCard.appendChild(comparisonContent);
    container.appendChild(comparisonCard);
    
    // Spacing
    const spacer2 = document.createElement('div');
    spacer2.style.height = 'var(--space-xl)';
    container.appendChild(spacer2);
    
    // Spending by Category
    const categoryCard = createCard(
        'Spending by Category',
        `Total: ${formatCurrency(totalSpending)}`,
        null
    );
    
    const pieChart = createPieChart(categoryData);
    categoryCard.appendChild(pieChart);
    container.appendChild(categoryCard);
    
    // Spacing
    const spacer3 = document.createElement('div');
    spacer3.style.height = 'var(--space-xl)';
    container.appendChild(spacer3);
    
    // Top 3 Categories
    const topCategories = getTopCategories(categoryData, 3);
    const topCard = createCard(
        'Top Spending Categories',
        'Where most of your money goes',
        null
    );
    
    const topList = document.createElement('div');
    topList.style.display = 'flex';
    topList.style.flexDirection = 'column';
    topList.style.gap = 'var(--space-md)';
    
    topCategories.forEach((category, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = 'var(--space-md)';
        item.style.padding = 'var(--space-md)';
        item.style.backgroundColor = 'var(--color-bg-secondary)';
        item.style.borderRadius = 'var(--radius-lg)';
        
        const rank = document.createElement('div');
        rank.textContent = `#${index + 1}`;
        rank.style.fontSize = 'var(--font-size-xl)';
        rank.style.fontWeight = 'var(--font-bold)';
        rank.style.color = 'var(--color-text-tertiary)';
        rank.style.width = '40px';
        rank.style.textAlign = 'center';
        
        const icon = document.createElement('div');
        icon.textContent = category.icon;
        icon.style.fontSize = '32px';
        
        const details = document.createElement('div');
        details.style.flex = '1';
        
        const name = document.createElement('div');
        name.textContent = category.category.charAt(0).toUpperCase() + category.category.slice(1);
        name.style.fontWeight = 'var(--font-semibold)';
        name.style.marginBottom = '4px';
        
        const percentage = ((category.amount / totalSpending) * 100).toFixed(1);
        const amount = document.createElement('div');
        amount.textContent = `${formatCurrency(category.amount)} (${percentage}%)`;
        amount.style.fontSize = 'var(--font-size-sm)';
        amount.style.color = 'var(--color-text-secondary)';
        
        details.appendChild(name);
        details.appendChild(amount);
        
        item.appendChild(rank);
        item.appendChild(icon);
        item.appendChild(details);
        topList.appendChild(item);
    });
    
    topCard.appendChild(topList);
    container.appendChild(topCard);
    
    return container;
}

// ========== PROFILE SCREEN (Placeholder - Nayan will build this) ==========
function renderProfileScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = 'Profile';
    title.style.marginBottom = 'var(--space-xs)';
    
    header.appendChild(title);
    container.appendChild(header);
    
    const message = document.createElement('p');
    message.className = 'text-secondary';
    message.textContent = 'Profile page coming soon...';
    container.appendChild(message);
    
    return container;
}

// ========== AUTH FORM HANDLERS ==========
function setupAuthForms() {
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = loginUser(email, password);
            if (result.success) {
                console.log('✅ Login successful:', result.user);
                navigateTo('home');
            } else {
                alert('❌ ' + result.error);
                document.getElementById('login-password').value = '';
            }
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            const result = registerUser({
                name,
                email,
                password,
                avatar: '👤'
            });
            
            if (result.success) {
                console.log('✅ Registration successful:', result.user);
                // Auto-login after registration
                const loginResult = loginUser(email, password);
                if (loginResult.success) {
                    navigateTo('home');
                }
            } else {
                alert('❌ ' + result.error);
            }
        });
    }
}

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    setupAuthForms();
    initRouter();
    console.log('App ready with auth!');
});