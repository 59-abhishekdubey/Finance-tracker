// ========== ROUTING & PAGE PROTECTION ==========

// Available screens
const SCREENS = {
    LANDING: 'landing',
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'home',
    STATS: 'stats',
    ANALYTICS: 'analytics',
    INCOME: 'income',
    REPORTS: 'reports',
    RECURRING: 'recurring',
    AI: 'ai',
    SETTINGS: 'settings',
    PROFILE: 'profile'
};

// Public screens (accessible without login)
const PUBLIC_SCREENS = [SCREENS.LANDING, SCREENS.LOGIN, SCREENS.REGISTER];

// Current active screen
let activeScreen = SCREENS.LANDING;

// Initialize router on page load
function initRouter() {
    // Check if user is logged in
    if (isLoggedIn()) {
        // User is logged in, show dashboard
        showAppLayout();
        switchScreen(SCREENS.DASHBOARD);
        // Update sidebar active indicator
        updateSidebarActive(SCREENS.DASHBOARD);
    } else {
        // User not logged in, show landing page
        showLandingPage();
    }
}

// Show app layout (sidebar + main content)
function showAppLayout() {
    document.body.classList.add('app-layout');
    document.body.classList.remove('auth-layout');
    
    // Show sidebar and header
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (sidebar) sidebar.style.display = 'flex';
    if (header) header.style.display = 'flex';
    if (bottomNav) bottomNav.style.display = 'flex';
}

// Show landing/auth layout (no sidebar)
function showAuthLayout() {
    document.body.classList.add('auth-layout');
    document.body.classList.remove('app-layout');
    
    // Hide sidebar and header
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (sidebar) sidebar.style.display = 'none';
    if (header) header.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
}

// Show landing page
function showLandingPage() {
    showAuthLayout();
    activeScreen = SCREENS.LANDING;
    renderScreen(SCREENS.LANDING);
}

// Show login page
function showLoginPage() {
    showAuthLayout();
    // Hide global footer on login page (login page has its own footer in the card)
    const globalFooter = document.getElementById('global-footer');
    if (globalFooter) globalFooter.style.display = 'none';
    activeScreen = SCREENS.LOGIN;
    renderScreen(SCREENS.LOGIN);
}

// Show register page
function showRegisterPage() {
    showAuthLayout();
    // Hide global footer on register page (register page has its own footer in the card)
    const globalFooter = document.getElementById('global-footer');
    if (globalFooter) globalFooter.style.display = 'none';
    activeScreen = SCREENS.REGISTER;
    renderScreen(SCREENS.REGISTER);
}

// Update sidebar active indicator
function updateSidebarActive(screenId) {
    // Remove active class from all sidebar links
    const allLinks = document.querySelectorAll('.sidebar-link');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the current screen link
    const currentLink = document.querySelector(`.sidebar-link[data-screen="${screenId}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Navigate to screen (with protection)
function navigateTo(screenId) {
    // Check if screen requires authentication
    if (!PUBLIC_SCREENS.includes(screenId) && !isLoggedIn()) {
        // Protected screen, user not logged in
        showLoginPage();
        return;
    }
    
    // Update active screen
    activeScreen = screenId;
    
    // Show appropriate layout
    if (PUBLIC_SCREENS.includes(screenId)) {
        showAuthLayout();
    } else {
        showAppLayout();
        // Update sidebar active indicator for app screens
        updateSidebarActive(screenId);
    }
    
    // Render screen
    renderScreen(screenId);
    
    // Update bottom nav if in app (not auth pages)
    if (!PUBLIC_SCREENS.includes(screenId)) {
        updateBottomNav(screenId);
    }
}

// Handle logout
function handleLogout() {
    logoutUser();
    showLandingPage();
}

// Override the existing switchScreen function to use router
if (typeof window !== 'undefined') {
    window.switchScreen = function(screenId) {
        navigateTo(screenId);
    };
}
