// ========== MODERN DASHBOARD WITH REAL CHARTS ==========

let spendingChart = null;
let categoryChart = null;
let budgetChart = null;

// Render complete dashboard
function renderModernDashboard() {
    try {
        console.log('📊 Dashboard: renderModernDashboard called');
        
        const container = document.createElement('div');
        container.className = 'dashboard-container';
        
        // Add visible header
        const header = document.createElement('div');
        header.style.marginBottom = 'var(--space-xl)';
        header.innerHTML = `
            <h1 style="margin: 0; font-size: var(--font-size-3xl); color: var(--color-text-primary);">📊 Dashboard</h1>
            <p style="margin: var(--space-sm) 0 0 0; color: var(--color-text-secondary);">Your financial overview</p>
        `;
        container.appendChild(header);
        
        const transactions = getTransactions();
        const budget = getBudget();
        const spent = calculateSpent(transactions);
        
        console.log('📊 Dashboard: Loaded', {
            transactionCount: transactions.length,
            totalSpent: spent.total,
            budget: budget.total
        });
        
        // Dashboard Grid
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid';
        
        // Check if we have data
        if (!transactions || transactions.length === 0 || !budget) {
            console.warn('⚠️ Dashboard: Missing data, showing placeholder');
            const placeholder = document.createElement('div');
            placeholder.style.gridColumn = 'span 12';
            placeholder.style.padding = 'var(--space-xl)';
            placeholder.style.background = 'var(--color-bg-secondary)';
            placeholder.style.borderRadius = 'var(--radius-lg)';
            placeholder.style.textAlign = 'center';
            placeholder.innerHTML = `
                <div style="font-size: var(--font-size-2xl); margin-bottom: var(--space-md);">📊</div>
                <div style="font-size: var(--font-size-lg); font-weight: var(--font-bold); margin-bottom: var(--space-xs);">No transactions yet</div>
                <div style="color: var(--color-text-secondary);">Add your first expense to see analytics here</div>
            `;
            grid.appendChild(placeholder);
            container.appendChild(grid);
            console.log('📊 Dashboard: Created with placeholder');
            return container;
        }
    
    // Row 1: Top 3 Stat Cards
    const monthlySpendCard = createMonthlySpendCard(spent, budget);
    const budgetRemainingCard = createBudgetRemainingCard(spent, budget);
    const savingsGoalCard = createSavingsGoalCard(spent, budget);
    
    monthlySpendCard.className += ' col-span-4';
    budgetRemainingCard.className += ' col-span-4';
    savingsGoalCard.className += ' col-span-4';
    
    grid.appendChild(monthlySpendCard);
    grid.appendChild(budgetRemainingCard);
    grid.appendChild(savingsGoalCard);
    
    // Row 2: Spending Flow Chart (8 cols) + Budget Analysis (4 cols)
    const spendingFlowCard = createSpendingFlowChart(transactions);
    const budgetAnalysisCard = createBudgetAnalysisCard(spent, budget);
    
    spendingFlowCard.className += ' col-span-8';
    budgetAnalysisCard.className += ' col-span-4';
    
    grid.appendChild(spendingFlowCard);
    grid.appendChild(budgetAnalysisCard);
    
    // Row 3: Category Breakdown + Recent Transactions
    const categoryCard = createCategoryBreakdownChart(transactions);
    const recentTransactionsCard = createRecentTransactionsCard(transactions);
    
    categoryCard.className += ' col-span-6';
    recentTransactionsCard.className += ' col-span-6';
    
    grid.appendChild(categoryCard);
    grid.appendChild(recentTransactionsCard);
    
    container.appendChild(grid);
    
    // Add Floating Action Button (Quick Add Expense)
    try {
        const fab = createFloatingActionButton();
        if (fab) {
            container.appendChild(fab);
        }
    } catch (e) {
        console.warn('⚠️ Dashboard: FAB creation failed:', e);
    }
    
    console.log('✅ Dashboard: renderModernDashboard completed successfully');
    return container;
    
} catch (error) {
    console.error('❌ Dashboard rendering error:', error);
    const errorContainer = document.createElement('div');
    errorContainer.style.padding = 'var(--space-xl)';
    errorContainer.style.color = 'var(--color-danger)';
    errorContainer.innerHTML = `
        <h2>❌ Dashboard Error</h2>
        <p>${error.message}</p>
        <pre style="background: var(--color-bg-secondary); padding: var(--space-md); border-radius: var(--radius-md); font-size: 12px; overflow-x: auto;">${error.stack}</pre>
    `;
    return errorContainer;
}
}

