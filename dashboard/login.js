document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const loginButton = document.querySelector('.login-button');

    // Email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation requirements
    const passwordRequirements = {
        minLength: 8,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
    };

    // Real-time email validation
    emailInput.addEventListener('input', function() {
        validateEmail();
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        validatePassword();
    });

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type');
        const newType = type === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', newType);
        
        // Update icon
        const icon = this.querySelector('i');
        icon.className = newType === 'password' ? 'far fa-eye' : 'far fa-eye-slash';
        
        // Update aria-label
        this.setAttribute('aria-label', 
            newType === 'password' ? 'Show password' : 'Hide password'
        );
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate both fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            // Add loading state
            loginButton.classList.add('loading');
            loginButton.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Redirect to dashboard on success
                window.location.href = 'index.html';
            } catch (error) {
                showError('login-error', 'An error occurred. Please try again.');
            } finally {
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
            }
        }
    });

    // Email validation function
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        
        if (email === '') {
            showError(errorElement, 'Email is required');
            return false;
        }
        
        if (!emailPattern.test(email)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        }
        
        clearError(errorElement);
        return true;
    }

    // Password validation function
    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('password-error');
        let errors = [];

        if (password.length < passwordRequirements.minLength) {
            errors.push('at least 8 characters');
        }
        if (!passwordRequirements.hasUpperCase.test(password)) {
            errors.push('an uppercase letter');
        }
        if (!passwordRequirements.hasLowerCase.test(password)) {
            errors.push('a lowercase letter');
        }
        if (!passwordRequirements.hasNumber.test(password)) {
            errors.push('a number');
        }
        if (!passwordRequirements.hasSpecial.test(password)) {
            errors.push('a special character');
        }

        if (errors.length > 0) {
            showError(errorElement, 'Password must contain ' + errors.join(', '));
            return false;
        }

        clearError(errorElement);
        return true;
    }

    // Helper functions for error handling
    function showError(element, message) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        element.textContent = message;
        element.closest('.form-group').querySelector('input').classList.add('error');
    }

    function clearError(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        element.textContent = '';
        element.closest('.form-group').querySelector('input').classList.remove('error');
    }

    // Handle focus and blur events for better UX
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
            // Validate on blur for better user experience
            if (this.type === 'email') {
                validateEmail();
            } else if (this.type === 'password') {
                validatePassword();
            }
        });
    });
});