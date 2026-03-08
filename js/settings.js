// ========== SETTINGS & DATA MANAGEMENT ==========

// Export data to CSV
function exportDataToCSV() {
    const transactions = getTransactions();
    
    if (transactions.length === 0) {
        alert('No transactions to export!');
        return;
    }
    
    // CSV Headers
    let csv = 'Date,Time,Name,Category,Amount,Type\n';
    
    // Add each transaction
    transactions.forEach(transaction => {
        const row = [
        transaction.date,
            transaction.time,
            `"${transaction.name}"`, // Quotes in case name has commas
            transaction.category,
            transaction.amount,
            transaction.type
        ].join(',');
        csv += row + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =`finance-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Update budget amounts
function updateBudgetAmounts(total, needsPercent, wantsPercent, savingsPercent) {
    const data = getData();
    
    data.budget = {
        total: parseFloat(total),
        needs: (parseFloat(total) * needsPercent) / 100,
        wants: (parseFloat(total) * wantsPercent) / 100,
        savings: (parseFloat(total) * savingsPercent) / 100
    };
    
    saveData(data);
    return data.budget;
}

// Get current budget percentages
function getBudgetPercentages() {
    const budget = getBudget();
    return {
        needs: Math.round((budget.needs / budget.total) * 100),
        wants: Math.round((budget.wants / budget.total) * 100),
        savings: Math.round((budget.savings / budget.total) * 100)
    };
}

// Clear all transactions (with safety)
function clearAllTransactions() {
    const confirmed = confirm('⚠️ Are you sure you want to delete ALL transactions? This cannot be undone!');
    
    if (confirmed) {
        const doubleCheck = confirm('🚨 FINAL WARNING: This will permanently delete all your transaction data. Continue?');
        
        if (doubleCheck) {
            const data = getData();
            data.transactions = [];
            saveData(data);
            return true;
        }
    }
    
    return false;
}

// Reset to default budget
function resetToDefaultBudget() {
    const data = getData();
    data.budget = {
        total: 15000,
        needs: 7500,
        wants: 4500,
        savings: 3000
    };
    saveData(data);
    return data.budget;
}