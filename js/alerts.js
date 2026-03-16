// ========== BUDGET ALERTS & NOTIFICATIONS ==========

// Check for budget alerts
function checkBudgetAlerts() {
    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);
    
    const alerts = [];
    
    // Check Needs budget (80% threshold)
    const needsPercent = (spent.needs / budget.needs) * 100;
    if (needsPercent >= 80 && needsPercent < 100) {
        alerts.push({
            type: 'warning',
            category: 'Needs',
            message: `You've used ${needsPercent.toFixed(0)}% of your Needs budget`,
            icon: '⚠️',
            action: 'View Details',
            actionFn: 'handleAlertAction'
        });
    } else if (needsPercent >= 100) {
        alerts.push({
            type: 'danger',
            category: 'Needs',
            message: `You've exceeded your Needs budget by ${formatCurrency(spent.needs - budget.needs)}`,
            icon: '🚨',
            action: 'Review Budget',
            actionFn: 'handleAlertAction'
        });
    }
    
    // Check Wants budget (80% threshold)
    const wantsPercent = (spent.wants / budget.wants) * 100;
    if (wantsPercent >= 80 && wantsPercent < 100) {
        alerts.push({
            type: 'warning',
            category: 'Wants',
            message: `You've used ${wantsPercent.toFixed(0)}% of your Wants budget`,
            icon: '⚠️',
            action: 'Slow Down',
            actionFn: 'handleAlertAction'
        });
    } else if (wantsPercent >= 100) {
        alerts.push({
            type: 'danger',
            category: 'Wants',
            message: `You've exceeded your Wants budget by ${formatCurrency(spent.wants - budget.wants)}`,
            icon: '🚨',
            action: 'AI Advice',
            actionFn: 'handleAlertAction'
        });
    }
    
    // Check Savings goal (positive alert)
    const savingsPercent = (spent.savings / budget.savings) * 100;
    if (savingsPercent >= 100) {
        alerts.push({
            type: 'success',
            category: 'Savings',
            message: `Congratulations! You've hit your savings goal! 🎉`,
            icon: '🏆',
            action: 'Celebrate',
            actionFn: 'handleAlertAction'
        });
    }
    
    return alerts;
}

// Handle alert actions
function handleAlertAction() {
    const banner = document.getElementById('alert-banner');
    if (banner) {
        banner.remove();
    }
}

// Show alert banner
function showAlertBanner(alert) {
    const existing = document.getElementById('alert-banner');
    if (existing) existing.remove();
    
    const banner = document.createElement('div');
    banner.id = 'alert-banner';
    banner.className = `alert-banner alert-${alert.type}`;
    banner.innerHTML = `
        <div class="alert-icon">${alert.icon}</div>
        <div class="alert-content">
            <div class="alert-title">${alert.category}</div>
            <div class="alert-message">${alert.message}</div>
        </div>
        <button class="alert-action" onclick="handleAlertAction()">${alert.action}</button>
        <button class="alert-close" onclick="closeAlertBanner()">✕</button>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (banner.parentNode) {
            banner.remove();
        }
    }, 10000);
}

function closeAlertBanner() {
    const banner = document.getElementById('alert-banner');
    if (banner) banner.remove();
}

// Show spending insights
function getSpendingInsights() {
    const transactions = getTransactions();
    const insights = [];
    
    if (transactions.length === 0) return insights;
    
    // Week over week comparison
    const comparison = getWeekComparison(transactions);
    if (comparison.lastWeek > 0) {
        if (comparison.isIncrease && Math.abs(comparison.percentChange) > 15) {
            insights.push({
                type: 'info',
                title: 'Spending Spike',
                message: `You spent ${comparison.percentChange.toFixed(0)}% more this week (${formatCurrency(comparison.difference)})`,
                icon: '📈'
            });
        } else if (!comparison.isIncrease && Math.abs(comparison.percentChange) > 15) {
            insights.push({
                type: 'success',
                title: 'Great Progress',
                message: `You spent ${Math.abs(comparison.percentChange).toFixed(0)}% less this week! Saved ${formatCurrency(Math.abs(comparison.difference))}`,
                icon: '💪'
            });
        }
    }
    
    // Top spending category
    const categoryData = getSpendingByCategory(transactions);
    if (categoryData.length > 0) {
        const topCategory = categoryData[0];
        const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        if (totalSpent > 0) {
            const percentage = ((topCategory.amount / totalSpent) * 100).toFixed(0);
            
            if (percentage > 40) {
                insights.push({
                    type: 'warning',
                    title: 'Category Alert',
                    message: `${percentage}% of your spending is on ${topCategory.category}`,
                    icon: getIcon(topCategory.category)
                });
            }
        }
    }
    
    // Daily average
    const todaySpending = getTodaySpending(transactions);
    const dailyBudget = getBudget().total / 30;
    
    if (todaySpending > dailyBudget * 1.5) {
        insights.push({
            type: 'warning',
            title: 'High Day',
            message: `Today's spending (${formatCurrency(todaySpending)}) is 50% above your daily average`,
            icon: '💸'
        });
    }
    
    return insights;
}

// Render insights widget
function createInsightsWidget() {
    const insights = getSpendingInsights();
    
    if (insights.length === 0) return null;
    
    const widget = document.createElement('div');
    widget.className = 'insights-widget';
    
    const header = document.createElement('div');
    header.className = 'insights-header';
    header.innerHTML = `
        <h3>💡 Spending Insights</h3>
    `;
    
    const list = document.createElement('div');
    list.className = 'insights-list';
    
    insights.forEach(insight => {
        const item = document.createElement('div');
        item.className = `insight-item insight-${insight.type}`;
        item.innerHTML = `
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-message">${insight.message}</div>
            </div>
        `;
        list.appendChild(item);
    });
    
    widget.appendChild(header);
    widget.appendChild(list);
    
    return widget;
}
