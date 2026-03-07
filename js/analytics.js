// ========== ANALYTICS CALCULATIONS ==========

// Get spending breakdown by category
function getSpendingByCategory(transactions) {
    const categoryTotals = {};
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const category = transaction.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += transaction.amount;
        }
    });
    
    // Convert to array and sort by amount
    const categoryArray = Object.entries(categoryTotals).map(([category, amount]) => ({
        category: category,
        amount: amount,
        color: getCategoryColor(category),
        icon: getIcon(category)
    }));
    
    categoryArray.sort((a, b) => b.amount - a.amount);
    
    return categoryArray;
}

// Get total spending
function getTotalSpending(transactions) {
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
}

// Get spending for last N days
function getSpendingForPeriod(transactions, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= cutoffDate)
        .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate budget health score (0-100)
function calculateHealthScore(transactions, budget) {
    const spent = calculateSpent(transactions);
    
    // Calculate how well user is doing in each category
    const needsScore = Math.max(0, 100 - ((spent.needs / budget.needs) * 100));
    const wantsScore = Math.max(0, 100 - ((spent.wants / budget.wants) * 100));
    const savingsScore = (spent.savings / budget.savings) * 100;
    
    // Weighted average (needs and savings more important)
    const healthScore = (needsScore * 0.4) + (wantsScore * 0.3) + (savingsScore * 0.3);
    
    return Math.round(Math.min(healthScore, 100));
}

// Get health score label
function getHealthScoreLabel(score) {
    if (score >= 80) return { label: 'Excellent', emoji: '🌟', color: 'var(--color-success)' };
    if (score >= 60) return { label: 'Good', emoji: '👍', color: 'var(--color-info)' };
    if (score >= 40) return { label: 'Fair', emoji: '😐', color: 'var(--color-warning)' };
    return { label: 'Needs Work', emoji: '⚠️', color: 'var(--color-danger)' };
}

// Get top spending categories
function getTopCategories(categoryData, limit = 3) {
    return categoryData.slice(0, limit);
}

// Compare this week vs last week
function getWeekComparison(transactions) {
    const now = new Date();
    
    // This week (last 7 days)
    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 7);
    const thisWeek = transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= thisWeekStart)
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Last week (8-14 days ago)
    const lastWeekStart = new Date();
    lastWeekStart.setDate(now.getDate() - 14);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(now.getDate() - 7);
    const lastWeek = transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' && date >= lastWeekStart && date < lastWeekEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    
    const difference = thisWeek - lastWeek;
    const percentChange = lastWeek > 0 ? ((difference / lastWeek) * 100) : 0;
    
    return {
        thisWeek: thisWeek,
        lastWeek: lastWeek,
        difference: difference,
        percentChange: Math.round(percentChange),
        isIncrease: difference > 0
    };
}
