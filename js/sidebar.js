// ========== SIDEBAR FUNCTIONALITY ==========

// Update active sidebar link
function updateSidebarActive(screenId) {
    // Remove active from all links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active to current screen
    const activeLink = document.querySelector(`.sidebar-link[data-screen="${screenId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Update sidebar user info
function updateSidebarUser() {
    const user = getCurrentUser();
    if (!user) return;
    
    const usernameEl = document.getElementById('sidebar-username');
    const avatarEl = document.getElementById('sidebar-avatar');
    
    if (usernameEl) {
        usernameEl.textContent = user.name;
    }
    
    if (avatarEl) {
        avatarEl.textContent = user.avatar || '👤';
    }
}

// Toggle mobile sidebar
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('show');
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    }
}

// Initialize sidebar when logged in
function initSidebar() {
    if (isLoggedIn()) {
        updateSidebarUser();
    }
}

// Call on DOM load
document.addEventListener('DOMContentLoaded', initSidebar);
