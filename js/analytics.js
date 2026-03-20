// ========== ANALYTICS SCREEN ==========

function renderAnalyticsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';

    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);

    // Page header
    const header = document.createElement('div');
    header.style.marginBottom = 'var(--space-xl)';

    const title = document.createElement('h1');
    title.textContent = '📊 Analytics';
    title.style.marginBottom = 'var(--space-xs)';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary';
    subtitle.textContent = 'Deep dive into your spending';

    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);

    // Check for empty state
    if (!transactions || transactions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = 'var(--space-3xl)';
        emptyState.innerHTML = `
            <div style="font-size: 64px; margin-bottom: var(--space-lg);">📊</div>
            <h2 style="margin-bottom: var(--space-sm);">No data yet</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg);">Add some transactions to see analytics and insights.</p>
        `;
        container.appendChild(emptyState);
        return container;
    }

    // ── Overview Cards ──
    const overviewGrid = document.createElement('div');
    overviewGrid.className = 'analytics-overview-grid';

    const totalCard = createAnalyticsMiniCard('Total Spent', formatCurrency(spent.total), getSpentPercentage(spent.total, budget.total));
    const remainingAmount = Math.max(budget.total - spent.total, 0);
    const remainingCard = createAnalyticsMiniCard('Remaining', formatCurrency(remainingAmount), null);
    const txCountCard = createAnalyticsMiniCard('Transactions', String(transactions.length), null);
    const avgCard = createAnalyticsMiniCard('Avg / Transaction', formatCurrency(transactions.length > 0 ? Math.round(spent.total / transactions.length) : 0), null);

    overviewGrid.appendChild(totalCard);
    overviewGrid.appendChild(remainingCard);
    overviewGrid.appendChild(txCountCard);
    overviewGrid.appendChild(avgCard);
    container.appendChild(overviewGrid);

    // Spacing
    container.appendChild(createSpacer());

    // ── Budget vs Actual (Needs / Wants / Savings) ──
    const budgetContent = document.createElement('div');

    const needsBar = createProgressBar('Needs (50%)', spent.needs, budget.needs, 'needs');
    const wantsBar = createProgressBar('Wants (30%)', spent.wants, budget.wants, 'wants');
    const savingsBar = createProgressBar('Savings (20%)', spent.savings, budget.savings, 'savings');

    budgetContent.appendChild(needsBar);
    budgetContent.appendChild(wantsBar);
    budgetContent.appendChild(savingsBar);

    const budgetCard = createCard('Budget vs Actual', '50 / 30 / 20 rule', budgetContent);
    container.appendChild(budgetCard);

    container.appendChild(createSpacer());

    // ── Category Breakdown ──
    const categoryData = getCategoryBreakdown(transactions);

    const categoryContent = document.createElement('div');
    categoryContent.className = 'analytics-category-list';

    if (categoryData.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-secondary';
        empty.textContent = 'No expenses to analyze.';
        empty.style.textAlign = 'center';
        empty.style.padding = 'var(--space-lg)';
        categoryContent.appendChild(empty);
    } else {
        const maxCategoryAmount = categoryData[0].amount; // already sorted desc
        categoryData.forEach(cat => {
            categoryContent.appendChild(createCategoryBar(cat, maxCategoryAmount, spent.total));
        });
    }

    const categoryCard = createCard('Spending by Category', 'Where your money goes', categoryContent);
    container.appendChild(categoryCard);

    container.appendChild(createSpacer());

    // ── Daily Spending Trend (Chart.js) ──
    const dailyData = getSpendingByDay(transactions, 7);
    const dailyChartCard = document.createElement('div');
    dailyChartCard.className = 'chart-card';
    dailyChartCard.style.marginBottom = 'var(--space-xl)';
    
    const dailyChartHeader = document.createElement('div');
    dailyChartHeader.className = 'chart-card-header';
    
    const dailyChartTitle = document.createElement('h3');
    dailyChartTitle.className = 'chart-card-title';
    dailyChartTitle.textContent = 'Daily Spending Trend';
    dailyChartTitle.style.margin = '0';
    
    dailyChartHeader.appendChild(dailyChartTitle);
    dailyChartCard.appendChild(dailyChartHeader);
    
    const dailyCanvasContainer = document.createElement('div');
    dailyCanvasContainer.style.position = 'relative';
    dailyCanvasContainer.style.height = '300px';
    
    const dailyCanvas = document.createElement('canvas');
    dailyCanvas.id = 'analytics-daily-chart';
    dailyCanvasContainer.appendChild(dailyCanvas);
    dailyChartCard.appendChild(dailyCanvasContainer);
    
    container.appendChild(dailyChartCard);
    
    // Initialize chart after rendering
    setTimeout(() => {
        initAnalyticsDailyChart(dailyData);
    }, 100);

    container.appendChild(createSpacer());

    // ── Top Expenses ──
    const topExpenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    if (topExpenses.length > 0) {
        const topHeader = document.createElement('h2');
        topHeader.textContent = 'Top Expenses';
        topHeader.style.marginBottom = 'var(--space-lg)';
        container.appendChild(topHeader);

        const topList = document.createElement('div');
        topList.className = 'transaction-list';

        topExpenses.forEach((tx, index) => {
            const row = document.createElement('div');
            row.className = 'analytics-top-row';

            const rank = document.createElement('span');
            rank.className = 'analytics-rank';
            rank.textContent = `#${index + 1}`;

            const info = document.createElement('div');
            info.className = 'analytics-top-info';

            const name = document.createElement('div');
            name.className = 'analytics-top-name';
            name.textContent = tx.name;

            const meta = document.createElement('div');
            meta.className = 'text-secondary';
            meta.style.fontSize = 'var(--font-size-sm)';
            meta.textContent = `${tx.category.charAt(0).toUpperCase() + tx.category.slice(1)} · ${formatDate(tx.date)}`;

            info.appendChild(name);
            info.appendChild(meta);

            const amount = document.createElement('div');
            amount.className = 'analytics-top-amount';
            amount.textContent = formatCurrency(tx.amount);

            row.appendChild(rank);
            row.appendChild(info);
            row.appendChild(amount);
            topList.appendChild(row);
        });

        container.appendChild(topList);
    }

    // Bottom padding for nav
    const bottomPad = document.createElement('div');
    bottomPad.style.height = '100px';
    container.appendChild(bottomPad);

    return container;
}

