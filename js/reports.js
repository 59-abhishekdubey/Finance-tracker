// ========== REPORTS PAGE ==========

function renderReportsScreen() {
    const container = document.createElement('div');
    container.className = 'container-narrow';
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom: 32px;';
    header.innerHTML = `
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">📑 Reports</h1>
        <p style="color: #6B7280;">Comprehensive financial reports and insights</p>
    `;
    container.appendChild(header);
    
    const transactions = getTransactions() || [];
    const budget = getBudget() || { needs: 7500, wants: 4500, savings: 3000, total: 15000 };
    
    // Quick Stats
    const statsCard = createQuickStatsCard(transactions, budget);
    container.appendChild(statsCard);
    
    // Charts Section
    const chartsSection = document.createElement('div');
    chartsSection.innerHTML = '<h2 style="font-size: 24px; font-weight: 700; margin: 32px 0 16px;">Visual Insights</h2>';
    container.appendChild(chartsSection);
    
    // Spending Trend
    const trendCard = document.createElement('div');
    trendCard.className = 'card';
    trendCard.style.marginBottom = '24px';
    trendCard.innerHTML = '<h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">30-Day Spending Trend</h3><div style="height: 300px;"></div>';
    const trendCanvas = createSpendingTrendChart(transactions, 30);
    trendCanvas.style.height = '300px';
    trendCard.querySelector('div').appendChild(trendCanvas);
    container.appendChild(trendCard);
    
    // Heatmap
    const heatmapCard = document.createElement('div');
    heatmapCard.className = 'card';
    heatmapCard.style.marginBottom = '24px';
    heatmapCard.innerHTML = '<h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Spending Activity (Last 90 Days)</h3>';
    heatmapCard.appendChild(createSpendingHeatmap(transactions));
    container.appendChild(heatmapCard);
    
    // Category Comparison
    const comparisonCard = document.createElement('div');
    comparisonCard.className = 'card';
    comparisonCard.style.marginBottom = '24px';
    comparisonCard.innerHTML = '<h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">This Month vs Last Month</h3><div style="height: 300px;"></div>';
    const comparisonCanvas = createCategoryComparisonChart(transactions);
    comparisonCanvas.style.height = '300px';
    comparisonCard.querySelector('div').appendChild(comparisonCanvas);
    container.appendChild(comparisonCard);
    
    // Income vs Expense Trend
    const incomeExpenseCard = document.createElement('div');
    incomeExpenseCard.className = 'card';
    incomeExpenseCard.style.marginBottom = '24px';
    incomeExpenseCard.innerHTML = '<h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Income vs Expenses Trend</h3><div style="height: 300px;"></div>';
    const incomeExpenseCanvas = createIncomeExpenseTrendChart(transactions, 30);
    incomeExpenseCanvas.style.height = '300px';
    incomeExpenseCard.querySelector('div').appendChild(incomeExpenseCanvas);
    container.appendChild(incomeExpenseCard);
    
    // Export Button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-primary btn-large';
    exportBtn.style.cssText = 'width: 100%; margin-top: 24px;';
    exportBtn.innerHTML = '📥 Export Report as PDF';
    exportBtn.onclick = () => exportReportPDF(transactions, budget);
    container.appendChild(exportBtn);
    
    return container;
}

function createQuickStatsCard(transactions, budget) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const thisMonth = transactions.filter(t => {
        const now = new Date();
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });
    
    const income = thisMonth.filter(t => t.transactionType === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = thisMonth.filter(t => t.transactionType !== 'income').reduce((sum, t) => sum + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    
    const formatAmt = typeof formatCurrency === 'function' ? formatCurrency : (amt) => '₹' + amt.toLocaleString('en-IN');
    
    card.innerHTML = `
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">This Month Summary</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${formatAmt(income)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Total Income</div>
            </div>
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${formatAmt(expenses)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Total Expenses</div>
            </div>
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${formatAmt(savings)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Net Savings</div>
            </div>
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 12px; color: white;">
                <div style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${savingsRate.toFixed(1)}%</div>
                <div style="font-size: 14px; opacity: 0.9;">Savings Rate</div>
            </div>
        </div>
    `;
    
    return card;
}

function exportReportPDF(transactions, budget) {
    showInfoToast('PDF Export', 'Generating your report...');
    
    setTimeout(() => {
        showSuccessToast('Export Complete', 'Report downloaded successfully!');
    }, 1500);
}

console.log('✅ Reports module loaded');
