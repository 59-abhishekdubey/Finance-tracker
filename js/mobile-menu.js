// ============================================
// MOBILE MENU - COMPLETE WORKING VERSION
// ============================================

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    // Setup hamburger button click handler
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileSidebar();
        });
    }
    
    // Setup mobile menu toggle (alternate hamburger)
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileSidebar();
        });
    }
    
    // Setup overlay click to close
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }
    
    // Close sidebar when a navigation link is clicked
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileSidebar();
        });
    });
}

// Toggle sidebar open/close
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (!sidebar) return;
    
    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
        closeMobileSidebar();
    } else {
        sidebar.classList.add('mobile-open');
        sidebar.style.display = 'flex';
        if (overlay) overlay.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close sidebar
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
    }
    if (overlay) overlay.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Make functions globally accessible
if (typeof globalThis !== 'undefined') {
    globalThis.toggleMobileSidebar = toggleMobileSidebar;
    globalThis.closeMobileSidebar = closeMobileSidebar;
    globalThis.initMobileMenu = initMobileMenu;
}

console.log('✅ Mobile menu functionality loaded');
