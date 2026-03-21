// ========== SAFE FUNCTION CALLER ==========

// Safely call a function that might not exist
function safeCall(functionName, ...args) {
    if (typeof window[functionName] === 'function') {
        try {
            return window[functionName](...args);
        } catch (error) {
            console.error(`Error calling ${functionName}:`, error);
            return null;
        }
    } else {
        console.warn(`Function ${functionName} does not exist`);
        return null;
    }
}

// Check if all required functions exist
function checkRequiredFunctions(functionNames) {
    const missing = [];
    
    functionNames.forEach(name => {
        if (typeof window[name] !== 'function') {
            missing.push(name);
        }
    });
    
    if (missing.length > 0) {
        console.error('❌ Missing functions:', missing);
        return false;
    }
    
    console.log('✅ All required functions exist');
    return true;
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    const criticalFunctions = [
        'getTransactions',
        'getBudget',
        'calculateSpent',
        'formatCurrency',
        'navigateTo',
        'renderScreen'
    ];
    
    checkRequiredFunctions(criticalFunctions);
});
