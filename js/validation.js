// ========== FORM VALIDATION ==========

// Validate email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate password strength
function validatePassword(password) {
    const strength = {
        score: 0,
        feedback: []
    };
    
    if (password.length >= 6) strength.score++;
    if (password.length >= 10) strength.score++;
    if (/[A-Z]/.test(password)) strength.score++;
    if (/[0-9]/.test(password)) strength.score++;
    if (/[^A-Za-z0-9]/.test(password)) strength.score++;
    
    // Feedback
    if (password.length < 6) {
        strength.feedback.push('At least 6 characters');
    }
    if (!/[A-Z]/.test(password)) {
        strength.feedback.push('Add uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        strength.feedback.push('Add a number');
    }
    
    // Determine level
    if (strength.score <= 2) {
        strength.level = 'weak';
        strength.color = 'var(--color-danger)';
    } else if (strength.score <= 4) {
        strength.level = 'medium';
        strength.color = 'var(--color-warning)';
    } else {
        strength.level = 'strong';
        strength.color = 'var(--color-success)';
    }
    
    return strength;
}

// Add real-time validation to input
function addInputValidation(inputElement, validationFunction, errorMessage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-with-validation';
    
    // Wrap input
    inputElement.parentNode.insertBefore(wrapper, inputElement);
    wrapper.appendChild(inputElement);
    
    // Create validation icon
    const icon = document.createElement('span');
    icon.className = 'validation-icon';
    icon.style.display = 'none';
    wrapper.appendChild(icon);
    
    // Create error message
    const errorEl = document.createElement('div');
    errorEl.className = 'error-text';
    errorEl.style.display = 'none';
    errorEl.innerHTML = `<span class="error-text-icon">⚠️</span><span>${errorMessage}</span>`;
    wrapper.appendChild(errorEl);
    
    // Validate on input
    inputElement.addEventListener('input', function() {
        const value = this.value;
        
        if (value === '') {
            // Empty - reset
            this.classList.remove('error', 'success');
            icon.style.display = 'none';
            errorEl.style.display = 'none';
            return;
        }
        
        const isValid = validationFunction(value);
        
        if (isValid) {
            // Valid
            this.classList.remove('error');
            this.classList.add('success');
            icon.textContent = '✓';
            icon.className = 'validation-icon success';
            icon.style.display = 'block';
            errorEl.style.display = 'none';
        } else {
            // Invalid
            this.classList.remove('success');
            this.classList.add('error');
            icon.textContent = '✕';
            icon.className = 'validation-icon error';
            icon.style.display = 'block';
            errorEl.style.display = 'flex';
            
            // Shake animation
            shakeElement(this);
        }
    });
}

// Enhanced password strength meter
function initPasswordStrength(passwordInput) {
    const strengthBar = document.getElementById('password-strength-bar');
    if (!strengthBar) return;
    
    passwordInput.addEventListener('input', function() {
        const strength = validatePassword(this.value);
        
        if (this.value === '') {
            strengthBar.className = 'password-strength-bar';
            return;
        }
        
        strengthBar.className = `password-strength-bar ${strength.level}`;
        strengthBar.style.backgroundColor = strength.color;
    });
}

// Validate required fields
function validateRequired(value) {
    return value.trim() !== '';
}

// Validate number
function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    
    return true;
}

// Validate form
function validateForm(formElement) {
    let isValid = true;
    const errors = [];
    
    // Get all required inputs
    const requiredInputs = formElement.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            errors.push(`${input.name || 'Field'} is required`);
        } else {
            input.classList.remove('error');
        }
    });
    
    // Validate email inputs
    const emailInputs = formElement.querySelectorAll('[type="email"]');
    emailInputs.forEach(input => {
        if (input.value && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            errors.push('Invalid email format');
        }
    });
    
    return { isValid, errors };
}
