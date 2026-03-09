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
// Navigate to screen (with protection)
function navigateTo(screenId) {
    // Check if screen requires authentication
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
    
    renderScreen(screenId);
    
    // UPDATE SIDEBAR ACTIVE STATE (ADD THIS LINE)
    updateSidebarActive(screenId);
    
    // UPDATE BOTTOM NAV ACTIVE STATE (existing)
    updateBottomNav();
    
    // CLOSE MOBILE SIDEBAR (ADD THIS LINE)
    closeMobileSidebar();
}
