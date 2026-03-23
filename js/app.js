// ========== GLOBAL ERROR HANDLER ==========
globalThis.addEventListener('error', function(e) {
    console.error('❌ Global Error Caught:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Show user-friendly error instead of blank page
    const app = document.getElementById('app');
    if (app && !app.innerHTML) {
        app.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #EF4444;">
                <h2>⚠️ Something went wrong</h2>
                <p style="color: #6B7280; margin: 16px 0;">The page failed to load. Please refresh.</p>
                <button onclick="location.reload()" style="padding: 12px 24px; background: #6366F1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Reload Page
                </button>
                <details style="margin-top: 24px; text-align: left; background: #1F2937; padding: 16px; border-radius: 8px; color: #F3F4F6;">
                    <summary style="cursor: pointer; font-weight: 600; margin-bottom: 8px;">Error Details</summary>
                    <pre style="font-size: 12px; overflow-x: auto;">${e.message}\nat ${e.filename}:${e.lineno}:${e.colno}</pre>
                </details>
            </div>
        `;
    }
});

console.log('✅ Global error handler installed');

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

function renderScreenContent_home(app) { app.appendChild(createSkeletonDashboard()); setTimeout(() => { app.innerHTML = ''; app.appendChild(renderDashboard()); }, 600); }
function renderScreenContent_stats(app) { const sk = createSkeletonTransactions(7); app.appendChild(sk); setTimeout(() => { app.innerHTML = ''; app.appendChild(renderStatsScreen()); }, 600); }
function renderScreenContent_analytics(app) { showLoading('Loading analytics...'); setTimeout(() => { hideLoading(); app.appendChild(renderAnalyticsScreen() || createErrorDiv('Error')); }, 800); }
function renderScreenContent_income(app) { showLoading('Loading income...'); setTimeout(() => { hideLoading(); app.appendChild(renderIncomeScreen() || createErrorDiv('Error')); }, 600); }
function renderScreenContent_ai(app) { showLoading('AI analyzing...'); setTimeout(() => { hideLoading(); app.appendChild(renderAIScreen() || createErrorDiv('Error')); }, 1000); }
function renderScreenContent_reports(app) { showLoading('Loading reports...'); setTimeout(() => { hideLoading(); app.appendChild(renderReportsScreen() || createErrorDiv('Error')); }, 800); }
function renderScreenContent_profile(app) { showLoading('Loading profile...'); setTimeout(() => { hideLoading(); app.appendChild(renderProfileScreen()); }, 600); }

function renderScreen(screenId) {
    const app = document.getElementById('app');
    const pages = { landing: document.getElementById('landing-page'), login: document.getElementById('login-page'), register: document.getElementById('register-page') };
    
    Object.values(pages).forEach(p => { if (p) p.style.display = 'none'; });
    if (app) app.style.display = 'none';
    
    if (pages[screenId]) { pages[screenId].style.display = 'block'; return; }
    if (!app) return;
    
    app.style.display = 'block';
    app.innerHTML = '';
    app.className = 'animate-fadeIn';
    
    if (screenId === 'home') renderScreenContent_home(app);
    else if (screenId === 'stats') renderScreenContent_stats(app);
    else if (screenId === 'analytics') renderScreenContent_analytics(app);
    else if (screenId === 'income') renderScreenContent_income(app);
    else if (screenId === 'recurring') app.appendChild(renderRecurringScreen());
    else if (screenId === 'ai') renderScreenContent_ai(app);
    else if (screenId === 'settings') app.appendChild(renderSettingsScreen());
    else if (screenId === 'reports') renderScreenContent_reports(app);
    else if (screenId === 'profile') renderScreenContent_profile(app);
    else pages.landing.style.display = 'block';
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

// ========== DASHBOARD SCREEN (UPDATED WITH MODERN CHARTS) ==========
function renderDashboard() {
    console.log('🏠 App: renderDashboard called');
    const wrapper = document.createElement('div');
    
    // Create main dashboard container
    const dashboardContent = renderModernDashboard();
    if (!dashboardContent) {
        console.error('❌ Dashboard: renderModernDashboard returned null');
        wrapper.innerHTML = '<div style="padding: 2rem; text-align: center;">Error loading dashboard</div>';
        return wrapper;
    }
    
    console.log('🏠 App: Dashboard content created, size:', dashboardContent.children.length);
    
    // Add insights widget at top if there are any
    try {
        const insights = createInsightsWidget();
        if (insights) {
            const firstChild = dashboardContent.firstChild;
            firstChild.before(insights);
            console.log('🏠 App: Insights widget added');
        }
    } catch (e) {
        console.warn('⚠️ App: Insights widget failed:', e);
    }
    
    // Check for alerts and show first one
    try {
        const alerts = checkBudgetAlerts();
        if (alerts && alerts.length > 0) {
            showAlertBanner(alerts[0]);
            console.log('🏠 App: Alert banner shown');
        }
    } catch (e) {
        console.warn('⚠️ App: Budget alerts failed:', e);
    }
    
    wrapper.appendChild(dashboardContent);
    console.log('🏠 App: renderDashboard finished, wrapper has', wrapper.children.length, 'children');
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

// ========== STATS SCREEN (WITH PROFESSIONAL CHART) ==========
function renderStatsScreen() {
    console.log('📊 Stats: renderStatsScreen called');
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '📊 Statistics';
    title.style.fontSize = 'var(--font-size-3xl)';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Your spending insights and trends';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Chart Card - Daily Spending
    const chartCard = document.createElement('div');
    chartCard.className = 'chart-card';
    chartCard.style.gridColumn = 'span 12';
    chartCard.style.marginBottom = 'var(--space-xl)';
    
    const chartHeader = document.createElement('div');
    chartHeader.className = 'chart-card-header';
    
    const chartTitle = document.createElement('h3');
    chartTitle.className = 'chart-card-title';
    chartTitle.textContent = 'Daily Spending History';
    
    const filterButtons = document.createElement('div');
    filterButtons.className = 'chart-card-filter';
    filterButtons.innerHTML = `
        <button class="filter-btn active" data-days="7" onclick="updateStatsChart(7)">7 Days</button>
        <button class="filter-btn" data-days="14" onclick="updateStatsChart(14)">14 Days</button>
        <button class="filter-btn" data-days="30" onclick="updateStatsChart(30)">30 Days</button>
    `;
    
    chartHeader.appendChild(chartTitle);
    chartHeader.appendChild(filterButtons);
    chartCard.appendChild(chartHeader);
    
    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '350px';
    canvasContainer.style.marginBottom = 'var(--space-lg)';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'stats-spending-chart';
    canvasContainer.appendChild(canvas);
    chartCard.appendChild(canvasContainer);
    
    container.appendChild(chartCard);
    
    // Initialize chart after rendering
    setTimeout(() => {
        initStatsChart(7);
    }, 100);
    
    // Spacing
    const spacer = document.createElement('div');
    spacer.style.height = 'var(--space-lg)';
    container.appendChild(spacer);
    
    // Weekly Summary Cards
    const transactions = getTransactions();
    const dailyData = getSpendingByDay(transactions, 7);
    const weeklyTotal = dailyData.reduce((sum, day) => sum + day.amount, 0);
    const weeklyAverage = Math.round(weeklyTotal / 7);
    
    const summarySection = document.createElement('div');
    summarySection.style.display = 'grid';
    summarySection.style.gridTemplateColumns = '1fr 1fr';
    summarySection.style.gap = 'var(--space-lg)';
    summarySection.style.marginBottom = 'var(--space-xl)';
    
    // Total Card
    const totalCard = document.createElement('div');
    totalCard.className = 'stat-card-modern primary';
    totalCard.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Weekly Total</div>
            </div>
            <div class="stat-card-icon primary">
                💰
            </div>
        </div>
        <div class="stat-card-value">${formatCurrency(weeklyTotal)}</div>
        <div class="stat-card-change" style="color: var(--color-text-secondary);">
            <span>📅</span>
            <span>Last 7 days</span>
        </div>
    `;
    
    // Average Card
    const avgCard = document.createElement('div');
    avgCard.className = 'stat-card-modern success';
    avgCard.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Daily Average</div>
            </div>
            <div class="stat-card-icon success">
                📊
            </div>
        </div>
        <div class="stat-card-value">${formatCurrency(weeklyAverage)}</div>
        <div class="stat-card-change" style="color: var(--color-text-secondary);">
            <span>📈</span>
            <span>Per day</span>
        </div>
    `;
    
    summarySection.appendChild(totalCard);
    summarySection.appendChild(avgCard);
    container.appendChild(summarySection);
    
    // Spending Breakdown by Category
    const spent = calculateSpent(transactions);
    const categoryData = getSpendingByCategory(transactions);
    
    const categorySection = document.createElement('div');
    categorySection.style.marginBottom = 'var(--space-xl)';
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.style.fontSize = 'var(--font-size-xl)';
    categoryTitle.style.marginBottom = 'var(--space-lg)';
    categoryTitle.innerHTML = '📂 Category Breakdown';
    
    categorySection.appendChild(categoryTitle);
    
    const categoryList = document.createElement('div');
    categoryList.style.display = 'grid';
    categoryList.style.gap = 'var(--space-md)';
    
    categoryData.forEach(cat => {
        const categoryItem = document.createElement('div');
        categoryItem.style.display = 'flex';
        categoryItem.style.alignItems = 'center';
        categoryItem.style.padding = 'var(--space-md)';
        categoryItem.style.background = 'var(--color-surface)';
        categoryItem.style.borderRadius = 'var(--radius-lg)';
        categoryItem.style.border = '1px solid var(--color-border)';
        
        const categoryIcon = document.createElement('div');
        categoryIcon.style.width = '40px';
        categoryIcon.style.height = '40px';
        categoryIcon.style.borderRadius = '50%';
        categoryIcon.style.background = cat.color + '20';
        categoryIcon.style.display = 'flex';
        categoryIcon.style.alignItems = 'center';
        categoryIcon.style.justifyContent = 'center';
        categoryIcon.style.marginRight = 'var(--space-md)';
        categoryIcon.style.color = cat.color;
        categoryIcon.style.fontSize = '20px';
        categoryIcon.innerHTML = getCategoryIcon(cat.category);
        
        const categoryInfo = document.createElement('div');
        categoryInfo.style.flex = '1';
        
        const categoryName = document.createElement('div');
        categoryName.style.fontWeight = 'var(--font-semibold)';
        categoryName.style.color = 'var(--color-text-primary)';
        categoryName.textContent = cat.category.charAt(0).toUpperCase() + cat.category.slice(1);
        
        const categoryAmount = document.createElement('div');
        categoryAmount.style.fontSize = 'var(--font-size-sm)';
        categoryAmount.style.color = 'var(--color-text-secondary)';
        categoryAmount.textContent = formatCurrency(cat.amount);
        
        categoryInfo.appendChild(categoryName);
        categoryInfo.appendChild(categoryAmount);
        
        const categoryPercentage = document.createElement('div');
        categoryPercentage.style.minWidth = '80px';
        categoryPercentage.style.textAlign = 'right';
        categoryPercentage.style.fontWeight = 'var(--font-semibold)';
        categoryPercentage.style.color = cat.color;
        categoryPercentage.textContent = spent.total > 0 ? `${((cat.amount / spent.total) * 100).toFixed(1)}%` : '0%';
        
        categoryItem.appendChild(categoryIcon);
        categoryItem.appendChild(categoryInfo);
        categoryItem.appendChild(categoryPercentage);
        
        categoryList.appendChild(categoryItem);
    });
    
    categorySection.appendChild(categoryList);
    container.appendChild(categorySection);
    
    console.log('✅ Stats: renderStatsScreen completed');
    return container;
}

// ========== CHART FUNCTIONS FOR STATS SCREEN ==========

let statsChart = null;

// Initialize daily spending chart with Chart.js
function initStatsChart(days) {
    const canvas = document.getElementById('stats-spending-chart');
    if (!canvas) return;
    
    if (statsChart) {
        statsChart.destroy();
    }
    
    const transactions = getTransactions();
    const dailyData = getSpendingByDay(transactions, days);
    
    const ctx = canvas.getContext('2d');
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dailyData.map(d => {
                const date = new Date(d.date);
                return `${getDayName(d.date)}\n${date.getDate()}/${date.getMonth() + 1}`;
            }),
            datasets: [{
                label: 'Daily Spending',
                data: dailyData.map(d => d.amount),
                backgroundColor: '#6366F1',
                borderColor: '#4F46E5',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#4F46E5',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return 'Spent: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update stats chart with different time periods
function updateStatsChart(days) {
    const allButtons = document.querySelectorAll('.chart-card-filter .filter-btn');
    allButtons.forEach(btn => {
        if (Number.parseInt(btn.dataset.days) === days) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    initStatsChart(days);
}

// Get category icon emoji
function getCategoryIcon(category) {
    const icons = {
        food: '🍔',
        transport: '🚗',
        shopping: '🛍️',
        bills: '💡',
        entertainment: '🎮',
        savings: '💰',
        other: '📦'
    };
    return icons[category] || icons.other;
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
    messages.push({ role: 'user', content: message }, { role: 'ai', content: aiResponse });
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
            (category, evt) => {
                selectedCategory = category;
                // Update all pills
                categoryGrid.querySelectorAll('.category-pill').forEach(p => {
                    p.classList.remove('active');
                });
                evt.target.closest('.category-pill').classList.add('active');
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
        
        // Show success toast
        showSuccessToast(
            'Transaction Added!',
            `${note} - ${formatCurrency(amount)}`
        );
        
        // Trigger confetti if it's a savings transaction
        if (transaction.type === 'savings') {
            triggerConfetti(30);
        }
        
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
            (category, evt) => {
                selectedCategory = category;
                categoryGrid.querySelectorAll('.category-pill').forEach(p => {
                    p.classList.remove('active');
                });
                evt.target.closest('.category-pill').classList.add('active');
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
        
        const total = Number.parseFloat(totalInput.value);
        const needs = Number.parseFloat(needsInput.value);
        const wants = Number.parseFloat(wantsInput.value);
        const savings = Number.parseFloat(savingsInput.value);
        
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
    
    // ========== AI SETTINGS CARD ==========
    const aiCard = createCard(
        '🤖 AI Advisor Settings',
        'Configure AI integration (optional)',
        null
    );
    
    const aiForm = document.createElement('form');
    aiForm.style.display = 'flex';
    aiForm.style.flexDirection = 'column';
    aiForm.style.gap = 'var(--space-lg)';
    
    // Load current settings
    const aiSettings = getAISettings();
    
    // AI Provider Selection
    const providerGroup = document.createElement('div');
    providerGroup.className = 'input-group';
    
    const providerLabel = document.createElement('label');
    providerLabel.className = 'input-label';
    providerLabel.textContent = 'AI Provider';
    
    const providerSelect = document.createElement('select');
    providerSelect.className = 'input';
    providerSelect.style.cursor = 'pointer';
    providerSelect.innerHTML = `
        <option value="pattern">Pattern Matching (Free, Built-in)</option>
        <option value="openai">OpenAI GPT (Requires API Key)</option>
        <option value="anthropic">Anthropic Claude (Requires API Key)</option>
    `;
    providerSelect.value = aiSettings.provider || 'pattern';
    
    providerGroup.appendChild(providerLabel);
    providerGroup.appendChild(providerSelect);
    aiForm.appendChild(providerGroup);
    
    // API Key Section (shown when not pattern matching)
    const apiKeyGroup = document.createElement('div');
    apiKeyGroup.className = 'input-group';
    apiKeyGroup.id = 'api-key-section';
    apiKeyGroup.style.display = aiSettings.provider === 'pattern' ? 'none' : 'block';
    
    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.className = 'input-label';
    apiKeyLabel.textContent = 'API Key';
    
    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.className = 'input';
    apiKeyInput.id = 'ai-api-key';
    apiKeyInput.placeholder = 'sk-... (OpenAI) or sk-ant-... (Claude)';
    apiKeyInput.value = aiSettings.apiKey || '';
    apiKeyInput.autocomplete = 'off';
    
    const apiKeyHint = document.createElement('small');
    apiKeyHint.style.cssText = 'color: #6B7280; margin-top: 6px; display: block; line-height: 1.5;';
    apiKeyHint.innerHTML = '🔒 Your key is stored locally in your browser and never sent anywhere else';
    
    apiKeyGroup.appendChild(apiKeyLabel);
    apiKeyGroup.appendChild(apiKeyInput);
    apiKeyGroup.appendChild(apiKeyHint);
    aiForm.appendChild(apiKeyGroup);
    
    // Show/hide API key input based on provider selection
    providerSelect.addEventListener('change', (e) => {
        const apiKeySection = document.getElementById('api-key-section');
        if (e.target.value === 'pattern') {
            apiKeySection.style.display = 'none';
        } else {
            apiKeySection.style.display = 'block';
        }
    });
    
    // Provider Info Box
    const infoBox = document.createElement('div');
    infoBox.style.cssText = 'padding: 12px; background: #F0F9FF; border-left: 4px solid #0EA5E9; border-radius: 4px; font-size: 13px; color: #0C4A6E; line-height: 1.6;';
    
    if (aiSettings.provider === 'pattern') {
        infoBox.innerHTML = '💡 <strong>Pattern Matching:</strong> Free, works without API key. Good for basic questions.';
    } else if (aiSettings.provider === 'openai') {
        infoBox.innerHTML = '⚡ <strong>OpenAI GPT:</strong> Smart responses, $0.002-0.01 per request. Get key: <a href="https://platform.openai.com/api/keys" target="_blank" style="color: #0EA5E9; text-decoration: underline;">platform.openai.com</a>';
    } else {
        infoBox.innerHTML = '⚡ <strong>Claude:</strong> Advanced reasoning, low cost. Get key: <a href="https://console.anthropic.com/keys" target="_blank" style="color: #0EA5E9; text-decoration: underline;">console.anthropic.com</a>';
    }
    
    providerSelect.addEventListener('change', (e) => {
        if (e.target.value === 'pattern') {
            infoBox.innerHTML = '💡 <strong>Pattern Matching:</strong> Free, works without API key. Good for basic questions.';
        } else if (e.target.value === 'openai') {
            infoBox.innerHTML = '⚡ <strong>OpenAI GPT:</strong> Smart responses, $0.002-0.01 per request. Get key: <a href="https://platform.openai.com/api/keys" target="_blank" style="color: #0EA5E9; text-decoration: underline;">platform.openai.com</a>';
        } else {
            infoBox.innerHTML = '⚡ <strong>Claude:</strong> Advanced reasoning, low cost. Get key: <a href="https://console.anthropic.com/keys" target="_blank" style="color: #0EA5E9; text-decoration: underline;">console.anthropic.com</a>';
        }
    });
    
    aiForm.appendChild(infoBox);
    
    // Save button
    const aiSaveBtn = createButton('Save AI Settings', null, 'primary', 'large');
    aiSaveBtn.type = 'submit';
    aiSaveBtn.style.width = '100%';
    
    aiForm.appendChild(aiSaveBtn);
    
    aiForm.onsubmit = (e) => {
        e.preventDefault();
        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        
        if (provider !== 'pattern' && !apiKey) {
            alert('⚠️ Please enter your API key or select Pattern Matching (free)');
            return;
        }
        
        saveAISettings(provider, apiKey);
        showSuccessToast('✅ AI Settings Saved', 'Your AI configuration has been updated');
        renderScreen('settings');
    };
    
    aiCard.appendChild(aiForm);
    container.appendChild(aiCard);
    
    // Spacing
    const spacer2 = document.createElement('div');
    spacer2.style.height = 'var(--space-xl)';
    container.appendChild(spacer2);
    
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
    const spent = calculateSpent(transactions);
    const totalSpending = spent.total;
    
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

// ========== INCOME SCREEN ==========
function renderIncomeScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '💰 Income';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Track and manage your income sources';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    // Get income data
    const incomeTransactions = getIncomeTransactions();
    const totalIncome = calculateTotalIncome();
    const incomeByCategory = getIncomeByCategory(incomeTransactions);
    
    // Check if there's income data
    if (incomeTransactions.length === 0) {
        const emptyState = createEmptyState(
            '💰',
            'No Income Yet',
            'Start tracking your income by adding your first income source',
            createButton('Add Income', showAddIncomeModal, 'primary', 'large')
        );
        container.appendChild(emptyState);
        return container;
    }
    
    // Total Income Card
    const totalCard = createCard(
        'Total Income',
        'This month',
        null
    );
    
    const totalValue = document.createElement('div');
    totalValue.style.fontSize = 'var(--font-size-3xl)';
    totalValue.style.fontWeight = 'var(--font-bold)';
    totalValue.style.color = '#10B981';
    totalValue.style.margin = 'var(--space-lg) 0';
    totalValue.textContent = formatCurrency(totalIncome);
    
    totalCard.appendChild(totalValue);
    container.appendChild(totalCard);
    
    // Spacing
    const spacer1 = document.createElement('div');
    spacer1.style.height = 'var(--space-xl)';
    container.appendChild(spacer1);
    
    // Income by Category
    if (incomeByCategory.length > 0) {
        const categoryCard = createCard(
            'Income by Category',
            'Breakdown of income sources',
            null
        );
        
        const categoryList = document.createElement('div');
        categoryList.style.display = 'flex';
        categoryList.style.flexDirection = 'column';
        categoryList.style.gap = 'var(--space-md)';
        
        incomeByCategory.forEach((item) => {
            const categoryItem = document.createElement('div');
            categoryItem.style.display = 'flex';
            categoryItem.style.alignItems = 'center';
            categoryItem.style.justifyContent = 'space-between';
            categoryItem.style.padding = 'var(--space-md)';
            categoryItem.style.backgroundColor = 'var(--color-bg-secondary)';
            categoryItem.style.borderRadius = 'var(--radius-lg)';
            categoryItem.style.borderLeft = `4px solid ${getIncomeCategoryColor(item.category)}`;
            
            const categoryInfo = document.createElement('div');
            categoryInfo.style.display = 'flex';
            categoryInfo.style.alignItems = 'center';
            categoryInfo.style.gap = 'var(--space-md)';
            
            const icon = document.createElement('span');
            icon.style.fontSize = '24px';
            icon.textContent = getIncomeCategoryIcon(item.category);
            
            const details = document.createElement('div');
            const categoryName = document.createElement('div');
            categoryName.style.fontWeight = 'var(--font-semibold)';
            categoryName.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
            
            const count = document.createElement('div');
            count.style.fontSize = 'var(--font-size-sm)';
            count.style.color = 'var(--color-text-secondary)';
            count.textContent = `${item.count} transactions`;
            
            details.appendChild(categoryName);
            details.appendChild(count);
            categoryInfo.appendChild(icon);
            categoryInfo.appendChild(details);
            
            const amount = document.createElement('div');
            amount.style.fontWeight = 'var(--font-bold)';
            amount.style.color = getIncomeCategoryColor(item.category);
            amount.textContent = formatCurrency(item.total);
            
            categoryItem.appendChild(categoryInfo);
            categoryItem.appendChild(amount);
            categoryList.appendChild(categoryItem);
        });
        
        categoryCard.appendChild(categoryList);
        container.appendChild(categoryCard);
        
        // Spacing
        const spacer2 = document.createElement('div');
        spacer2.style.height = 'var(--space-xl)';
        container.appendChild(spacer2);
    }
    
    // Recent Income Transactions
    const recentCard = createCard(
        'Recent Income',
        'Latest income transactions',
        null
    );
    
    const transactionList = document.createElement('div');
    transactionList.style.display = 'flex';
    transactionList.style.flexDirection = 'column';
    transactionList.style.gap = 'var(--space-md)';
    
    const recentIncome = incomeTransactions.slice(0, 5);
    recentIncome.forEach(transaction => {
        transactionList.appendChild(createTransactionItem(transaction, true));
    });
    
    recentCard.appendChild(transactionList);
    container.appendChild(recentCard);
    
    // Spacing
    const spacer3 = document.createElement('div');
    spacer3.style.height = 'var(--space-xl)';
    container.appendChild(spacer3);
    
    // Add Income Button
    const addBtnContainer = document.createElement('div');
    addBtnContainer.style.display = 'flex';
    addBtnContainer.style.gap = 'var(--space-md)';
    
    const addBtn = createButton('+ Add Income', showAddIncomeModal, 'primary', 'large');
    addBtn.style.flex = '1';
    
    addBtnContainer.appendChild(addBtn);
    container.appendChild(addBtnContainer);
    
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

// ========== ADD INCOME MODAL ==========
function showAddIncomeModal() {
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
    amountInput.id = 'income-amount';
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
    categoryLabel.textContent = 'Income Source';
    
    const categoryGrid = document.createElement('div');
    categoryGrid.className = 'category-grid';
    categoryGrid.id = 'income-category-grid';
    
    const incomeCategories = ['salary', 'freelance', 'business', 'investment', 'gift', 'refund', 'rental', 'other'];
    let selectedCategory = 'salary';
    
    incomeCategories.forEach(cat => {
        const pill = createCategoryPill(
            cat,
            cat === selectedCategory,
            (category, evt) => {
                selectedCategory = category;
                // Update all pills
                categoryGrid.querySelectorAll('.category-pill').forEach(p => {
                    p.classList.remove('active');
                });
                evt.target.closest('.category-pill').classList.add('active');
            }
        );
        pill.style.backgroundColor = getIncomeCategoryColor(cat);
        categoryGrid.appendChild(pill);
    });
    
    categoryGroup.appendChild(categoryLabel);
    categoryGroup.appendChild(categoryGrid);
    
    // Note/Description input
    const noteGroup = document.createElement('div');
    noteGroup.className = 'input-group';
    noteGroup.style.marginBottom = '0';
    
    const noteLabel = document.createElement('label');
    noteLabel.className = 'input-label';
    noteLabel.textContent = 'Description (Optional)';
    
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.className = 'input';
    noteInput.id = 'income-note';
    noteInput.placeholder = 'Where did this income come from?';
    
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
    dateInput.id = 'income-date';
    dateInput.value = getToday();
    dateInput.required = true;
    
    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);
    
    // Submit button
    const submitBtn = createButton(
        'Add Income',
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
        const description = noteInput.value || selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        const date = dateInput.value;
        
        if (!isValidAmount(amount)) {
            showErrorToast('Invalid Amount', 'Please enter a valid amount');
            return;
        }
        
        const incomeTransaction = {
            name: description,
            amount: amount,
            category: selectedCategory,
            date: date
        };
        
        addIncome(incomeTransaction);
        
        // Show success toast
        showSuccessToast(
            '💰 Income Added!',
            `${description} - ${formatCurrency(amount)}`
        );
        
        // Trigger confetti celebration
        triggerConfetti(40);
        
        // Close modal and refresh
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        
        // Refresh current screen
        renderScreen(currentScreen);
    };
    
    // Create and show modal
    currentModal = createModal('Add Income', form, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
    
    // Auto-focus amount input
    setTimeout(() => {
        amountInput.focus();
    }, 100);
}

// ========== ADD RECURRING TRANSACTION MODAL ==========
function showAddRecurringModal() {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = 'var(--space-lg)';
    
    form.innerHTML = `
        <div class="input-group">
            <label class="input-label">Transaction Type</label>
            <select class="input" id="recurring-type" required onchange="updateRecurringCategories()">
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
            </select>
        </div>
        
        <div class="input-group">
            <label class="input-label">Name</label>
            <input type="text" class="input" id="recurring-name" placeholder="e.g., Monthly Rent" required>
        </div>
        
        <div class="input-group">
            <label class="input-label">Amount (₹)</label>
            <input type="number" class="input" id="recurring-amount" placeholder="0" min="1" step="1" required>
        </div>
        
        <div class="input-group">
            <label class="input-label">Category</label>
            <select class="input" id="recurring-category" required>
                <option value="">Select category</option>
                <optgroup label="Expense Categories" id="expense-categories">
                    <option value="food">🍔 Food</option>
                    <option value="transport">🚗 Transport</option>
                    <option value="shopping">🛍️ Shopping</option>
                    <option value="bills">💡 Bills</option>
                    <option value="entertainment">🎮 Entertainment</option>
                    <option value="other">📦 Other</option>
                </optgroup>
                <optgroup label="Income Categories" id="income-categories" style="display: none;">
                    <option value="salary">💼 Salary</option>
                    <option value="freelance">💻 Freelance</option>
                    <option value="business">🏢 Business</option>
                    <option value="investment">📈 Investment</option>
                    <option value="rental">🏠 Rental</option>
                    <option value="other">💰 Other</option>
                </optgroup>
            </select>
        </div>
        
        <div class="input-group">
            <label class="input-label">Frequency</label>
            <select class="input" id="recurring-frequency" required>
                <option value="daily">📅 Daily</option>
                <option value="weekly">🗓️ Weekly</option>
                <option value="biweekly">📆 Every 2 Weeks</option>
                <option value="monthly" selected>🗓️ Monthly</option>
                <option value="quarterly">📊 Every 3 Months</option>
                <option value="yearly">🎂 Yearly</option>
            </select>
        </div>
        
        <div class="input-group">
            <label class="input-label">Start Date</label>
            <input type="date" class="input" id="recurring-start-date" value="${getToday()}" required>
        </div>
        
        <div class="input-group">
            <label class="input-label">Description (Optional)</label>
            <input type="text" class="input" id="recurring-note" placeholder="Additional details">
        </div>
        
        <div style="padding: var(--space-md); background: var(--color-info-light); border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            💡 <strong>Tip:</strong> This transaction will be automatically added to your account based on the frequency you choose.
        </div>
        
        <button type="submit" class="btn btn-primary btn-large btn-block">
            ✓ Create Recurring Transaction
        </button>
    `;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const type = document.getElementById('recurring-type').value;
        const name = document.getElementById('recurring-name').value;
        const amount = Number.parseFloat(document.getElementById('recurring-amount').value);
        const category = document.getElementById('recurring-category').value;
        const frequency = document.getElementById('recurring-frequency').value;
        const startDate = document.getElementById('recurring-start-date').value;
        const note = document.getElementById('recurring-note').value;
        
        if (!name || !amount || !category || !frequency) {
            showErrorToast('Invalid Input', 'Please fill all required fields');
            return;
        }
        
        const recurringData = {
            name: name,
            amount: amount,
            category: category,
            frequency: frequency,
            startDate: startDate,
            note: note,
            transactionType: type,
            type: type === 'income' ? 'income' : getCategoryType(category)
        };
        
        addRecurringTransaction(recurringData);
        
        showSuccessToast(
            'Recurring Transaction Created!',
            `${name} will be added ${getFrequencyLabel(frequency).toLowerCase()}`
        );
        
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        
        if (currentScreen === 'recurring') {
            renderScreen('recurring');
        }
    };
    
    currentModal = createModal('New Recurring Transaction', form, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
}

// Update categories based on transaction type
function updateRecurringCategories() {
    const type = document.getElementById('recurring-type').value;
    const expenseGroup = document.getElementById('expense-categories');
    const incomeGroup = document.getElementById('income-categories');
    const categorySelect = document.getElementById('recurring-category');
    
    if (type === 'income') {
        expenseGroup.style.display = 'none';
        incomeGroup.style.display = 'block';
        categorySelect.value = 'salary';
    } else {
        expenseGroup.style.display = 'block';
        incomeGroup.style.display = 'none';
        categorySelect.value = 'food';
    }
}

// ========== RECURRING TRANSACTIONS SCREEN ==========
function renderRecurringScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';
    
    const title = document.createElement('h1');
    title.textContent = '🔄 Recurring Transactions';
    title.style.marginBottom = 'var(--space-xs)';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Automate your regular income and expenses';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);
    
    const processed = processDueRecurring();
    if (processed > 0) {
        showSuccessToast(
            'Transactions Processed',
            `${processed} recurring transaction${processed === 1 ? '' : 's'} added`
        );
    }
    
    const recurring = getRecurringTransactions();
    
    if (recurring.length === 0) {
        const emptyState = createEmptyState({
            icon: '🔄',
            title: 'No recurring transactions',
            description: 'Set up automatic transactions for bills, salary, subscriptions, and more.',
            actions: [{
                label: 'Create Recurring',
                onClick: showAddRecurringModal,
                variant: 'primary',
                icon: '+'
            }]
        });
        container.appendChild(emptyState);
        return container;
    }
    
    const upcoming = getUpcomingRecurring();
    
    if (upcoming.length > 0) {
        const upcomingCard = createCard('📅 Upcoming (Next 7 Days)', null, null);
        upcomingCard.style.marginBottom = 'var(--space-xl)';
        
        const upcomingList = document.createElement('div');
        upcomingList.className = 'recurring-list';
        
        upcoming.forEach(rec => {
            const daysUntil = Math.ceil((new Date(rec.nextDue) - Date.now()) / (1000 * 60 * 60 * 24));
            const item = createRecurringItem(rec, daysUntil);
            upcomingList.appendChild(item);
        });
        
        upcomingCard.appendChild(upcomingList);
        container.appendChild(upcomingCard);
    }
    
    const addBtn = createButton('Create Recurring', showAddRecurringModal, 'primary', 'large', '+');
    addBtn.style.width = '100%';
    addBtn.style.marginBottom = 'var(--space-xl)';
    container.appendChild(addBtn);
    
    const allTitle = document.createElement('h2');
    allTitle.textContent = 'All Recurring Transactions';
    allTitle.style.marginBottom = 'var(--space-lg)';
    container.appendChild(allTitle);
    
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.style.marginBottom = 'var(--space-lg)';
    tabs.innerHTML = `
        <button class="tab-btn active" onclick="filterRecurring('active', event)">Active (${recurring.filter(r => r.isActive).length})</button>
        <button class="tab-btn" onclick="filterRecurring('paused', event)">Paused (${recurring.filter(r => !r.isActive).length})</button>
        <button class="tab-btn" onclick="filterRecurring('all', event)">All (${recurring.length})</button>
    `;
    container.appendChild(tabs);
    
    const recurringList = document.createElement('div');
    recurringList.className = 'recurring-list';
    recurringList.id = 'recurring-list';
    
    recurring.forEach(rec => {
        const item = createRecurringItem(rec);
        recurringList.appendChild(item);
    });
    
    container.appendChild(recurringList);
    
    return container;
}

// Create recurring item component
function createRecurringItem(recurring, daysUntil = null) {
    const item = document.createElement('div');
    item.className = 'recurring-item';
    if (!recurring.isActive) {
        item.classList.add('paused');
    }
    
    const isIncome = recurring.transactionType === 'income';
    const categoryColor = isIncome 
        ? getIncomeCategoryColor(recurring.category)
        : getCategoryColor(recurring.category);
    
    const icon = isIncome
        ? getIncomeCategoryIcon(recurring.category)
        : getCategoryIcon(recurring.category);
    
    // Build daysUntil display without nested ternaries
    let daysUntilDisplay = '';
    if (daysUntil !== null) {
        let daysLabel;
        if (daysUntil === 0) {
            daysLabel = 'Due today';
        } else {
            const dayWord = daysUntil === 1 ? 'day' : 'days';
            daysLabel = `In ${daysUntil} ${dayWord}`;
        }
        daysUntilDisplay = `<span class="transaction-dot">•</span><span style="color: var(--color-warning); font-weight: var(--font-semibold);">${daysLabel}</span>`;
    }    
    
    // Extract ternary expressions before template
    const badgeHtml = recurring.isActive ? '' : '<span class="recurring-badge paused">Paused</span>';
    
    item.innerHTML = `
        <div class="recurring-icon" style="background: ${categoryColor}20; color: ${categoryColor};">
            ${icon}
        </div>
        <div class="recurring-info">
            <div class="recurring-name">
                ${recurring.name}
                ${badgeHtml}
            </div>
            <div class="recurring-meta">
                <span>${getFrequencyLabel(recurring.frequency)}</span>
                <span class="transaction-dot">•</span>
                <span style="text-transform: capitalize;">${recurring.category}</span>
                ${daysUntilDisplay}
            </div>
            <div class="recurring-next-due">
                Next: ${formatDate(recurring.nextDue)}
            </div>
        </div>
        <div class="recurring-amount" style="color: ${isIncome ? 'var(--color-success)' : 'var(--color-text-primary)'};">
            ${isIncome ? '+' : '-'}${formatCurrency(recurring.amount)}
        </div>
        <div class="recurring-actions">
            <button class="icon-btn" onclick="toggleRecurringStatus(${recurring.id})" title="${toggleBtnTitle}">
                ${toggleBtnIcon}
            </button>
            <button class="icon-btn" onclick="deleteRecurringWithConfirm(${recurring.id})" title="Delete">
                🗑️
            </button>
        </div>
    `;
    
    return item;
}

// Toggle recurring status
function toggleRecurringStatus(id) {
    const recurring = toggleRecurringActive(id);
    
    if (recurring) {
        showSuccessToast(
            recurring.isActive ? 'Recurring Resumed' : 'Recurring Paused',
            recurring.name
        );
        renderScreen('recurring');
    }
}

// Delete recurring with confirmation
function deleteRecurringWithConfirm(id) {
    const recurring = getRecurringTransactions().find(r => r.id === id);
    
    if (!recurring) return;
    
    const confirmed = confirm(`Delete recurring transaction "${recurring.name}"?\n\nThis will stop automatic transactions but won't delete existing ones.`);
    
    if (confirmed) {
        deleteRecurringTransaction(id);
        showSuccessToast('Recurring Deleted', recurring.name);
        renderScreen('recurring');
    }
}

// Filter recurring transactions
function filterRecurring(filter, evt) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    evt.target.classList.add('active');
    
    const recurring = getRecurringTransactions();
    const list = document.getElementById('recurring-list');
    
    list.innerHTML = '';
    
    let filtered;
    if (filter === 'active') {
        filtered = recurring.filter(r => r.isActive);
    } else if (filter === 'paused') {
        filtered = recurring.filter(r => !r.isActive);
    } else {
        filtered = recurring;
    }
    
    if (filtered.length === 0) {
        list.innerHTML = `<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No ${filter} recurring transactions</p>`;
    } else {
        filtered.forEach(rec => {
            list.appendChild(createRecurringItem(rec));
        });
    }
}

// ========== PROFILE SCREEN ==========
function renderProfileScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    const user = getCurrentUser();
    
    if (!user) {
        container.innerHTML = '<p>Please log in to view profile</p>';
        return container;
    }
    
    // Profile Header
    const profileHeader = document.createElement('div');
    profileHeader.style.cssText = 'text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; margin-bottom: 32px; color: white;';
    
    profileHeader.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 16px;">${user.avatar || '👤'}</div>
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${user.name}</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 16px;">${user.email}</p>
        <span style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">Free Plan</span>
    `;
    container.appendChild(profileHeader);
    
    // User Stats
    const stats = getUserStats();
    const statsCard = document.createElement('div');
    statsCard.className = 'card';
    statsCard.style.marginBottom = '24px';
    
    statsCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 24px;">Your Activity</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 700; color: var(--color-primary, #6366F1); margin-bottom: 8px;">${stats.totalTransactions}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">Total Transactions</div>
            </div>
            <div style="text-align: center; padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 700; color: var(--color-success, #10B981); margin-bottom: 8px;">${stats.daysActive}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">Days Active</div>
            </div>
            <div style="text-align: center; padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 700; color: var(--color-warning, #F59E0B); margin-bottom: 8px;">${formatCurrency(stats.thisMonthSpending)}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">This Month</div>
            </div>
            <div style="text-align: center; padding: 20px; background: var(--color-bg-secondary, #F3F4F6); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 700; color: ${stats.budgetUsedPercent > 100 ? 'var(--color-danger, #EF4444)' : 'var(--color-info, #06B6D4)'}; margin-bottom: 8px;">${stats.budgetUsedPercent}%</div>
                <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">Budget Used</div>
            </div>
        </div>
    `;
    container.appendChild(statsCard);
    
    // Actions Card
    const actionsCard = document.createElement('div');
    actionsCard.className = 'card';
    actionsCard.style.marginBottom = '24px';
    
    actionsCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">Quick Actions</h2>
        <div style="display: grid; gap: 12px;">
            <button onclick="showEditProfileModal()" style="width: 100%; padding: 16px; background: var(--color-surface, white); border: 1px solid var(--color-border, #E5E7EB); border-radius: 12px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s;">
                <span style="font-size: 24px;">✏️</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">Edit Profile</div>
                    <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">Update your name and avatar</div>
                </div>
                <span style="color: var(--color-text-tertiary, #9CA3AF);">→</span>
            </button>
            <button onclick="navigateTo('settings')" style="width: 100%; padding: 16px; background: var(--color-surface, white); border: 1px solid var(--color-border, #E5E7EB); border-radius: 12px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s;">
                <span style="font-size: 24px;">⚙️</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">Settings</div>
                    <div style="font-size: 14px; color: var(--color-text-secondary, #6B7280);">Manage budget and preferences</div>
                </div>
                <span style="color: var(--color-text-tertiary, #9CA3AF);">→</span>
            </button>
            <button onclick="handleLogout()" style="width: 100%; padding: 16px; background: var(--color-surface, white); border: 1px solid var(--color-danger-light, #FEE2E2); border-radius: 12px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s; color: var(--color-danger, #EF4444);">
                <span style="font-size: 24px;">🚪</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">Logout</div>
                    <div style="font-size: 14px; opacity: 0.8;">Sign out of your account</div>
                </div>
                <span style="opacity: 0.5;">→</span>
            </button>
        </div>
    `;
    container.appendChild(actionsCard);
    
    // Account Info
    const infoCard = document.createElement('div');
    infoCard.className = 'card';
    
    const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    infoCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">Account Information</h2>
        <div style="display: grid; gap: 16px;">
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border, #E5E7EB);">
                <span style="color: var(--color-text-secondary, #6B7280);">Member Since</span>
                <span style="font-weight: 600;">${memberSince}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border, #E5E7EB);">
                <span style="color: var(--color-text-secondary, #6B7280);">Account Type</span>
                <span style="font-weight: 600;">Free Plan</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border, #E5E7EB);">
                <span style="color: var(--color-text-secondary, #6B7280);">Email</span>
                <span style="font-weight: 600;">${user.email}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                <span style="color: var(--color-text-secondary, #6B7280);">User ID</span>
                <span style="font-weight: 600; font-family: monospace; font-size: 12px;">#${user.id.toString().slice(0, 8)}</span>
            </div>
        </div>
    `;
    container.appendChild(infoCard);
    
    return container;
}

// Edit Profile Modal
function showEditProfileModal() {
    const user = getCurrentUser();
    
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '20px';
    
    const avatars = ['👤', '😀', '😎', '🤓', '🧑‍💻', '👨‍💼', '👩‍💼', '🦸'];
    
    form.innerHTML = `
        <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Name</label>
            <input type="text" id="edit-name" value="${user.name}" class="input" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border, #E5E7EB); border-radius: 8px;">
        </div>
        
        <div>
            <label style="display: block; margin-bottom: 12px; font-weight: 600;">Avatar</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                ${avatars.map(avatar => `
                    <div class="avatar-option ${user.avatar === avatar ? 'selected' : ''}" onclick="selectAvatar('${avatar}', event)" 
                         style="font-size: 40px; padding: 16px; text-align: center; border: 2px solid ${user.avatar === avatar ? 'var(--color-primary, #6366F1)' : 'var(--color-border, #E5E7EB)'}; border-radius: 12px; cursor: pointer; transition: all 0.2s;">
                        ${avatar}
                    </div>
                `).join('')}
            </div>
            <input type="hidden" id="selected-avatar" value="${user.avatar || '👤'}">
        </div>
        
        <button type="submit" class="btn btn-primary btn-large" style="width: 100%; padding: 14px; background: var(--color-primary, #6366F1); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Save Changes
        </button>
    `;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const newName = document.getElementById('edit-name').value;
        const newAvatar = document.getElementById('selected-avatar').value;
        
        updateUserProfile({ name: newName, avatar: newAvatar });
        
        showSuccessToast('Profile Updated!', 'Your changes have been saved');
        
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
        
        renderScreen('profile');
    };
    
    currentModal = createModal('Edit Profile', form, () => {
        currentModal = null;
    });
    
    document.body.appendChild(currentModal);
}

