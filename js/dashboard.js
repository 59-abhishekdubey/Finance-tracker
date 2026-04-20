// ========== MODERN DASHBOARD ==========
// Clean, simple dashboard with proper error handling

let spendingChart = null;
let categoryChart = null;
let budgetChart = null;

// Main dashboard renderer
function renderModernDashboard() {
    try {
        const container = document.createElement('div');
        container.className = 'dashboard-container';
        
        // Add dashboard header with quick-action buttons
        const headerSection = createDashboardHeader();
        container.appendChild(headerSection);
        
        // Get data safely with fallbacks
        const transactions = getTransactions?.() ?? [];
        const budget = getBudget?.() ?? { total: 15000, needs: 7500, wants: 4500, savings: 3000 };
        const spent = calculateSpent?.(transactions) ?? { total: 0, needs: 0, wants: 0, savings: 0 };
        
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid stagger-children';
        
        // Empty state
        if (!transactions?.length) {
            const empty = document.createElement('div');
            empty.style.cssText = 'grid-column: span 12; padding: var(--space-xl); background: var(--color-bg-secondary); border-radius: var(--radius-lg); text-align: center;';
            empty.innerHTML = '<div style="font-size: 2rem; margin-bottom: 16px;">📊</div><div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">No transactions yet</div><div style="color: var(--color-text-secondary);">Add your first expense to see analytics</div>';
            grid.appendChild(empty);
            container.appendChild(grid);
            return container;
        }
        
        // Row 1: Stat Cards
        try {
            [createMonthlySpendCard(spent, budget), createBudgetRemainingCard(spent, budget), createSavingsGoalCard(spent, budget)]
                .forEach(card => { card.className += ' col-span-4'; grid.appendChild(card); });
        } catch (e) {
            console.error('Stat cards error:', e);
        }
        
        // Row 2: Charts
        try {
            const spendingCard = createSpendingFlowChart(transactions);
            const recentCard = createRecentTransactionsCard(transactions);
            spendingCard.className += ' col-span-6';
            recentCard.className += ' col-span-6';
            grid.appendChild(spendingCard);
            grid.appendChild(recentCard);
        } catch (e) {
            console.error('Chart cards error:', e);
        }
        
        // Row 3: Category & Budget
        try {
            const categoryCard = createCategoryBreakdownChart(transactions);
            const budgetCard = createBudgetAnalysisCard(spent, budget);
            categoryCard.className += ' col-span-6';
            budgetCard.className += ' col-span-6';
            grid.appendChild(categoryCard);
            grid.appendChild(budgetCard);
        } catch (e) {
            console.error('Category/Budget card error:', e);
        }
        
        container.appendChild(grid);
        return container;
    } catch (error) {
        console.error('Dashboard error:', error);
        const err = document.createElement('div');
        err.style.cssText = 'padding: 2rem; color: #EF4444;';
        err.innerHTML = `<h2>Dashboard Error: ${error.message}</h2>`;
        return err;
    }
}

// ========== DASHBOARD HEADER WITH QUICK ACTIONS ==========

function createDashboardHeader() {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'dashboard-header-quick-actions';
    headerDiv.style.cssText = `
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border, #E5E7EB);
    `;
    
    // Income Toggle Button
    const incomeBtn = document.createElement('button');
    incomeBtn.className = 'quick-action-btn income-btn';
    incomeBtn.style.cssText = `
        flex: 1;
        padding: 12px 16px;
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    `;
    incomeBtn.innerHTML = '💵 Income';
    incomeBtn.onmouseover = () => incomeBtn.style.transform = 'translateY(-2px)';
    incomeBtn.onmouseout = () => incomeBtn.style.transform = 'translateY(0)';
    incomeBtn.onclick = () => {
        console.log('📊 Navigating to Income screen...');
        navigateTo('income');
    };
    
    // Add Expense Button
    const expenseBtn = document.createElement('button');
    expenseBtn.className = 'quick-action-btn expense-btn';
    expenseBtn.style.cssText = `
        flex: 1;
        padding: 12px 16px;
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    `;
    expenseBtn.innerHTML = '💸 Add Expense';
    expenseBtn.onmouseover = () => expenseBtn.style.transform = 'translateY(-2px)';
    expenseBtn.onmouseout = () => expenseBtn.style.transform = 'translateY(0)';
    expenseBtn.onclick = () => {
        console.log('📝 Opening Add Expense modal...');
        if (typeof showAddExpenseModal === 'function') {
            showAddExpenseModal();
        } else {
            console.warn('⚠️ showAddExpenseModal function not found');
        }
    };
    
    headerDiv.appendChild(incomeBtn);
    headerDiv.appendChild(expenseBtn);
    
    return headerDiv;
}

