<<<<<<< HEAD
function navigateTo(page) {

const pages = [
"landing-page",
"login-page",
"register-page",
"home-page"
];

pages.forEach(id => {
const el = document.getElementById(id);
if(el){
el.style.display = "none";
}
});

if(page === "login"){
document.getElementById("login-page").style.display = "block";
}

if(page === "register"){
document.getElementById("register-page").style.display = "block";
}

if(page === "home"){
document.getElementById("home-page").style.display = "block";
}

}
=======
// ========== ROUTING & PAGE PROTECTION ==========

// Available screens
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
    activeScreen = SCREENS.LOGIN;
    renderScreen(SCREENS.LOGIN);
}

// Show register page
function showRegisterPage() {
    showAuthLayout();
    activeScreen = SCREENS.REGISTER;
    renderScreen(SCREENS.REGISTER);
}

>>>>>>> 7fad57c0641672759daa75d83150492e094d2f07
// Navigate to screen (with protection)
function navigateTo(screenId) {
    // Check if screen requires authentication
    if (!PUBLIC_SCREENS.includes(screenId) && !isLoggedIn()) {
<<<<<<< HEAD
        showLoginPage();
        return;
    }
    
    activeScreen = screenId;
    
=======
        // Protected screen, user not logged in
        showLoginPage();
        return;
    }

    // Update active screen
    activeScreen = screenId;

    // Show appropriate layout
>>>>>>> 7fad57c0641672759daa75d83150492e094d2f07
    if (PUBLIC_SCREENS.includes(screenId)) {
        showAuthLayout();
    } else {
        showAppLayout();
    }
<<<<<<< HEAD
    
    renderScreen(screenId);
    
    // UPDATE SIDEBAR ACTIVE STATE (ADD THIS LINE)
    updateSidebarActive(screenId);
    
    // UPDATE BOTTOM NAV ACTIVE STATE (existing)
    updateBottomNav();
    
    // CLOSE MOBILE SIDEBAR (ADD THIS LINE)
    closeMobileSidebar();
=======

    // Sync app state and render
    currentScreen = screenId;
    renderScreen(screenId);

    // Update bottom nav for app screens
    if (!PUBLIC_SCREENS.includes(screenId) && typeof updateBottomNav === 'function') {
        updateBottomNav();
    }
}

// Handle logout
function handleLogout() {
    logoutUser();
    showLandingPage();
>>>>>>> 7fad57c0641672759daa75d83150492e094d2f07
}
