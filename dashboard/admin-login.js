/**
 * Admin Login Page JavaScript
 * Handles form validation, authentication, and user interactions
 */

class AdminLogin {
    constructor() {
        this.form = document.getElementById('admin-login-form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('remember-me');
        this.submitButton = document.getElementById('submit-button');
        this.messageContainer = document.getElementById('message-container');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.passwordToggle = document.getElementById('password-toggle');
        
        this.validationRules = {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            password: {
                required: true,
                minLength: 8,
                message: 'Password must be at least 8 characters long'
            }
        };
        
        this.isSubmitting = false;
        this.validationTimeout = null;
        
        this.init();
    }
    
    /**
     * Initialize all event listeners and setup
     */
    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.loadRememberedCredentials();
        
        // Focus first input on load
        setTimeout(() => {
            this.emailInput.focus();
        }, 100);
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation with debouncing
        this.emailInput.addEventListener('input', this.debounceValidation.bind(this, 'email'));
        this.passwordInput.addEventListener('input', this.debounceValidation.bind(this, 'password'));
        
        // Blur validation
        this.emailInput.addEventListener('blur', () => this.validateField('email'));
        this.passwordInput.addEventListener('blur', () => this.validateField('password'));
        
        // Password toggle
        this.passwordToggle.addEventListener('click', this.togglePasswordVisibility.bind(this));
        this.passwordToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.togglePasswordVisibility();
            }
        });
        
        // Support links
        document.getElementById('forgot-password-link').addEventListener('click', this.handleForgotPassword.bind(this));
        document.getElementById('contact-support-link').addEventListener('click', this.handleContactSupport.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Prevent double submission
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isSubmitting) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Enhanced keyboard navigation
        const focusableElements = this.form.querySelectorAll(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((element, index) => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    // Custom tab behavior if needed
                }
            });
        });
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
    }
    
    /**
     * Setup screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        const submitStatus = document.getElementById('submit-status');
        
        // Announce form state changes
        this.announceToScreenReader = (message) => {
            submitStatus.textContent = message;
            setTimeout(() => {
                submitStatus.textContent = '';
            }, 1000);
        };
    }
    
    /**
     * Debounced validation to avoid excessive validation calls
     */
    debounceValidation(fieldName) {
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
            this.validateField(fieldName);
        }, 300);
    }
    
    /**
     * Validate individual field
     */
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = field.closest('.form-group');
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        // Pattern validation (for email)
        else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        // Length validation
        else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message;
        }
        // Custom validation for password strength
        else if (fieldName === 'password' && value) {
            const strengthCheck = this.checkPasswordStrength(value);
            if (!strengthCheck.isValid) {
                isValid = false;
                errorMessage = strengthCheck.message;
            }
        }
        
        this.displayFieldError(formGroup, errorElement, isValid, errorMessage);
        return isValid;
    }
    
    /**
     * Check password strength
     */
    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?\":{}|<>]/.test(password)
        };
        
        const passedChecks = Object.values(checks).filter(Boolean).length;
        
        if (passedChecks < 2) {
            return {
                isValid: false,
                message: 'Password must contain at least letters and numbers'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Display field error
     */
    displayFieldError(formGroup, errorElement, isValid, errorMessage) {
        if (isValid) {
            formGroup.classList.remove('error');
            errorElement.classList.remove('show');
            errorElement.textContent = '';
            errorElement.setAttribute('aria-hidden', 'true');
        } else {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            errorElement.setAttribute('aria-hidden', 'false');
        }
    }
    
    /**
     * Validate entire form
     */
    validateForm() {
        const emailValid = this.validateField('email');
        const passwordValid = this.validateField('password');
        
        return emailValid && passwordValid;
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Clear previous messages
        this.hideMessage();
        
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors below', 'error');
            this.announceToScreenReader('Form validation failed. Please correct the errors.');
            return;
        }
        
        this.isSubmitting = true;
        this.setLoadingState(true);
        
        try {
            const formData = {
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value,
                rememberMe: this.rememberMeCheckbox.checked
            };
            
            // Simulate authentication call
            const result = await this.authenticateUser(formData);
            
            if (result.success) {
                this.handleAuthSuccess(result);
            } else {
                this.handleAuthError(result.message || 'Authentication failed');
            }
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.handleAuthError('An unexpected error occurred. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }
    
    /**
     * Authenticate user (mock implementation)
     */
    async authenticateUser(credentials) {
        // Show loading overlay
        this.loadingOverlay.classList.add('show');
        this.loadingOverlay.setAttribute('aria-hidden', 'false');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock authentication logic
        const validCredentials = {
            'admin@hashicorp.com': 'Admin123!',
            'super@hashicorp.com': 'Super123!',
            'manager@hashicorp.com': 'Manager123!'
        };
        
        const isValid = validCredentials[credentials.email] === credentials.password;
        
        if (isValid) {
            // Store authentication token (mock)
            const token = this.generateMockToken();
            localStorage.setItem('adminToken', token);
            
            if (credentials.rememberMe) {
                localStorage.setItem('rememberedEmail', credentials.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            return {
                success: true,
                token: token,
                user: {
                    email: credentials.email,
                    role: 'admin',
                    lastLogin: new Date().toISOString()
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    }
    
    /**
     * Generate mock authentication token
     */
    generateMockToken() {
        return 'mock_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    /**
     * Handle successful authentication
     */
    handleAuthSuccess(result) {
        this.showMessage('Login successful! Redirecting...', 'success');
        this.announceToScreenReader('Login successful. Redirecting to dashboard.');
        
        // Store user data
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    /**
     * Handle authentication error
     */
    handleAuthError(message) {
        this.showMessage(message, 'error');
        this.announceToScreenReader(`Login failed: ${message}`);
        
        // Focus email field for retry
        setTimeout(() => {
            this.emailInput.focus();
        }, 100);
    }
    
    /**
     * Set loading state
     */
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            this.submitButton.setAttribute('aria-busy', 'true');
            this.loadingOverlay.classList.add('show');
            this.loadingOverlay.setAttribute('aria-hidden', 'false');
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
            this.submitButton.setAttribute('aria-busy', 'false');
            this.loadingOverlay.classList.remove('show');
            this.loadingOverlay.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        this.messageContainer.textContent = message;
        this.messageContainer.className = `message-container ${type} show`;
        this.messageContainer.setAttribute('aria-hidden', 'false');
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage();
            }, 3000);
        }
    }
    
    /**
     * Hide message
     */
    hideMessage() {
        this.messageContainer.classList.remove('show');
        this.messageContainer.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            this.messageContainer.textContent = '';
            this.messageContainer.className = 'message-container';
        }, 300);
    }
    
    /**
     * Toggle password visibility
     */
    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        const icon = this.passwordToggle.querySelector('i');
        
        if (isPassword) {
            this.passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
            this.passwordToggle.setAttribute('aria-label', 'Hide password');
        } else {
            this.passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
            this.passwordToggle.setAttribute('aria-label', 'Show password');
        }
    }
    
    /**
     * Handle forgot password
     */
    handleForgotPassword(e) {
        e.preventDefault();
        
        // Mock forgot password functionality
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showMessage('Please enter your email address first', 'error');
            this.emailInput.focus();
            return;
        }
        
        if (!this.validationRules.email.pattern.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            this.emailInput.focus();
            return;
        }
        
        // Show success message
        this.showMessage(`Password reset instructions sent to ${email}`, 'success');
        this.announceToScreenReader(`Password reset instructions sent to ${email}`);
    }
    
    /**
     * Handle contact support
     */
    handleContactSupport(e) {
        e.preventDefault();
        
        // Mock support contact
        const supportModal = this.createSupportModal();
        document.body.appendChild(supportModal);
        
        // Focus the modal
        setTimeout(() => {
            supportModal.querySelector('.support-close').focus();
        }, 100);
    }
    
    /**
     * Create support modal
     */
    createSupportModal() {
        const modal = document.createElement('div');
        modal.className = 'support-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'support-title');
        modal.setAttribute('aria-modal', 'true');
        
        modal.innerHTML = `
            <div class="support-overlay">
                <div class="support-content">
                    <div class="support-header">
                        <h3 id="support-title">Contact Support</h3>
                        <button class="support-close" aria-label="Close support modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="support-body">
                        <p>Need help accessing your account? Our support team is here to help.</p>
                        <div class="support-options">
                            <a href="mailto:support@hashicorp.com" class="support-option">
                                <i class="fas fa-envelope"></i>
                                <span>Email Support</span>
                                <small>support@hashicorp.com</small>
                            </a>
                            <a href="tel:+1-800-HASHICORP" class="support-option">
                                <i class="fas fa-phone"></i>
                                <span>Phone Support</span>
                                <small>+1-800-HASHICORP</small>
                            </a>
                            <a href="#live-chat" class="support-option">
                                <i class="fas fa-comments"></i>
                                <span>Live Chat</span>
                                <small>Available 24/7</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .support-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .support-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            .support-content {
                background: var(--surface-color);
                border-radius: var(--radius-lg);
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                position: relative;
                z-index: 1;
                border: 1px solid var(--border-color);
            }
            .support-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1.5rem;
            }
            .support-header h3 {
                color: var(--text-primary);
                margin: 0;
            }
            .support-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                transition: all 0.2s ease;
            }
            .support-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }
            .support-body p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
            .support-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .support-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--radius-md);
                text-decoration: none;
                color: var(--text-primary);
                transition: all 0.2s ease;
                border: 1px solid var(--border-color);
            }
            .support-option:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
            .support-option i {
                color: var(--accent-color);
                font-size: 1.2rem;
                width: 24px;
            }
            .support-option span {
                font-weight: 600;
            }
            .support-option small {
                color: var(--text-secondary);
                font-size: 0.85rem;
                margin-top: 0.2rem;
            }
        `;
        modal.appendChild(style);
        
        // Close modal functionality
        const closeModal = () => {
            modal.remove();
        };
        
        modal.querySelector('.support-close').addEventListener('click', closeModal);
        modal.querySelector('.support-overlay').addEventListener('click', closeModal);
        
        // Escape key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        return modal;
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleSubmit(e);
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            this.clearForm();
        }
    }
    
    /**
     * Clear form
     */
    clearForm() {
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.rememberMeCheckbox.checked = false;
        this.hideMessage();
        
        // Clear all validation errors
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message.show').forEach(error => {
            error.classList.remove('show');
        });
        
        this.emailInput.focus();
    }
    
    /**
     * Load remembered credentials
     */
    loadRememberedCredentials() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            this.emailInput.value = rememberedEmail;
            this.rememberMeCheckbox.checked = true;
            this.passwordInput.focus();
        }
    }
    
    /**
     * Check if user is already authenticated
     */
    checkExistingAuth() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Verify token is still valid (mock check)
            const tokenAge = Date.now() - parseInt(token.split('_')[2], 36);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (tokenAge < maxAge) {
                // Redirect to dashboard
                window.location.href = 'index.html';
                return true;
            } else {
                // Clear expired token
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        }
        return false;
    }
}