// ========== STAT CARDS ==========

// Monthly Spend Card
function createMonthlySpendCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern primary';
    
    const totalSpent = spent.total;
    const percentSpent = (totalSpent / budget.total) * 100;
    const lastMonthSpent = 38500; // Mock data - in real app, calculate from last month
    const change = ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Monthly Spend</div>
            </div>
            <div class="stat-card-icon primary">
                💰
            </div>
        </div>
        <div class="stat-card-value">${formatCurrency(totalSpent)}</div>
        <div class="stat-card-change ${change >= 0 ? 'positive' : 'negative'}">
            <span>${change >= 0 ? '↑' : '↓'}</span>
            <span>${Math.abs(change).toFixed(1)}% vs last month</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar gradient-primary" style="width: ${Math.min(percentSpent, 100)}%"></div>
        </div>
    `;
    
    return card;
}

// Budget Remaining Card
function createBudgetRemainingCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern success';
    
    const remaining = Math.max(budget.total - spent.total, 0);
    const percentRemaining = (remaining / budget.total) * 100;
    
    // Calculate days remaining in month
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = lastDay.getDate() - now.getDate();
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Budget Remaining</div>
            </div>
            <div class="stat-card-icon success">
                💵
            </div>
        </div>
        <div class="stat-card-value">${formatCurrency(remaining)}</div>
        <div class="stat-card-change" style="color: var(--color-text-secondary);">
            <span>📅</span>
            <span>${daysRemaining} days remaining in cycle</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar gradient-success" style="width: ${percentRemaining}%"></div>
        </div>
    `;
    
    return card;
}

