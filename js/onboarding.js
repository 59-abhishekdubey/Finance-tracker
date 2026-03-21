// ========== ONBOARDING TUTORIAL ==========

const ONBOARDING_KEY = 'finance_tracker_onboarding_completed';

// Check if onboarding is completed
function isOnboardingCompleted() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

// Mark onboarding as completed
function completeOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
}

// Reset onboarding (for testing)
function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
}

// Onboarding steps
const onboardingSteps = [
    {
        target: '.sidebar-brand',
        icon: '👋',
        title: 'Welcome to FinanceTracker!',
        description: 'Let\'s take a quick tour to help you get started. This will only take a minute!',
        position: 'right'
    },
    {
        target: '.sidebar-link[data-screen="home"]',
        icon: '🏠',
        title: 'Your Dashboard',
        description: 'Get a quick overview of your spending, income, and budget status at a glance.',
        position: 'right'
    },
    {
        target: '.sidebar-link[data-screen="stats"]',
        icon: '📊',
        title: 'Track Your Statistics',
        description: 'View detailed spending patterns, charts, and filter your transactions by date or category.',
        position: 'right'
    },
    {
        target: '.sidebar-link[data-screen="analytics"]',
        icon: '📈',
        title: 'Analyze Your Spending',
        description: 'Get insights into your spending habits with budget health scores and category breakdowns.',
        position: 'right'
    },
    {
        target: '.sidebar-link[data-screen="recurring"]',
        icon: '🔄',
        title: 'Recurring Transactions',
        description: 'Automate your regular bills, subscriptions, and recurring income. Save time and never miss a payment!',
        position: 'right'
    },
    {
        target: '.sidebar-link[data-screen="ai"]',
        icon: '🤖',
        title: 'AI Financial Advisor',
        description: 'Get personalized financial advice and smart recommendations based on your spending patterns.',
        position: 'right'
    }
];

let currentStepIndex = 0;
let overlay = null;
let spotlight = null;
let tooltip = null;

// Start onboarding
function startOnboarding() {
    // Create overlay
    overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    document.body.appendChild(overlay);
    
    // Create spotlight
    spotlight = document.createElement('div');
    spotlight.className = 'onboarding-spotlight';
    document.body.appendChild(spotlight);
    
    // Show welcome screen first
    showWelcomeScreen();
}

// Show welcome screen
function showWelcomeScreen() {
    const welcome = document.createElement('div');
    welcome.className = 'onboarding-welcome';
    
    welcome.innerHTML = `
        <div class="welcome-icon">🎉</div>
        <h1 class="welcome-title">Welcome to FinanceTracker!</h1>
        <p class="welcome-subtitle">Take control of your finances with smart budgeting and AI-powered insights.</p>
        
        <div class="welcome-features">
            <div class="welcome-feature">
                <span class="welcome-feature-icon">💰</span>
                <span class="welcome-feature-text">Track income & expenses</span>
            </div>
            <div class="welcome-feature">
                <span class="welcome-feature-icon">📊</span>
                <span class="welcome-feature-text">Visual analytics</span>
            </div>
            <div class="welcome-feature">
                <span class="welcome-feature-icon">🎯</span>
                <span class="welcome-feature-text">Budget goals</span>
            </div>
            <div class="welcome-feature">
                <span class="welcome-feature-icon">🤖</span>
                <span class="welcome-feature-text">AI advisor</span>
            </div>
        </div>
        
        <div class="welcome-actions">
            <button class="btn btn-primary btn-large btn-block" onclick="beginTour()">
                Start Tour (1 min)
            </button>
            <a href="#" class="onboarding-skip" onclick="skipOnboarding(); return false;">
                Skip and explore on my own
            </a>
        </div>
    `;
    
    document.body.appendChild(welcome);
    overlay.classList.add('show');
}

// Begin tour
function beginTour() {
    // Remove welcome screen
    const welcome = document.querySelector('.onboarding-welcome');
    if (welcome) {
        welcome.remove();
    }
    
    // Start from step 0
    currentStepIndex = 0;
    showStep(currentStepIndex);
}

// Show specific step
function showStep(index) {
    if (index >= onboardingSteps.length) {
        completeOnboardingTour();
        return;
    }
    
    const step = onboardingSteps[index];
    const targetElement = document.querySelector(step.target);
    
    if (!targetElement) {
        // Skip if element not found
        showStep(index + 1);
        return;
    }
    
    // Position spotlight
    positionSpotlight(targetElement);
    
    // Show tooltip
    showTooltip(step, targetElement, index);
}

// Position spotlight
function positionSpotlight(element) {
    const rect = element.getBoundingClientRect();
    const padding = 8;
    
    spotlight.style.top = (rect.top - padding) + 'px';
    spotlight.style.left = (rect.left - padding) + 'px';
    spotlight.style.width = (rect.width + padding * 2) + 'px';
    spotlight.style.height = (rect.height + padding * 2) + 'px';
}

