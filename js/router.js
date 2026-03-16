// ========== ROUTING & PAGE PROTECTION ==========

const SCREENS = {
    LANDING: 'landing',
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'home',
    STATS: 'stats',
    ANALYTICS: 'analytics',
    AI: 'ai',
    SETTINGS: 'settings',
    PROFILE: 'profile'
};

const PUBLIC_SCREENS = [SCREENS.LANDING, SCREENS.LOGIN, SCREENS.REGISTER];

let activeScreen = SCREENS.LANDING;

// Initialize router on page load
function initRouter() {
    if (isLoggedIn()) {
        showAppLayout();
        switchScreen(SCREENS.DASHBOARD);
    } else {
        showLandingPage();
    }
}

// Show app layout (sidebar + header + main content)
function showAppLayout() {
    document.body.classList.add('app-layout');
    document.body.classList.remove('auth-layout');

    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bottomNav = document.querySelector('.bottom-nav');
    const globalFooter = document.getElementById('global-footer');

    if (sidebar) sidebar.style.display = 'flex';
    if (header) header.style.display = 'flex';
    if (bottomNav) bottomNav.style.display = 'flex';
    if (globalFooter) globalFooter.style.display = 'block';

    // Update user info in sidebar and header
    if (typeof updateSidebarUser === 'function') updateSidebarUser();
    if (typeof updateHeaderUser === 'function') updateHeaderUser();
}

// Show landing/auth layout (no sidebar)
function showAuthLayout() {
    document.body.classList.add('auth-layout');
    document.body.classList.remove('app-layout');

    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bottomNav = document.querySelector('.bottom-nav');
    const globalFooter = document.getElementById('global-footer');

    if (sidebar) sidebar.style.display = 'none';
    if (header) header.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
    if (globalFooter) globalFooter.style.display = 'block';
}

// Show landing page
function showLandingPage() {
    showAuthLayout();
    // Hide global footer on landing (landing has its own footer)
    const globalFooter = document.getElementById('global-footer');
    if (globalFooter) globalFooter.style.display = 'none';
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

// Navigate to screen (with protection)
function navigateTo(screenId) {
    if (!PUBLIC_SCREENS.includes(screenId) && !isLoggedIn()) {
        showLoginPage();
        return;
    }

    activeScreen = screenId;

    if (PUBLIC_SCREENS.includes(screenId)) {
        showAuthLayout();
    } else {
        showAppLayout();
    }

    currentScreen = screenId;
    renderScreen(screenId);

    // Update sidebar active state
    if (typeof updateSidebarActive === 'function') {
        updateSidebarActive(screenId);
    }

    // Update header title
    if (typeof updateHeaderTitle === 'function') {
        updateHeaderTitle(screenId);
    }

    // Update bottom nav for app screens
    if (!PUBLIC_SCREENS.includes(screenId) && typeof updateBottomNav === 'function') {
        updateBottomNav();
    }

    // Close mobile sidebar
    if (typeof closeMobileSidebar === 'function') {
        closeMobileSidebar();
    }
}

// Handle logout
function handleLogout() {
    logoutUser();
    showLandingPage();
}