// Savings Goal Card
function createSavingsGoalCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern info';
    
    const savingsGoal = budget.savings;
    const currentSavings = spent.savings;
    const percentSaved = (currentSavings / savingsGoal) * 100;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Savings Goal</div>
            </div>
            <div class="stat-card-icon info">
                🎯
            </div>
        </div>
        <div class="stat-card-value">${formatCurrency(currentSavings)}</div>
        <div class="stat-card-change ${percentSaved >= 80 ? 'positive' : ''}">
            <span>${percentSaved >= 80 ? '🎉' : '💪'}</span>
            <span>${percentSaved.toFixed(0)}% of ${formatCurrency(savingsGoal)} goal</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar" style="width: ${Math.min(percentSaved, 100)}%; background: var(--color-info);"></div>
        </div>
    `;
    
    return card;
}

// ========== SPENDING FLOW CHART (Line Chart) ==========

function createSpendingFlowChart(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    const header = document.createElement('div');
    header.className = 'chart-card-header';
    header.innerHTML = `
        <h3 class="chart-card-title">Spending Flow</h3>
        <div class="chart-card-filter">
            <button class="filter-btn active" onclick="updateSpendingChart('7days')">7 Days</button>
            <button class="filter-btn" onclick="updateSpendingChart('30days')">30 Days</button>
            <button class="filter-btn" onclick="updateSpendingChart('90days')">90 Days</button>
        </div>
    `;
    
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '300px';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'spending-flow-chart';
    canvasContainer.appendChild(canvas);
    
    card.appendChild(header);
    card.appendChild(canvasContainer);
    
    // Initialize chart after DOM is added
    setTimeout(() => {
        initSpendingFlowChart(transactions);
    }, 100);
    
    return card;
}

function initSpendingFlowChart(transactions, days = 7) {
    const canvas = document.getElementById('spending-flow-chart');
    if (!canvas) return;
    
    // Destroy existing chart
    if (spendingChart) {
        spendingChart.destroy();
    }
    
    // Get daily spending data
    const dailyData = getSpendingByDay(transactions, days);
    
    const ctx = canvas.getContext('2d');
    spendingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.map(d => d.label),
            datasets: [{
                label: 'Daily Spending',
                data: dailyData.map(d => d.amount),
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#6366F1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
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

function updateSpendingChart(period) {
    // Update button states
    document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Get days
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    
    // Re-initialize chart
    const transactions = getTransactions();
    initSpendingFlowChart(transactions, days);
}

// ========== BUDGET ANALYSIS (Doughnut Chart) ==========

function createBudgetAnalysisCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    const header = document.createElement('div');
    header.className = 'chart-card-header';
    header.innerHTML = `
        <h3 class="chart-card-title">50/30/20 Split</h3>
    `;
    
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '300px';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'budget-analysis-chart';
    canvasContainer.appendChild(canvas);
    
    card.appendChild(header);
    card.appendChild(canvasContainer);
    
    setTimeout(() => {
        initBudgetAnalysisChart(spent, budget);
    }, 100);
    
    return card;
}

function initBudgetAnalysisChart(spent, budget) {
    const canvas = document.getElementById('budget-analysis-chart');
    if (!canvas) return;
    
    if (budgetChart) {
        budgetChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
            datasets: [{
                data: [spent.needs, spent.wants, spent.savings],
                backgroundColor: [
                    '#10B981',
                    '#F59E0B',
                    '#06B6D4'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 12, weight: '500' },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const percentage = ((context.parsed / spent.total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ========== CATEGORY BREAKDOWN (Bar Chart) ==========

function createCategoryBreakdownChart(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    const header = document.createElement('div');
    header.className = 'chart-card-header';
    header.innerHTML = `
        <h3 class="chart-card-title">Category Breakdown</h3>
    `;
    
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '300px';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'category-chart';
    canvasContainer.appendChild(canvas);
    
    card.appendChild(header);
    card.appendChild(canvasContainer);
    
    setTimeout(() => {
        initCategoryChart(transactions);
    }, 100);
    
    return card;
}

function initCategoryChart(transactions) {
    const canvas = document.getElementById('category-chart');
    if (!canvas) return;
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const categoryData = getSpendingByCategory(transactions);
    
    const ctx = canvas.getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryData.map(c => c.category.charAt(0).toUpperCase() + c.category.slice(1)),
            datasets: [{
                label: 'Spending by Category',
                data: categoryData.map(c => c.amount),
                backgroundColor: categoryData.map(c => c.color + '80'),
                borderColor: categoryData.map(c => c.color),
                borderWidth: 2,
                borderRadius: 8
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
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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

// ========== RECENT TRANSACTIONS WITH FILTERS ==========

function createRecentTransactionsCard(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    const header = document.createElement('div');
    header.className = 'chart-card-header';
    header.innerHTML = `
        <h3 class="chart-card-title">Recent Transactions</h3>
        <select class="filter-btn" id="transaction-filter" onchange="filterTransactions()" style="border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-primary); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-md); cursor: pointer;">
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="entertainment">Entertainment</option>
            <option value="savings">Savings</option>
            <option value="other">Other</option>
        </select>
    `;
    
    const listContainer = document.createElement('div');
    listContainer.id = 'filtered-transactions';
    listContainer.className = 'transaction-list';
    listContainer.style.maxHeight = '280px';
    listContainer.style.overflowY = 'auto';
    
    const recentTransactions = transactions.slice(0, 5);
    
    if (recentTransactions.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions yet</p>';
    } else {
        recentTransactions.forEach(transaction => {
            listContainer.appendChild(createTransactionItem(transaction, false));
        });
    }
    
    card.appendChild(header);
    card.appendChild(listContainer);
    
    return card;
}

function filterTransactions() {
    const filter = document.getElementById('transaction-filter').value;
    const container = document.getElementById('filtered-transactions');
    
    if (!container) return;
    
    const transactions = getTransactions();
    const filtered = filter === 'all' 
        ? transactions 
        : transactions.filter(t => t.category === filter);
    
    container.innerHTML = '';
    
    const toShow = filtered.slice(0, 5);
    
    if (toShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions in this category</p>';
    } else {
        toShow.forEach(transaction => {
            container.appendChild(createTransactionItem(transaction, false));
        });
    }
}

// ========== FLOATING ACTION BUTTON ==========

function createFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'quick-actions';
    
    const button = document.createElement('button');
    button.className = 'fab-button';
    button.innerHTML = '+';
    button.onclick = showAddExpenseModal;
    button.title = 'Quick Add Expense';
    
    fab.appendChild(button);
    
    return fab;
}
