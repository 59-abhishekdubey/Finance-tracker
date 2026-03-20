// ========== ANIMATION UTILITIES ==========

// Animate number counting up
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        // Format based on element's data attribute
        if (element.dataset.format === 'currency') {
            element.textContent = formatCurrency(Math.round(current));
        } else if (element.dataset.format === 'percentage') {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Stagger animation for multiple elements
function staggerAnimation(elements, animationClass = 'animate-fadeIn', delay = 100) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * delay);
    });
}

// Confetti explosion (for achievements)
function triggerConfetti(count = 50) {
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        
        // Random color
        const colors = [
            'var(--color-primary)',
            '#6366F1',
            '#EC4899',
            '#F59E0B',
            '#10B981'
        ];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random animation delay
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Shake element (for errors)
function shakeElement(element) {
    element.classList.add('shake');
    
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Success pulse animation
function successPulse(element) {
    element.classList.add('success-animation');
    
    setTimeout(() => {
        element.classList.remove('success-animation');
    }, 600);
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Scroll reveal animations
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    const elementInView = (el, offset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight - offset);
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check
}

// Close modal with animation
function closeModalAnimated(modal) {
    modal.classList.add('closing');
    
    setTimeout(() => {
        if (modal && modal.parentNode) {
            modal.remove();
        }
    }, 200);
}

// Progress bar animation
function animateProgressBar(progressBar, targetWidth, duration = 1000) {
    progressBar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    setTimeout(() => {
        progressBar.style.width = targetWidth + '%';
    }, 50);
}

// Ripple effect on click
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animations
    initScrollAnimations();
});