// ── Helper: category breakdown from transactions ──
function getCategoryBreakdown(transactions) {
    const map = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            if (!map[t.category]) {
                map[t.category] = 0;
            }
            map[t.category] += t.amount;
        }
    });

    return Object.entries(map)
        .map(([category, amount]) => ({ category, amount, color: getCategoryColor(category) }))
        .sort((a, b) => b.amount - a.amount);
}

// ── Helper: mini stat card ──
function createAnalyticsMiniCard(label, value, badge) {
    const card = document.createElement('div');
    card.className = 'analytics-mini-card';

    const labelEl = document.createElement('div');
    labelEl.className = 'analytics-mini-label text-secondary';
    labelEl.textContent = label;

    const valueEl = document.createElement('div');
    valueEl.className = 'analytics-mini-value';
    valueEl.textContent = value;

    card.appendChild(labelEl);
    card.appendChild(valueEl);

    if (badge) {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'analytics-mini-badge';
        badgeEl.textContent = badge;
        card.appendChild(badgeEl);
    }

    return card;
}

// ── Helper: horizontal category bar ──
function createCategoryBar(catData, maxAmount, totalSpent) {
    const row = document.createElement('div');
    row.className = 'analytics-cat-row';

    const left = document.createElement('div');
    left.className = 'analytics-cat-left';

    const icon = document.createElement('span');
    icon.textContent = getIcon(catData.category);
    icon.style.marginRight = 'var(--space-sm)';

    const name = document.createElement('span');
    name.textContent = catData.category.charAt(0).toUpperCase() + catData.category.slice(1);

    left.appendChild(icon);
    left.appendChild(name);

    const right = document.createElement('div');
    right.className = 'analytics-cat-right';

    const amount = document.createElement('span');
    amount.className = 'analytics-cat-amount';
    amount.textContent = formatCurrency(catData.amount);

    const pct = document.createElement('span');
    pct.className = 'analytics-cat-pct text-secondary';
    pct.textContent = `${calculatePercentage(catData.amount, totalSpent)}%`;

    right.appendChild(amount);
    right.appendChild(pct);

    const barTrack = document.createElement('div');
    barTrack.className = 'analytics-cat-bar-track';

    const barFill = document.createElement('div');
    barFill.className = 'analytics-cat-bar-fill';
    const widthPct = maxAmount > 0 ? (catData.amount / maxAmount) * 100 : 0;
    barFill.style.width = `${widthPct}%`;
    barFill.style.backgroundColor = catData.color;

    barTrack.appendChild(barFill);

    row.appendChild(left);
    row.appendChild(right);
    row.appendChild(barTrack);

    return row;
}

// ── Helper: spacer ──
function createSpacer() {
    const s = document.createElement('div');
    s.style.height = 'var(--space-xl)';
    return s;
}

// ── Helper: percentage badge text ──
function getSpentPercentage(spent, budget) {
    if (budget <= 0) return '';
    const pct = calculatePercentage(spent, budget);
    return `${pct}% of budget`;
}

// ── Chart.js Daily Spending Chart ──
let analyticsDailyChart = null;

function initAnalyticsDailyChart(dailyData) {
    const canvas = document.getElementById('analytics-daily-chart');
    if (!canvas) return;
    
    if (analyticsDailyChart) {
        analyticsDailyChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    analyticsDailyChart = new Chart(ctx, {
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
