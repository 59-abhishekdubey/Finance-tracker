// ========== ENHANCED CHARTS ==========

// Create spending trend area chart
function createSpendingTrendChart(transactions, days = 30) {
    const canvas = document.createElement('canvas');
    canvas.id = 'spending-trend-chart';
    
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        const dateRange = getLastNDays(days);
        
        const dailyData = dateRange.map(date => {
            const dayTotal = transactions
                .filter(t => t.date === date && t.transactionType !== 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            return dayTotal;
        });
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateRange.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Daily Spending',
                    data: dailyData,
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#6366F1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => 'Spent: ' + formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: (value) => '₹' + value.toLocaleString('en-IN')
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }, 100);
    
    return canvas;
}

// Create spending heatmap
function createSpendingHeatmap(transactions) {
    const container = document.createElement('div');
    container.style.cssText = 'overflow-x: auto; padding: 20px;';
    
    const last90Days = getLastNDays(90);
    const weeks = [];
    
    for (let i = 0; i < 13; i++) {
        weeks.push(last90Days.slice(i * 7, (i + 1) * 7));
    }
    
    const maxSpending = Math.max(...last90Days.map(date => {
        return transactions
            .filter(t => t.date === date && t.transactionType !== 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }));
    
    const heatmapHTML = `
        <div style="display: flex; gap: 4px;">
            ${weeks.map(week => `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${week.map(date => {
                        const dayTotal = transactions
                            .filter(t => t.date === date && t.transactionType !== 'income')
                            .reduce((sum, t) => sum + t.amount, 0);
                        
                        const intensity = maxSpending > 0 ? dayTotal / maxSpending : 0;
                        const color = intensity === 0 ? '#E5E7EB' : 
                                     intensity < 0.25 ? '#DBEAFE' :
                                     intensity < 0.5 ? '#93C5FD' :
                                     intensity < 0.75 ? '#3B82F6' : '#1E40AF';
                        
                        return `
                            <div title="${date}: ${formatCurrency(dayTotal)}" 
                                 style="width: 14px; height: 14px; background: ${color}; border-radius: 3px; cursor: pointer;">
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 12px; color: #6B7280;">
            <span>Less</span>
            <div style="width: 14px; height: 14px; background: #E5E7EB; border-radius: 3px;"></div>
            <div style="width: 14px; height: 14px; background: #DBEAFE; border-radius: 3px;"></div>
            <div style="width: 14px; height: 14px; background: #93C5FD; border-radius: 3px;"></div>
            <div style="width: 14px; height: 14px; background: #3B82F6; border-radius: 3px;"></div>
            <div style="width: 14px; height: 14px; background: #1E40AF; border-radius: 3px;"></div>
            <span>More</span>
        </div>
    `;
    
    container.innerHTML = heatmapHTML;
    return container;
}

// Create category comparison chart (this month vs last month)
function createCategoryComparisonChart(transactions) {
    const canvas = document.createElement('canvas');
    canvas.id = 'category-comparison-chart';
    
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        
        const thisMonth = transactions.filter(t => t.date >= thisMonthStart && t.transactionType !== 'income');
        const lastMonth = transactions.filter(t => t.date >= lastMonthStart && t.date <= lastMonthEnd && t.transactionType !== 'income');
        
        const categories = [...new Set([...thisMonth.map(t => t.category), ...lastMonth.map(t => t.category)])];
        
        const thisMonthData = categories.map(cat => 
            thisMonth.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
        );
        
        const lastMonthData = categories.map(cat =>
            lastMonth.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
        );
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [
                    {
                        label: 'This Month',
                        data: thisMonthData,
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: '#6366F1',
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Last Month',
                        data: lastMonthData,
                        backgroundColor: 'rgba(156, 163, 175, 0.8)',
                        borderColor: '#9CA3AF',
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.dataset.label + ': ' + formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: (value) => '₹' + value.toLocaleString('en-IN')
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }, 100);
    
    return canvas;
}

// Create income vs expense trend
function createIncomeExpenseTrendChart(transactions, days = 30) {
    const canvas = document.createElement('canvas');
    canvas.id = 'income-expense-trend-chart';
    
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        const dateRange = getLastNDays(days);
        
        const incomeData = dateRange.map(date => 
            transactions
                .filter(t => t.date === date && t.transactionType === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
        );
        
        const expenseData = dateRange.map(date =>
            transactions
                .filter(t => t.date === date && t.transactionType !== 'income')
                .reduce((sum, t) => sum + t.amount, 0)
        );
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateRange.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.dataset.label + ': ' + formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: (value) => '₹' + value.toLocaleString('en-IN')
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }, 100);
    
    return canvas;
}

// Get last N days in YYYY-MM-DD format
function getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

console.log('✅ Enhanced charts module loaded');
