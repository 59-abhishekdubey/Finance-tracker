// ========== LOADING UTILITIES ==========

let loadingOverlay = null;

// Show full screen loading
function showLoading(message = 'Loading...') {
    // Remove existing overlay
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    // Create overlay
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    loadingOverlay.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="spinner spinner-large"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Show with slight delay for smooth animation
    setTimeout(() => {
        loadingOverlay.classList.add('show');
    }, 10);
}

// Hide loading
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
        
        setTimeout(() => {
            if (loadingOverlay && loadingOverlay.parentNode) {
                loadingOverlay.remove();
            }
            loadingOverlay = null;
        }, 300);
    }
}

// Show button loading state
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.classList.add('btn-loading');
        button.disabled = true;
        button.dataset.originalText = button.textContent;
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// Create skeleton loader for dashboard
function createSkeletonDashboard() {
    const container = document.createElement('div');
    container.className = 'dashboard-container';
    
    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';
    
    // Create 3 skeleton stat cards
    for (let i = 0; i < 3; i++) {
        const card = document.createElement('div');
        card.className = 'skeleton-stat-card';
        card.style.gridColumn = 'span 4';
        
        card.innerHTML = `
            <div class="skeleton-stat-header">
                <div class="skeleton skeleton-text" style="width: 120px;"></div>
                <div class="skeleton skeleton-stat-icon"></div>
            </div>
            <div class="skeleton skeleton-stat-value"></div>
            <div class="skeleton skeleton-stat-label"></div>
        `;
        
        grid.appendChild(card);
    }
    
    // Skeleton chart
    const chartCard = document.createElement('div');
    chartCard.className = 'chart-card';
    chartCard.style.gridColumn = 'span 12';
    chartCard.innerHTML = `
        <div class="chart-loading">
            <div style="text-align: center;">
                <div class="spinner"></div>
                <div class="loading-text">Loading charts...</div>
            </div>
        </div>
    `;
    grid.appendChild(chartCard);
    
    container.appendChild(grid);
    return container;
}

// Create skeleton for transaction list
function createSkeletonTransactions(count = 5) {
    const container = document.createElement('div');
    container.className = 'transaction-list';
    
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); margin-bottom: var(--space-md);';
        
        item.innerHTML = `
            <div class="skeleton skeleton-circle"></div>
            <div style="flex: 1;">
                <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 8px;"></div>
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
            </div>
            <div class="skeleton skeleton-text" style="width: 80px;"></div>
        `;
        
        container.appendChild(item);
    }
    
    return container;
}

// Simulate loading delay (for development)
function simulateLoading(callback, delay = 1000) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        if (callback) callback();
    }, delay);
}

// Add loading to async function
async function withLoading(asyncFunction, loadingMessage = 'Loading...') {
    showLoading(loadingMessage);
    
    try {
        const result = await asyncFunction();
        hideLoading();
        return result;
    } catch (error) {
        hideLoading();
        throw error;
    }
}