// Show tooltip
function showTooltip(step, targetElement, index) {
    // Remove existing tooltip
    if (tooltip) {
        tooltip.remove();
    }
    
    tooltip = document.createElement('div');
    tooltip.className = 'onboarding-tooltip';
    
    tooltip.innerHTML = `
        <div class="onboarding-header">
            <div class="onboarding-icon">${step.icon}</div>
            <div class="onboarding-header-text">
                <div class="onboarding-step">Step ${index + 1} of ${onboardingSteps.length}</div>
                <h3 class="onboarding-title">${step.title}</h3>
            </div>
        </div>
        
        <p class="onboarding-description">${step.description}</p>
        
        <div class="onboarding-progress">
            ${onboardingSteps.map((_, i) => `
                <div class="progress-dot ${i === index ? 'active' : ''}"></div>
            `).join('')}
        </div>
        
        <div class="onboarding-actions">
            <a href="#" class="onboarding-skip" onclick="skipOnboarding(); return false;">
                Skip tour
            </a>
            <div class="onboarding-nav">
                ${index > 0 ? `
                    <button class="btn btn-secondary" onclick="previousStep()">
                        ← Back
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="nextStep()">
                    ${index === onboardingSteps.length - 1 ? 'Finish' : 'Next'} →
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    positionTooltip(tooltip, targetElement, step.position);
}

// Position tooltip relative to target
function positionTooltip(tooltipEl, targetElement, position) {
    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const gap = 20;
    
    switch(position) {
        case 'right':
            tooltipEl.style.left = (rect.right + gap) + 'px';
            tooltipEl.style.top = (rect.top + rect.height / 2 - tooltipRect.height / 2) + 'px';
            tooltipEl.classList.add('arrow-left');
            break;
            
        case 'left':
            tooltipEl.style.left = (rect.left - tooltipRect.width - gap) + 'px';
            tooltipEl.style.top = (rect.top + rect.height / 2 - tooltipRect.height / 2) + 'px';
            tooltipEl.classList.add('arrow-right');
            break;
            
        case 'top':
            tooltipEl.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
            tooltipEl.style.top = (rect.top - tooltipRect.height - gap) + 'px';
            tooltipEl.classList.add('arrow-bottom');
            break;
            
        case 'bottom':
            tooltipEl.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
            tooltipEl.style.top = (rect.bottom + gap) + 'px';
            tooltipEl.classList.add('arrow-top');
            break;
    }
    
    // Adjust if off screen
    const tooltipBounds = tooltipEl.getBoundingClientRect();
    if (tooltipBounds.right > window.innerWidth - 20) {
        tooltipEl.style.left = (window.innerWidth - tooltipRect.width - 20) + 'px';
    }
    if (tooltipBounds.left < 20) {
        tooltipEl.style.left = '20px';
    }
}

// Next step
function nextStep() {
    currentStepIndex++;
    showStep(currentStepIndex);
}

// Previous step
function previousStep() {
    currentStepIndex--;
    showStep(currentStepIndex);
}

// Skip onboarding
function skipOnboarding() {
    const confirmed = confirm('Are you sure you want to skip the tour? You can restart it anytime from Settings.');
    
    if (confirmed) {
        cleanupOnboarding();
        completeOnboarding();
    }
}

// Complete onboarding tour
function completeOnboardingTour() {
    cleanupOnboarding();
    
    // Show completion message
    showCompletionScreen();
    
    // Mark as completed
    completeOnboarding();
}

// Show completion screen
function showCompletionScreen() {
    const completion = document.createElement('div');
    completion.className = 'onboarding-welcome';
    
    completion.innerHTML = `
        <div class="onboarding-complete-icon">🎉</div>
        <h1 class="welcome-title">You're All Set!</h1>
        <p class="welcome-subtitle">You're ready to take control of your finances. Start by adding your first transaction!</p>
        
        <div class="welcome-actions">
            <button class="btn btn-primary btn-large btn-block" onclick="closeCompletionScreen()">
                Start Using FinanceTracker
            </button>
        </div>
    `;
    
    document.body.appendChild(completion);
    overlay.classList.add('show');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeCompletionScreen();
    }, 5000);
}

// Close completion screen
function closeCompletionScreen() {
    const completion = document.querySelector('.onboarding-welcome');
    if (completion) {
        completion.remove();
    }
    
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
            overlay = null;
        }, 300);
    }
}

// Cleanup onboarding
function cleanupOnboarding() {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
    
    if (spotlight) {
        spotlight.remove();
        spotlight = null;
    }
    
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay) {
                overlay.remove();
                overlay = null;
            }
        }, 300);
    }
    
    // Remove welcome screen if exists
    const welcome = document.querySelector('.onboarding-welcome');
    if (welcome) {
        welcome.remove();
    }
}

// Auto-start onboarding on first login
function checkAndStartOnboarding() {
    // Only start if user is logged in and hasn't completed onboarding
    if (isLoggedIn && isLoggedIn() && !isOnboardingCompleted()) {
        // Wait for dashboard to load
        setTimeout(() => {
            startOnboarding();
        }, 1000);
    }
}
