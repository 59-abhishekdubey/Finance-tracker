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
        case 'analytics':
            screenContent = renderAnalyticsScreen();
            break;
        case 'ai':
            screenContent = renderAIScreen();
            break;
        case 'settings':  // ADD THIS CASE
            screenContent = renderSettingsScreen();
            break;
        default:
            screenContent = renderDashboard();
    }
    
    app.appendChild(screenContent);
}


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
    container.className = 'container-narrow';
    
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = 'AI Finance Advisor';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Get smart advice about your spending';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Coming soon card
    const comingSoonCard = createCard(
        '🤖 AI Chat Coming Soon',
        'We\'re building an intelligent advisor to help you make better financial decisions',
        null
    );
    
    const featureList = document.createElement('ul');
    featureList.style.listStyle = 'none';
    featureList.style.padding = '0';
    featureList.style.marginTop = 'var(--space-lg)';
    
    const features = [
        'Should I buy this? - Get instant advice',
        'Spending insights - Understand your patterns',
        'Goal planning - Reach your financial targets',
        'Budget optimization - Save smarter'
    ];
    
    features.forEach(feature => {
        const li = document.createElement('li');
        li.style.padding = 'var(--space-sm) 0';
        li.style.borderBottom = '1px solid var(--color-border-light)';
        li.innerHTML = `<span style="color: var(--color-success); margin-right: var(--space-sm);">✓</span>${feature}`;
        featureList.appendChild(li);
    });
    
    comingSoonCard.appendChild(featureList);
    container.appendChild(comingSoonCard);
    
    return container;
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

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    console.log('App ready!');
});