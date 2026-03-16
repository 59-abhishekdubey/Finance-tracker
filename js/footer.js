// ===== FOOTER FUNCTIONALITY =====

/**
 * Initialize footer functionality
 */
function initFooter() {
    setupNewsletterForm();
    updateFooterVisibility();
    setupFooterLinks();
    handleFooterResponsive();
    initializeSocialLinks();
    updateSocialLinks();
    setupFooterAnimations();
    updateFooterMargin();
}

/**
 * Setup newsletter form submission
 */
function setupNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = form.querySelector('.newsletter-input');
        const email = input.value.trim();
        const successMessage = document.getElementById('newsletter-success');
        
        // Validate email
        if (!isValidEmail(email)) {
            console.warn('Invalid email format', email);
            return;
        }
        
        // Try to subscribe
        try {
            // Store subscription in localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            
            if (subscribers.includes(email)) {
                console.log('Email already subscribed:', email);
                return;
            }
            
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
            // Show success message
            successMessage.classList.add('show');
            input.value = '';
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
            
            console.log('Newsletter subscription successful:', email);
        } catch (error) {
            console.error('Newsletter subscription error:', error);
        }
    });
}

/**
 * Update footer visibility based on current page
 */
function updateFooterVisibility() {
    const footer = document.getElementById('global-footer');
    if (!footer) return;
    
    // Check if user is logged in
    const isLoggedInUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (isLoggedInUser) {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle footer links
 */
function setupFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-link, .footer-bottom-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Prevent default if it's a hash link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/**
 * Adjust footer margin based on sidebar state
 */
function updateFooterMargin() {
    const footer = document.querySelector('.site-footer');
    const sidebar = document.getElementById('sidebar');
    
    if (!footer || !sidebar) return;
    
    // Check if sidebar is visible and not collapsed
    const isSidebarVisible = window.getComputedStyle(sidebar).display !== 'none';
    const isMobile = window.innerWidth < 768;
    
    if (isSidebarVisible && !isMobile) {
        footer.style.marginLeft = '250px';
    } else {
        footer.style.marginLeft = '0';
    }
}

/**
 * Handle responsive footer adjustments
 */
function handleFooterResponsive() {
    window.addEventListener('resize', () => {
        updateFooterMargin();
    });
}

/**
 * Initialize social links
 */
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Update social links for real URLs
 */
function updateSocialLinks(socialLinks) {
    const footerSocialLinks = document.querySelectorAll('.social-link');
    const links = {
        twitter: 'https://twitter.com',
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
    };
    
    footerSocialLinks.forEach(link => {
        const icon = link.querySelector('i');
        if (icon && icon.classList[1]) {
            const platform = icon.classList[1].replace('fa-', '');
            if (links[platform]) {
                link.href = links[platform];
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        }
    });
}

/**
 * Setup footer animations on scroll
 */
function setupFooterAnimations() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.style.opacity = '1';
                    footer.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(footer);
    }
}

/**
 * Show footer on authenticated pages
 */
function showFooter(show = true) {
    const footer = document.getElementById('global-footer');
    if (footer) {
        footer.style.display = show ? 'block' : 'none';
    }
}

/**
 * Hide footer
 */
function hideFooter() {
    showFooter(false);
}

/**
 * Initialize all footer features when DOM is ready
 */
function initFooterOnDOMReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }
}

// Auto-initialize on script load
initFooterOnDOMReady();
