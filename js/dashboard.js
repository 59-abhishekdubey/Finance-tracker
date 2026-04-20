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
                <button class="filter-btn active" onclick="updateSpendingChart('7days')">7 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('30days')">30 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('90days')">90 Days</button>
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

function updateSpendingChart(period) {
    try {
        document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
        event?.target?.classList.add('active');
        const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
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
    
    if (!transactions?.length) {
        listHtml += '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions</p>';
    } else {
        transactions.slice(0, 10).forEach(t => {
            const icon = t.category === 'income' ? '💰' : '📍';
            const fmt = formatCurrency?.(t.amount) ?? '₹' + t.amount;
            const color = t.type === 'income' ? '#10B981' : '#EF4444';
            const sign = t.type === 'income' ? '+' : '-';
            listHtml += `<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); border-bottom: 1px solid var(--color-border);"><div><div style="font-weight: 500;">${icon} ${t.name ?? 'Transaction'}</div><div style="font-size: 0.875rem; color: var(--color-text-secondary);">${t.date ?? 'Today'}</div></div><div style="font-weight: 600; color: ${color};">${sign}${fmt}</div></div>`;
        });
    }
    
    listHtml += '</div>';
    card.innerHTML = `<div class="chart-card-header"><h3 class="chart-card-title">Recent Transactions</h3></div>${listHtml}`;
    return card;
}

// ========== EXPORT FOR GLOBAL USE ==========
globalThis.renderModernDashboard = renderModernDashboard;
globalThis.initSpendingFlowChart = initSpendingFlowChart;
globalThis.updateSpendingChart = updateSpendingChart;
// ========== MODERN DASHBOARD ==========

let spendingChart = null;
let categoryChart = null;
let budgetChart = null;

// Main dashboard renderer
function renderModernDashboard() {
    try {
        console.log('📊 Dashboard: Rendering dashboard...');
        
        const container = document.createElement('div');
        container.className = 'dashboard-container';
        
        // Get data safely
        let transactions = [];
        let budget = { total: 15000, needs: 7500, wants: 4500, savings: 3000 };
        
        try {
            transactions = getTransactions ? getTransactions() : [];
            budget = getBudget ? getBudget() : budget;
        } catch (e) {
            console.warn('⚠️ Dashboard: Could not load data:', e);
        }
        
        console.log('📊 Dashboard: Loaded', transactions.length, 'transactions');
        
        const spent = calculateSpent ? calculateSpent(transactions) : { total: 0, needs: 0, wants: 0, savings: 0 };
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid stagger-children';
        
        // Check for empty state
        if (!transactions || transactions.length === 0) {
            const empty = document.createElement('div');
            empty.style.gridColumn = 'span 12';
            empty.style.padding = 'var(--space-xl)';
            empty.style.background = 'var(--color-bg-secondary)';
            empty.style.borderRadius = 'var(--radius-lg)';
            empty.style.textAlign = 'center';
            empty.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 16px;">📊</div>
                <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">No transactions yet</div>
                <div style="color: var(--color-text-secondary);">Add your first expense to see analytics</div>
            `;
            grid.appendChild(empty);
            container.appendChild(grid);
            return container;
        }
        
        // Row 1: Stat Cards
        try {
            const card1 = createMonthlySpendCard(spent, budget);
            const card2 = createBudgetRemainingCard(spent, budget);
            const card3 = createSavingsGoalCard(spent, budget);
            
            card1.className += ' col-span-4';
            card2.className += ' col-span-4';
            card3.className += ' col-span-4';
            
            grid.appendChild(card1);
            grid.appendChild(card2);
            grid.appendChild(card3);
        } catch (e) {
            console.error('❌ Dashboard: Stat cards error:', e);
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
            console.error('❌ Dashboard: Chart cards error:', e);
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
            console.error('❌ Dashboard: Category/Budget card error:', e);
        }
        
        container.appendChild(grid);
        console.log('✅ Dashboard: Render complete');
        return container;
        
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        const err = document.createElement('div');
        err.style.padding = '2rem';
        err.style.color = '#EF4444';
        err.innerHTML = `<h2>Dashboard Error: ${error.message}</h2>`;
        return err;
    }
}

// ========== STAT CARDS ==========

function createMonthlySpendCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern primary';
    
    const totalSpent = spent.total || 0;
    const pct = ((totalSpent / budget.total) * 100).toFixed(1);
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(totalSpent) : '₹' + totalSpent;
    
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
            <span>${pct}% of ${typeof formatCurrency === 'function' ? formatCurrency(budget.total) : '₹' + budget.total}</span>
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
    
    const remaining = Math.max(budget.total - spent.total, 0);
    const pct = ((remaining / budget.total) * 100).toFixed(1);
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(remaining) : '₹' + remaining;
    
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
    
    const savingsGoal = budget.savings || 0;
    const saved = spent.savings || 0;
    const pct = savingsGoal > 0 ? ((saved / savingsGoal) * 100).toFixed(1) : 0;
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(saved) : '₹' + saved;
    
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
                <button class="filter-btn active" onclick="updateSpendingChart('7days')">7 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('30days')">30 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('90days')">90 Days</button>
            </div>
        </div>
        <div style="position: relative; height: 300px;">
            <canvas id="spending-flow-chart"></canvas>
        </div>
    `;
    
    setTimeout(() => {
        try {
            initSpendingFlowChart(transactions);
        } catch (e) {
            console.error('❌ Spending chart error:', e);
        }
    }, 100);
    
    return card;
}

function initSpendingFlowChart(transactions, days = 7) {
    try {
        const canvas = document.getElementById('spending-flow-chart');
        if (!canvas) return;
        
        if (spendingChart) spendingChart.destroy();
        
        if (typeof getSpendingByDay !== 'function') {
            console.warn('⚠️ getSpendingByDay not available');
            return;
        }
        
        const dailyData = getSpendingByDay(transactions, days);
        const ctx = canvas.getContext('2d');
        
        spendingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.map(d => d.label || 'Day'),
                datasets: [{
                    label: 'Daily Spending',
                    data: dailyData.map(d => d.amount || 0),
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
        console.error('❌ initSpendingFlowChart error:', e);
    }
}

function updateSpendingChart(period) {
    try {
        document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
        const target = event?.target || document.activeElement;
        if (target) target.classList.add('active');
        const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
        const transactions = typeof getTransactions === 'function' ? getTransactions() : [];
        initSpendingFlowChart(transactions, days);
    } catch (e) {
        console.error('❌ updateSpendingChart error:', e);
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
    
    setTimeout(() => {
        try {
            initCategoryChart(transactions);
        } catch (e) {
            console.error('❌ Category chart error:', e);
        }
    }, 100);
    
    return card;
}

function initCategoryChart(transactions) {
    try {
        const canvas = document.getElementById('category-chart');
        if (!canvas) return;
        
        if (categoryChart) categoryChart.destroy();
        
        if (typeof getSpendingByCategory !== 'function') {
            console.warn('⚠️ getSpendingByCategory not available');
            return;
        }
        
        const categoryData = getSpendingByCategory(transactions) || [];
        const ctx = canvas.getContext('2d');
        
        categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryData.map(c => (c.category || 'Other').charAt(0).toUpperCase() + (c.category || 'Other').slice(1)),
                datasets: [{
                    label: 'Spending',
                    data: categoryData.map(c => c.amount || 0),
                    backgroundColor: categoryData.map(c => (c.color || '#6366F1') + '80'),
                    borderColor: categoryData.map(c => c.color || '#6366F1'),
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
        console.error('❌ initCategoryChart error:', e);
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
    
    setTimeout(() => {
        try {
            initBudgetChart(spent, budget);
        } catch (e) {
            console.error('❌ Budget chart error:', e);
        }
    }, 100);
    
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
                    data: [spent.needs || 0, spent.wants || 0, spent.savings || 0],
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
        console.error('❌ initBudgetChart error:', e);
    }
}

// ========== RECENT TRANSACTIONS ==========

function createRecentTransactionsCard(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    let listHtml = '<div id="filtered-transactions" class="transaction-list" style="max-height: 300px; overflow-y: auto;">';
    
    if (!transactions || transactions.length === 0) {
        listHtml += '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions</p>';
    } else {
        const recent = transactions.slice(0, 10);
        recent.forEach(t => {
            const icon = t.category === 'income' ? '💰' : '📍';
            const fmt = typeof formatCurrency === 'function' ? formatCurrency(t.amount) : '₹' + t.amount;
            listHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); border-bottom: 1px solid var(--color-border);">
                    <div>
                        <div style="font-weight: 500;">${icon} ${t.name || 'Transaction'}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${t.date || 'Today'}</div>
                    </div>
                    <div style="font-weight: 600; color: ${t.type === 'income' ? '#10B981' : '#EF4444'};">${t.type === 'income' ? '+' : '-'}${fmt}</div>
                </div>
            `;
        });
    }
    
    listHtml += '</div>';
    
    card.innerHTML = `
        <div class="chart-card-header">
            <h3 class="chart-card-title">Recent Transactions</h3>
        </div>
        ${listHtml}
    `;
    
    return card;
}

// ========== EXPORT FOR GLOBAL USE ==========

globalThis.renderModernDashboard = renderModernDashboard;
globalThis.initSpendingFlowChart = initSpendingFlowChart;
globalThis.updateSpendingChart = updateSpendingChart;
// ========== MODERN DASHBOARD ==========

let spendingChart = null;
let categoryChart = null;
let budgetChart = null;

// Main dashboard renderer
function renderModernDashboard() {
    try {
        console.log('📊 Dashboard: Rendering dashboard...');
        
        const container = document.createElement('div');
        container.className = 'dashboard-container';
        
        // Get data safely
        let transactions = [];
        let budget = { total: 15000, needs: 7500, wants: 4500, savings: 3000 };
        
        try {
            transactions = getTransactions ? getTransactions() : [];
            budget = getBudget ? getBudget() : budget;
        } catch (e) {
            console.warn('⚠️ Dashboard: Could not load data:', e);
        }
        
        console.log('📊 Dashboard: Loaded', transactions.length, 'transactions');
        
        const spent = calculateSpent ? calculateSpent(transactions) : { total: 0, needs: 0, wants: 0, savings: 0 };
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid stagger-children';
        
        // Check for empty state
        if (!transactions || transactions.length === 0) {
            const empty = document.createElement('div');
            empty.style.gridColumn = 'span 12';
            empty.style.padding = 'var(--space-xl)';
            empty.style.background = 'var(--color-bg-secondary)';
            empty.style.borderRadius = 'var(--radius-lg)';
            empty.style.textAlign = 'center';
            empty.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 16px;">📊</div>
                <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">No transactions yet</div>
                <div style="color: var(--color-text-secondary);">Add your first expense to see analytics</div>
            `;
            grid.appendChild(empty);
            container.appendChild(grid);
            return container;
        }
        
        // Row 1: Stat Cards
        try {
            const card1 = createMonthlySpendCard(spent, budget);
            const card2 = createBudgetRemainingCard(spent, budget);
            const card3 = createSavingsGoalCard(spent, budget);
            
            card1.className += ' col-span-4';
            card2.className += ' col-span-4';
            card3.className += ' col-span-4';
            
            grid.appendChild(card1);
            grid.appendChild(card2);
            grid.appendChild(card3);
        } catch (e) {
            console.error('❌ Dashboard: Stat cards error:', e);
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
            console.error('❌ Dashboard: Chart cards error:', e);
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
            console.error('❌ Dashboard: Category/Budget card error:', e);
        }
        
        container.appendChild(grid);
        console.log('✅ Dashboard: Render complete');
        return container;
        
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        const err = document.createElement('div');
        err.style.padding = '2rem';
        err.style.color = '#EF4444';
        err.innerHTML = `<h2>Dashboard Error: ${error.message}</h2>`;
        return err;
    }
}

// ========== STAT CARDS ==========

function createMonthlySpendCard(spent, budget) {
    const card = document.createElement('div');
    card.className = 'stat-card-modern primary';
    
    const totalSpent = spent.total || 0;
    const pct = ((totalSpent / budget.total) * 100).toFixed(1);
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(totalSpent) : '₹' + totalSpent;
    
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
            <span>${pct}% of ${typeof formatCurrency === 'function' ? formatCurrency(budget.total) : '₹' + budget.total}</span>
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
    
    const remaining = Math.max(budget.total - spent.total, 0);
    const pct = ((remaining / budget.total) * 100).toFixed(1);
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(remaining) : '₹' + remaining;
    
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
    
    const savingsGoal = budget.savings || 0;
    const saved = spent.savings || 0;
    const pct = savingsGoal > 0 ? ((saved / savingsGoal) * 100).toFixed(1) : 0;
    const fmt = typeof formatCurrency === 'function' ? formatCurrency(saved) : '₹' + saved;
    
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
                <button class="filter-btn active" onclick="updateSpendingChart('7days')">7 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('30days')">30 Days</button>
                <button class="filter-btn" onclick="updateSpendingChart('90days')">90 Days</button>
            </div>
        </div>
        <div style="position: relative; height: 300px;">
            <canvas id="spending-flow-chart"></canvas>
        </div>
    `;
    
    setTimeout(() => {
        try {
            initSpendingFlowChart(transactions);
        } catch (e) {
            console.error('❌ Spending chart error:', e);
        }
    }, 100);
    
    return card;
}

function initSpendingFlowChart(transactions, days = 7) {
    try {
        const canvas = document.getElementById('spending-flow-chart');
        if (!canvas) return;
        
        if (spendingChart) spendingChart.destroy();
        
        if (typeof getSpendingByDay !== 'function') {
            console.warn('⚠️ getSpendingByDay not available');
            return;
        }
        
        const dailyData = getSpendingByDay(transactions, days);
        const ctx = canvas.getContext('2d');
        
        spendingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.map(d => d.label || 'Day'),
                datasets: [{
                    label: 'Daily Spending',
                    data: dailyData.map(d => d.amount || 0),
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
        console.error('❌ initSpendingFlowChart error:', e);
    }
}

function updateSpendingChart(period) {
    try {
        document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
        const transactions = typeof getTransactions === 'function' ? getTransactions() : [];
        initSpendingFlowChart(transactions, days);
    } catch (e) {
        console.error('❌ updateSpendingChart error:', e);
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
    
    setTimeout(() => {
        try {
            initCategoryChart(transactions);
        } catch (e) {
            console.error('❌ Category chart error:', e);
        }
    }, 100);
    
    return card;
}

function initCategoryChart(transactions) {
    try {
        const canvas = document.getElementById('category-chart');
        if (!canvas) return;
        
        if (categoryChart) categoryChart.destroy();
        
        if (typeof getSpendingByCategory !== 'function') {
            console.warn('⚠️ getSpendingByCategory not available');
            return;
        }
        
        const categoryData = getSpendingByCategory(transactions) || [];
        const ctx = canvas.getContext('2d');
        
        categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryData.map(c => (c.category || 'Other').charAt(0).toUpperCase() + (c.category || 'Other').slice(1)),
                datasets: [{
                    label: 'Spending',
                    data: categoryData.map(c => c.amount || 0),
                    backgroundColor: categoryData.map(c => (c.color || '#6366F1') + '80'),
                    borderColor: categoryData.map(c => c.color || '#6366F1'),
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
        console.error('❌ initCategoryChart error:', e);
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
    
    setTimeout(() => {
        try {
            initBudgetChart(spent, budget);
        } catch (e) {
            console.error('❌ Budget chart error:', e);
        }
    }, 100);
    
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
                    data: [spent.needs || 0, spent.wants || 0, spent.savings || 0],
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
        console.error('❌ initBudgetChart error:', e);
    }
}

// ========== RECENT TRANSACTIONS ==========

function createRecentTransactionsCard(transactions) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    let listHtml = '<div id="filtered-transactions" class="transaction-list" style="max-height: 300px; overflow-y: auto;">';
    
    if (!transactions || transactions.length === 0) {
        listHtml += '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions</p>';
    } else {
        const recent = transactions.slice(0, 10);
        recent.forEach(t => {
            const icon = t.category === 'income' ? '💰' : '📍';
            const fmt = typeof formatCurrency === 'function' ? formatCurrency(t.amount) : '₹' + t.amount;
            listHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); border-bottom: 1px solid var(--color-border);">
                    <div>
                        <div style="font-weight: 500;">${icon} ${t.name || 'Transaction'}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${t.date || 'Today'}</div>
                    </div>
                    <div style="font-weight: 600; color: ${t.type === 'income' ? '#10B981' : '#EF4444'};">${t.type === 'income' ? '+' : '-'}${fmt}</div>
                </div>
            `;
        });
    }
    
    listHtml += '</div>';
    
    card.innerHTML = `
        <div class="chart-card-header">
            <h3 class="chart-card-title">Recent Transactions</h3>
        </div>
        ${listHtml}
    `;
    
    return card;
}

// ========== EXPORT FOR GLOBAL USE ==========

globalThis.renderModernDashboard = renderModernDashboard;
globalThis.initSpendingFlowChart = initSpendingFlowChart;
globalThis.updateSpendingChart = updateSpendingChart;
        container.className = 'dashboard-container';
        
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
        grid.className = 'dashboard-grid stagger-children';
        
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
        
        // Row 2: Spending Flow Chart (6 cols) + Recent Transactions (6 cols)
        const spendingFlowCard = createSpendingFlowChart(transactions);
        const recentTransactionsCard = createRecentTransactionsCard(transactions);
        
        spendingFlowCard.className += ' col-span-6';
        recentTransactionsCard.className += ' col-span-6';
        
        grid.appendChild(spendingFlowCard);
        grid.appendChild(recentTransactionsCard);
        
        // Row 3: Category Breakdown + Budget Analysis
        const categoryCard = createCategoryBreakdownChart(transactions);
        const budgetAnalysisCard = createBudgetAnalysisCard(spent, budget);
        
        categoryCard.className += ' col-span-6';
        budgetAnalysisCard.className += ' col-span-6';
        
        grid.appendChild(categoryCard);
        grid.appendChild(budgetAnalysisCard);
        
        container.appendChild(grid);
        
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
    const lastMonthSpent = 38500;
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
    
    setTimeout(() => {
        initSpendingFlowChart(transactions);
    }, 100);
    
    return card;
}

function initSpendingFlowChart(transactions, days = 7) {
    const canvas = document.getElementById('spending-flow-chart');
    if (!canvas) return;
    
    if (spendingChart) {
        spendingChart.destroy();
    }
    
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
    document.querySelectorAll('.chart-card-filter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const transactions = getTransactions();
    initSpendingFlowChart(transactions, days);
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
    
    // Use existing function from analytics.js that already has colors
    const categoryData = getSpendingByCategory(transactions) || [];
    
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

// ========== RECENT TRANSACTIONS ==========

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
            <option value="income">Income</option>
            <option value="other">Other</option>
        </select>
    `;
    
    const listContainer = document.createElement('div');
    listContainer.id = 'filtered-transactions';
    listContainer.className = 'transaction-list';
    listContainer.style.maxHeight = '300px';
    listContainer.style.overflowY = 'auto';
    
    const recentTransactions = transactions.slice(0, 10);
    
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
    
    const toShow = filtered.slice(0, 10);
    
    if (toShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No transactions in this category</p>';
    } else {
        toShow.forEach(transaction => {
            container.appendChild(createTransactionItem(transaction, false));
        });
    }
}

// ========== HELPER FUNCTIONS ==========

// All helper functions are defined in utils.js and analytics.js
// Using existing functions: getCategoryColor(), getSpendingByCategory(), etc.

// Get day name from date string
function getDayNameFromDateStr(dateStr) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateStr);
    return days[date.getDay()];
}

// ========== INITIALIZATION ==========

// Initialize dashboard
function initDashboard() {
    console.log('📊 Dashboard: Initializing...');
    try {
        console.log('✅ Dashboard: Initialization complete');
    } catch (error) {
        console.error('❌ Dashboard: Initialization failed:', error);
    }
}

// Call init on load
initDashboard();
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
        grid.className = 'dashboard-grid stagger-children';
        
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

// ========== INCOME VS EXPENSE CARD ==========

function createIncomeExpenseCard() {
    const card = document.createElement('div');
    card.className = 'stat-card-modern primary';
    
    // Track transactions with income type
    const totalIncome = calculateTotalIncome();
    const totalExpense = calculateSpent(getTransactions()).total;
    const netIncome = totalIncome - totalExpense;
    
    card.innerHTML = `
        <div class="stat-card-header">
            <div>
                <div class="stat-card-title">Income vs Expense</div>
            </div>
            <div class="stat-card-icon primary">
                📈
            </div>
        </div>
        <div class="stat-card-value" style="font-size: var(--font-size-4xl); margin: var(--space-lg) 0;">
            ${formatCurrency(netIncome)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-top: var(--space-lg);">
            <div style="padding: var(--space-md); background: var(--color-bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">💰 Income</div>
                <div style="font-size: var(--font-size-2xl); font-weight: var(--font-bold); color: #10B981;">
                    ${formatCurrency(totalIncome)}
                </div>
            </div>
            <div style="padding: var(--space-md); background: var(--color-bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">💸 Expense</div>
                <div style="font-size: var(--font-size-2xl); font-weight: var(--font-bold); color: #EF4444;">
                    ${formatCurrency(totalExpense)}
                </div>
            </div>
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

// ========== INCOME VS EXPENSE CHART ==========

function createIncomeExpenseChart() {
    const card = document.createElement('div');
    card.className = 'chart-card';
    
    const header = document.createElement('div');
    header.className = 'chart-card-header';
    header.innerHTML = `
        <h3 class="chart-card-title">Income vs Expense Comparison</h3>
        <div class="chart-card-filter">
            <button class="filter-btn active" onclick="updateIncomeExpenseChart('7days')">7 Days</button>
            <button class="filter-btn" onclick="updateIncomeExpenseChart('30days')">30 Days</button>
            <button class="filter-btn" onclick="updateIncomeExpenseChart('90days')">90 Days</button>
        </div>
    `;
    
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '300px';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'income-expense-chart';
    canvasContainer.appendChild(canvas);
    
    card.appendChild(header);
    card.appendChild(canvasContainer);
    
    setTimeout(() => {
        initIncomeExpenseChart(7);
    }, 100);
    
    return card;
}

function initIncomeExpenseChart(days = 7) {
    const canvas = document.getElementById('income-expense-chart');
    if (!canvas) return;
    
    const allTransactions = getTransactions();
    const lastNDays = getLastNDays(days);
    
    // Group transactions by date
    const incomeByDate = {};
    const expenseByDate = {};
    
    lastNDays.forEach(date => {
        incomeByDate[date] = 0;
        expenseByDate[date] = 0;
    });
    
    // Filter and sum transactions
    allTransactions.forEach(transaction => {
        if (lastNDays.includes(transaction.date)) {
            if (transaction.transactionType === 'income' || transaction.type === 'income') {
                incomeByDate[transaction.date] += transaction.amount;
            } else if (transaction.transactionType === 'expense' || transaction.type === 'expense') {
                expenseByDate[transaction.date] += transaction.amount;
            }
        }
    });
    
    // Destroy previous chart
    if (window.incomeExpenseChartInstance) {
        window.incomeExpenseChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    window.incomeExpenseChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lastNDays.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            }),
            datasets: [
                {
                    label: 'Income',
                    data: lastNDays.map(date => incomeByDate[date]),
                    backgroundColor: '#10B98180',
                    borderColor: '#10B981',
                    borderWidth: 2,
                    borderRadius: 6,
                    order: 2
                },
                {
                    label: 'Expense',
                    data: lastNDays.map(date => expenseByDate[date]),
                    backgroundColor: '#EF444480',
                    borderColor: '#EF4444',
                    borderWidth: 2,
                    borderRadius: 6,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: 'var(--color-text-primary)',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
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

function updateIncomeExpenseChart(period) {
    let days = 7;
    if (period === '30days') days = 30;
    if (period === '90days') days = 90;
    
    initIncomeExpenseChart(days);
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
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';
    fabContainer.id = 'fab-container';
    
    // Main FAB button
    const fabButton = document.createElement('button');
    fabButton.className = 'fab-button';
    fabButton.id = 'fab-button';
    fabButton.innerHTML = '➕';
    fabButton.title = 'Add Transaction';
    fabButton.onclick = toggleFABMenu;
    
    // FAB Menu
    const fabMenu = document.createElement('div');
    fabMenu.className = 'fab-menu';
    fabMenu.id = 'fab-menu';
    
    // Income option
    const incomeOption = document.createElement('button');
    incomeOption.className = 'fab-menu-item income';
    incomeOption.innerHTML = '💰 Income';
    incomeOption.title = 'Add Income';
    incomeOption.onclick = (e) => {
        e.stopPropagation();
        closeFABMenu();
        showAddIncomeModal();
    };
    
    // Expense option
    const expenseOption = document.createElement('button');
    expenseOption.className = 'fab-menu-item expense';
    expenseOption.innerHTML = '💸 Expense';
    expenseOption.title = 'Add Expense';
    expenseOption.onclick = (e) => {
        e.stopPropagation();
        closeFABMenu();
        showAddExpenseModal();
    };
    
    fabMenu.appendChild(incomeOption);
    fabMenu.appendChild(expenseOption);
    
    fabContainer.appendChild(fabButton);
    fabContainer.appendChild(fabMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabContainer.contains(e.target) && e.target !== fabButton) {
            closeFABMenu();
        }
    }, true);
    
    return fabContainer;
}

// Toggle FAB menu visibility
function toggleFABMenu() {
    const fabMenu = document.getElementById('fab-menu');
    const fabButton = document.getElementById('fab-button');
    
    if (fabMenu && fabButton) {
        fabMenu.classList.toggle('active');
        fabButton.classList.toggle('active');
    }
}

// Close FAB menu
function closeFABMenu() {
    const fabMenu = document.getElementById('fab-menu');
    const fabButton = document.getElementById('fab-button');
    
    if (fabMenu && fabButton) {
        fabMenu.classList.remove('active');
        fabButton.classList.remove('active');
    }
}