// ========== STAT CARDS ==========

function createMonthlySpendCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern primary';
    
    const totalSpent = spent?.total ?? 0;
    const pct = ((totalSpent / budget.total) * 100).toFixed(1);
    const fmt = formatCurrency?.(totalSpent) ?? '₹' + totalSpent;
    const budgetFmt = formatCurrency?.(budget.total) ?? '₹' + budget.total;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Monthly Spend</div>
            </div>
            <div class="stat-card-icon primary">💰</div>
        </div>
        <div class="stat-card-value">${fmt}</div>
        <div class="stat-card-change">
            <span>📊</span>
            <span>${pct}% of ${budgetFmt}</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar gradient-primary" style="width: ${Math.min(pct, 100)}%"></div>
        </div>
    `;
    return card;
}

function createBudgetRemainingCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern success';
    
    const remaining = Math.max((budget?.total ?? 0) - (spent?.total ?? 0), 0);
    const pct = (((remaining) / (budget?.total ?? 1)) * 100).toFixed(1);
    const fmt = formatCurrency?.(remaining) ?? '₹' + remaining;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Budget Remaining</div>
            </div>
            <div class="stat-card-icon success">💵</div>
        </div>
        <div class="stat-card-value">${fmt}</div>
        <div class="stat-card-change" style="color: var(--color-text-secondary);">
            <span>📅</span>
            <span>Days left in cycle</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar gradient-success" style="width: ${pct}%"></div>
        </div>
    `;
    return card;
}

function createSavingsGoalCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern info';
    
    const savingsGoal = budget?.savings ?? 0;
    const saved = spent?.savings ?? 0;
    const pct = savingsGoal > 0 ? ((saved / savingsGoal) * 100).toFixed(1) : 0;
    const fmt = formatCurrency?.(saved) ?? '₹' + saved;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Savings Goal</div>
            </div>
            <div class="stat-card-icon info">🎯</div>
        </div>
        <div class="stat-card-value">${fmt}</div>
        <div class="stat-card-change">
            <span>${pct >= 80 ? '🎉' : '💪'}</span>
            <span>${pct}% of goal</span>
        </div>
        <div class="stat-card-progress">
            <div class="stat-card-progress-bar" style="width: ${Math.min(pct, 100)}%; background: var(--color-info);"></div>
        </div>
    `;
    return card;
}

// ========== SPENDING CHART ==========

function createSpendingFlowChart(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    card.innerHTML = `
        <div class="chart-card-header">
            <h3 class="chart-card-title">Spending Flow</h3>
            <div class="chart-card-filter">
                <button class="filter-btn active" onclick="updateSpendingChart(event, '7days')">7 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart(event, '30days')">30 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart(event, '90days')">90 Days</button>
            </div>
        </div>
        <div style="position: relative; height: 300px;">
            <canvas id="spending-flow-chart"></canvas>
        </div>
    `;
    
    setTimeout(() => initSpendingFlowChart(transactions), 100);
    return card;
}

function initSpendingFlowChart(transactions, days = 7) {
    try {
        const canvas = document.getElementById('spending-flow-chart');
        if (!canvas || typeof getSpendingByDay !== 'function') return;
        
        if (spendingChart) spendingChart.destroy();
        
        const dailyData = getSpendingByDay?.(transactions, days) ?? [];
        const ctx = canvas.getContext('2d');
        
        spendingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.map(d => d.label ?? 'Day'),
                datasets: [{
                    label: 'Daily Spending',
                    data: dailyData.map(d => d.amount ?? 0),
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#6366F1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (e) {
        console.error('Spending chart error:', e);
    }
}

function updateSpendingChart(evt, period) {
    try {
        document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
        if (evt?.target) evt.target.classList.add('active');
        let days;
        if (period === '7days') {
            days = 7;
        } else if (period === '30days') {
            days = 30;
        } else {
            days = 90;
        }
        
        const transactions = getTransactions?.() ?? [];
        initSpendingFlowChart(transactions, days);
    } catch (e) {
        console.error('Update spending error:', e);
    }
}

// ========== CATEGORY CHART ==========

function createCategoryBreakdownChart(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    card.innerHTML = `
        <div class="chart-card-header">
            <h3 class="chart-card-title">Category Breakdown</h3>
        </div>
        <div style="position: relative; height: 300px;">
            <canvas id="category-chart"></canvas>
        </div>
    `;
    
    setTimeout(() => initCategoryChart(transactions), 100);
    return card;
}

function initCategoryChart(transactions) {
    try {
        const canvas = document.getElementById('category-chart');
        if (!canvas || typeof getSpendingByCategory !== 'function') return;
        
        if (categoryChart) categoryChart.destroy();
        
        const categoryData = getSpendingByCategory?.(transactions) ?? [];
        const ctx = canvas.getContext('2d');
        
        categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryData.map(c => (c.category ?? 'Other').charAt(0).toUpperCase() + (c.category ?? 'Other').slice(1)),
                datasets: [{
                    label: 'Spending',
                    data: categoryData.map(c => c.amount ?? 0),
                    backgroundColor: categoryData.map(c => (c.color ?? '#6366F1') + '80'),
                    borderColor: categoryData.map(c => c.color ?? '#6366F1'),
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (e) {
        console.error('Category chart error:', e);
    }
}

// ========== BUDGET DOUGHNUT ==========

function createBudgetAnalysisCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    card.innerHTML = `
        <div class="chart-card-header">
            <h3 class="chart-card-title">50/30/20 Split</h3>
        </div>
        <div style="position: relative; height: 300px;">
            <canvas id="budget-analysis-chart"></canvas>
        </div>
    `;
    
    setTimeout(() => initBudgetChart(spent, budget), 100);
    return card;
}

function initBudgetChart(spent, budget) {
    try {
        const canvas = document.getElementById('budget-analysis-chart');
        if (!canvas) return;
        
        if (budgetChart) budgetChart.destroy();
        
        const ctx = canvas.getContext('2d');
        budgetChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
                datasets: [{
                    data: [spent?.needs ?? 0, spent?.wants ?? 0, spent?.savings ?? 0],
                    backgroundColor: ['#10B981', '#F59E0B', '#06B6D4'],
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
                        labels: { padding: 20, font: { size: 12, weight: '500' } }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Budget chart error:', e);
    }
}

// ========== RECENT TRANSACTIONS ==========

function createRecentTransactionsCard(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    let listHtml = '<div id="filtered-transactions" class="transaction-list" style="max-height: 300px; overflow-y: auto;">';
    
    if (transactions?.length) {
        transactions.slice(0, 10).forEach(t => {
            const icon = t.category === 'income' ? '💰' : '📍';
            const fmt = formatCurrency?.(t.amount) ?? '₹' + t.amount;
            const color = t.type === 'income' ? '#10B981' : '#EF4444';
            const sign = t.type === 'income' ? '+' : '-';
            listHtml += `<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); border-bottom: 1px solid var(--color-border);"><div><div style="font-weight: 500;">${icon} ${t.name ?? 'Transaction'}</div><div style="font-size: 0.875rem; color: var(--color-text-secondary);">${t.date ?? 'Today'}</div></div><div style="font-weight: 600; color: ${color};">${sign}${fmt}</div></div>`;
        });
    } else {
        listHtml += '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions</p>';
    }
    
    listHtml += '</div>';
    card.innerHTML = `<div class="chart-card-header"><h3 class="chart-card-title">Recent Transactions</h3></div>${listHtml}`;
    return card;
}

// ========== EXPORT FOR GLOBAL USE ==========
globalThis.renderModernDashboard = renderModernDashboard;
globalThis.initSpendingFlowChart = initSpendingFlowChart;
globalThis.updateSpendingChart = updateSpendingChart;