// Select avatar helper
function selectAvatar(emoji, evt) {
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.style.borderColor = 'var(--color-border, #E5E7EB)';
        option.classList.remove('selected');
    });
    
    evt.target.style.borderColor = 'var(--color-primary, #6366F1)';
    evt.target.classList.add('selected');
    
    document.getElementById('selected-avatar').value = emoji;
}

// Logout handler
function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        logoutUser();
        navigateTo('landing');
    }
}

// Get user stats
function getUserStats() {
    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);
    
    // Count total transactions
    const totalTransactions = transactions.length;
    
    // Count days active (unique dates)
    const uniqueDates = new Set(transactions.map(t => new Date(t.date).toDateString()));
    const daysActive = uniqueDates.size;
    
    // Calculate this month spending
    const now = new Date();
    const thisMonth = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && t.transactionType !== 'income';
    }).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Calculate budget used percent
    const budgetUsedPercent = budget.total > 0 ? Math.round((spent.total / budget.total) * 100) : 0;
    
    return {
        totalTransactions,
        daysActive,
        thisMonthSpending: thisMonth,
        budgetUsedPercent
    };
}

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    // Process recurring transactions if user is logged in
    if (isLoggedIn()) {
        const processed = processDueRecurring();
        
        if (processed > 0) {
            setTimeout(() => {
                showInfoToast(
                    'Recurring Transactions',
                    `${processed} transaction${processed === 1 ? '' : 's'} automatically added`
                );
            }, 2000);
        }
        
        // Check and start onboarding
        checkAndStartOnboarding();
    }
    
    setupAuthForms();
    initRouter();
    console.log('✅ App ready with all features!');
});