// ========== THEME SYSTEM ==========

// Theme constants
const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
};

const THEME_STORAGE_KEY = 'finance_tracker_theme';

// Get current theme
function getCurrentTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || THEME.LIGHT;
}

// Set theme
function setTheme(theme) {
    // Validate theme
    if (theme !== THEME.LIGHT && theme !== THEME.DARK) {
        console.error('Invalid theme:', theme);
        return;
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update theme toggle button icon
    updateThemeToggleIcon(theme);
    
    console.log('Theme set to:', theme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
    setTheme(newTheme);
}

// Update theme toggle button icon
function updateThemeToggleIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    const icon = themeToggleBtn.querySelector('.theme-icon');
    if (!icon) return;
    
    // Update icon based on theme
    if (theme === THEME.DARK) {
        icon.textContent = '☀️'; // Show sun when in dark mode (click to go light)
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
    } else {
        icon.textContent = '🌙'; // Show moon when in light mode (click to go dark)
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = getCurrentTheme();
    setTheme(savedTheme);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initTheme);
