// ========== ANALYTICS PAGE - COMPLETE WORKING VERSION ==========

// Calculate budget health score (0-100)
function calculateHealthScore(spent, budget) {
    if (!spent || !budget) return 50;
    
    let score = 100;
    
    const needsPercent = budget.needs > 0 ? (spent.needs / budget.needs) * 100 : 0;
    const wantsPercent = budget.wants > 0 ? (spent.wants / budget.wants) * 100 : 0;
    const savingsPercent = budget.savings > 0 ? (spent.savings / budget.savings) * 100 : 0;
    
    if (needsPercent > 100) score -= (needsPercent - 100) * 0.5;
    if (wantsPercent > 100) score -= (wantsPercent - 100) * 0.3;
    if (savingsPercent < 50) score -= (50 - savingsPercent) * 0.2;
    if (savingsPercent >= 100) score += 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

// Get health score label
function getHealthScoreLabel(score) {
    if (score >= 90) return { label: 'Excellent', emoji: '🌟', color: '#10B981' };
    if (score >= 75) return { label: 'Good', emoji: '😊', color: '#10B981' };
    if (score >= 60) return { label: 'Fair', emoji: '😐', color: '#F59E0B' };
    if (score >= 40) return { label: 'Needs Work', emoji: '😟', color: '#F59E0B' };
    return { label: 'Critical', emoji: '😰', color: '#EF4444' };
}

// Get week comparison
function getWeekComparison(transactions) {
    const now = new Date();
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeek = transactions.filter(t => {
        if (t.transactionType === 'income') return false;
        const date = new Date(t.date);
        return date >= thisWeekStart && date <= now;
    }).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const lastWeek = transactions.filter(t => {
        if (t.transactionType === 'income') return false;
        const date = new Date(t.date);
        return date >= lastWeekStart && date < thisWeekStart;
    }).reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const difference = thisWeek - lastWeek;
    const percentChange = lastWeek > 0 ? (difference / lastWeek) * 100 : 0;
    
    return {
        thisWeek,
        lastWeek,
        difference,
        percentChange: Math.round(percentChange * 10) / 10,
        isIncrease: difference > 0
    };
}

// Create budget bar HTML
function createBudgetBar(label, spent, budget, color) {
    spent = spent || 0;
    budget = budget || 1;
    
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOver = spent > budget;
    const remaining = Math.max(0, budget - spent);
    
    return `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 600;">${label}</span>
                <span style="font-weight: 700; color: ${isOver ? '#EF4444' : '#1F2937'};">
                    ₹${spent.toLocaleString('en-IN')} / ₹${budget.toLocaleString('en-IN')}
                </span>
            </div>
            <div style="background: #E5E7EB; height: 12px; border-radius: 9999px; overflow: hidden;">
                <div style="width: ${percentage}%; height: 100%; background: ${isOver ? '#EF4444' : color}; transition: width 0.5s;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #6B7280;">
                <span>${percentage.toFixed(1)}% used</span>
                <span>₹${remaining.toLocaleString('en-IN')} remaining</span>
            </div>
        </div>
    `;
}

// MAIN RENDER FUNCTION
function renderAnalyticsScreen() {
    const container = document.createElement('div');
    container.style.maxWidth = '1200px';
    container.style.margin = '0 auto';
    container.style.padding = '24px';
    
    // Header
    const header = document.createElement('div');
    header.style.marginBottom = '32px';
    header.innerHTML = `
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">📈 Analytics</h1>
        <p style="color: #6B7280;">Insights and trends</p>
    `;
    container.appendChild(header);
    
    // Get data with fallbacks
    let transactions = [];
    let budget = { needs: 7500, wants: 4500, savings: 3000, total: 15000 };
    let spent = { needs: 0, wants: 0, savings: 0, total: 0 };
    
    try {
        if (typeof getTransactions === 'function') {
            transactions = getTransactions();
        }
        if (typeof getBudget === 'function') {
            budget = getBudget();
        }
        if (typeof calculateSpent === 'function') {
            spent = calculateSpent(transactions);
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
    
    // Empty state
    if (transactions.length === 0) {
        container.innerHTML += `
            <div style="text-align: center; padding: 64px 24px; background: white; border-radius: 16px; border: 1px solid #E5E7EB;">
                <div style="font-size: 64px; margin-bottom: 16px;">📊</div>
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">No Data Yet</h2>
                <p style="color: #6B7280; margin-bottom: 24px;">Add some transactions to see analytics</p>
                <button onclick="navigateTo('home')" style="padding: 12px 24px; background: #6366F1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Go to Dashboard
                </button>
            </div>
        `;
        return container;
    }
    
    // Health Score Card
    const healthScore = calculateHealthScore(spent, budget);
    const healthInfo = getHealthScoreLabel(healthScore);
    
    const healthCard = document.createElement('div');
    healthCard.style.cssText = 'background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; border: 1px solid #E5E7EB; text-align: center;';
    healthCard.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 16px;">${healthInfo.emoji}</div>
        <div style="font-size: 48px; font-weight: 700; color: ${healthInfo.color}; margin-bottom: 8px;">
            ${healthScore}/100
        </div>
        <div style="font-size: 20px; color: #6B7280;">${healthInfo.label}</div>
        <div style="margin-top: 24px; padding: 16px; background: #F3F4F6; border-radius: 12px; font-size: 14px; color: #6B7280;">
            ${healthScore >= 90 ? '🎉 Excellent financial management!' : 
              healthScore >= 75 ? '👍 Keep up the good work!' :
              healthScore >= 60 ? '⚠️ Watch your spending carefully' :
              healthScore >= 40 ? '🚨 Consider reviewing your budget' :
              '⛔ Urgent: Budget adjustments needed'}
        </div>
    `;
    container.appendChild(healthCard);
    
    // Week Comparison
    const comparison = getWeekComparison(transactions);
    
    const comparisonCard = document.createElement('div');
    comparisonCard.style.cssText = 'background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; border: 1px solid #E5E7EB;';
    comparisonCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 24px;">Week Over Week</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">LAST WEEK</div>
                <div style="font-size: 24px; font-weight: 700;">₹${comparison.lastWeek.toLocaleString('en-IN')}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">THIS WEEK</div>
                <div style="font-size: 24px; font-weight: 700;">₹${comparison.thisWeek.toLocaleString('en-IN')}</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">CHANGE</div>
                <div style="font-size: 24px; font-weight: 700; color: ${comparison.isIncrease ? '#EF4444' : '#10B981'};">
                    ${comparison.isIncrease ? '↑' : '↓'} ${Math.abs(comparison.percentChange)}%
                </div>
            </div>
        </div>
    `;
    container.appendChild(comparisonCard);
    
    // Budget Breakdown
    const budgetCard = document.createElement('div');
    budgetCard.style.cssText = 'background: white; border-radius: 16px; padding: 32px; border: 1px solid #E5E7EB;';
    budgetCard.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Budget Breakdown</h2>
        <p style="color: #6B7280; margin-bottom: 24px;">50/30/20 Rule</p>
        <div>
            ${createBudgetBar('Needs', spent.needs, budget.needs, '#10B981')}
            ${createBudgetBar('Wants', spent.wants, budget.wants, '#F59E0B')}
            ${createBudgetBar('Savings', spent.savings, budget.savings, '#06B6D4')}
        </div>
    `;
    container.appendChild(budgetCard);
    
    return container;
}