// Utility functions for reusable components

/**
 * FormInput Component
 */
class FormInput {
    constructor(config) {
        this.container = config.container;
        this.type = config.type || 'text';
        this.name = config.name;
        this.label = config.label;
        this.placeholder = config.placeholder;
        this.required = config.required || false;
        this.validation = config.validation || {};
        
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="form-group">
                <label for="${this.name}" class="form-label">
                    ${this.label}
                </label>
                <div class="input-container">
                    <input 
                        type="${this.type}" 
                        id="${this.name}" 
                        name="${this.name}" 
                        class="form-input" 
                        placeholder="${this.placeholder}"
                        ${this.required ? 'required' : ''}
                        aria-describedby="${this.name}-error"
                    >
                    <div class="input-icon">
                        <i class="fas fa-${this.getIcon()}" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="error-message" id="${this.name}-error" role="alert"></div>
            </div>
        `;
    }
    
    getIcon() {
        const icons = {
            email: 'envelope',
            password: 'lock',
            text: 'user',
            tel: 'phone'
        };
        return icons[this.type] || 'user';
    }
    
    setupEventListeners() {
        const input = this.container.querySelector(`#${this.name}`);
        input.addEventListener('input', () => this.validate());
        input.addEventListener('blur', () => this.validate());
    }
    
    validate() {
        // Validation logic here
        return true;
    }
}

/**
 * AuthButton Component
 */
class AuthButton {
    constructor(config) {
        this.container = config.container;
        this.text = config.text;
        this.type = config.type || 'submit';
        this.onClick = config.onClick;
        
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        this.container.innerHTML = `
            <button 
                type="${this.type}" 
                class="submit-button"
                aria-describedby="submit-status"
            >
                <span class="button-text">${this.text}</span>
                <span class="button-loader" aria-hidden="true">
                    <i class="fas fa-spinner fa-spin"></i>
                </span>
            </button>
        `;
    }
    
    setupEventListeners() {
        const button = this.container.querySelector('.submit-button');
        if (this.onClick) {
            button.addEventListener('click', this.onClick);
        }
    }
    
    setLoading(isLoading) {
        const button = this.container.querySelector('.submit-button');
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const adminLogin = new AdminLogin();
    
    // Check if already authenticated
    if (!adminLogin.checkExistingAuth()) {
        // Show login form
        console.log('Admin login page loaded');
    }
});

// Export components for reuse
window.FormInput = FormInput;
window.AuthButton = AuthButton;