// DreamBridge Media - Contact Form JavaScript

class ContactFormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFormDisplay();
        this.initFormValidation();
    }

    setupEventListeners() {
        // Path selection buttons
        document.getElementById('creator-path').addEventListener('click', () => {
            this.selectPath('creator');
        });
        
        document.getElementById('brand-path').addEventListener('click', () => {
            this.selectPath('brand');
        });

        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.prevStep();
        });

        // Form submission
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    selectPath(pathType) {
        // Update button states
        const creatorBtn = document.getElementById('creator-path');
        const brandBtn = document.getElementById('brand-path');
        
        if (pathType === 'creator') {
            creatorBtn.classList.add('active');
            brandBtn.classList.remove('active');
            document.getElementById('creator-fields').classList.remove('hidden');
            document.getElementById('brand-fields').classList.add('hidden');
        } else {
            brandBtn.classList.add('active');
            creatorBtn.classList.remove('active');
            document.getElementById('brand-fields').classList.remove('hidden');
            document.getElementById('creator-fields').classList.add('hidden');
        }

        this.formData.pathType = pathType;
        this.animatePathSelection();
    }

    animatePathSelection() {
        // Add path selection animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.path-btn.active',
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeOutBack'
            });
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateFormDisplay();
                this.animateStepTransition('next');
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormDisplay();
            this.animateStepTransition('prev');
        }
    }

    updateFormDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step-${this.currentStep}`).classList.add('active');
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        prevBtn.classList.toggle('hidden', this.currentStep === 1);
        nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
        submitBtn.classList.toggle('hidden', this.currentStep !== this.totalSteps);
        
        // Update step indicators
        this.updateStepIndicators();
        
        // Update progress bar
        this.updateProgressBar();
    }

    updateStepIndicators() {
        const indicators = document.querySelectorAll('.step-dot');
        indicators.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                dot.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                dot.classList.add('completed');
            }
        });
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const percentage = (this.currentStep / this.totalSteps) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    animateStepTransition(direction) {
        if (typeof anime !== 'undefined') {
            const currentStep = document.getElementById(`step-${this.currentStep}`);
            
            if (direction === 'next') {
                anime({
                    targets: currentStep,
                    translateX: [30, 0],
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutQuart'
                });
            } else {
                anime({
                    targets: currentStep,
                    translateX: [-30, 0],
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutQuart'
                });
            }
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for step 3 (services selection)
        if (this.currentStep === 3) {
            const selectedServices = currentStepElement.querySelectorAll('input[name="services"]:checked');
            if (selectedServices.length === 0) {
                this.showError('Please select at least one service you\'re interested in.');
                isValid = false;
            }
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.hasAttribute('required') && !value) {
            this.markFieldError(field, 'This field is required.');
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.markFieldError(field, 'Please enter a valid email address.');
            isValid = false;
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.markFieldError(field, 'Please enter a valid phone number.');
            isValid = false;
        }

        if (isValid) {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    markFieldError(field, message) {
        field.classList.add('form-error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('form-error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearErrors() {
        document.querySelectorAll('.form-error').forEach(field => {
            field.classList.remove('form-error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    showError(message) {
        // Create and show a general error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-center p-4 bg-red-100 text-red-700 rounded-lg mb-4';
        errorDiv.textContent = message;
        
        const currentStep = document.getElementById(`step-${this.currentStep}`);
        currentStep.insertBefore(errorDiv, currentStep.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    setupRealTimeValidation() {
        // Add real-time validation for email and phone fields
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="email"], input[type="tel"]')) {
                // Debounce validation
                clearTimeout(e.target.validationTimeout);
                e.target.validationTimeout = setTimeout(() => {
                    this.validateField(e.target);
                }, 500);
            }
        });

        // Add focus/blur effects
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                e.target.classList.add('focused');
            }
        });

        document.addEventListener('focusout', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                e.target.classList.remove('focused');
            }
        });
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const formElements = currentStepElement.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                if (!this.formData.services) this.formData.services = [];
                if (element.checked) {
                    this.formData.services.push(element.value);
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    this.formData[element.name] = element.value;
                }
            } else {
                this.formData[element.name] = element.value;
            }
        });
    }

    async submitForm() {
        if (this.isSubmitting) return;
        
        if (!this.validateCurrentStep()) {
            return;
        }

        this.isSubmitting = true;
        
        // Save final step data
        this.saveCurrentStepData();
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Prepare form data for submission
            const submissionData = this.prepareSubmissionData();
            
            // Submit to backend (replace with actual endpoint)
            const response = await this.submitToBackend(submissionData);
            
            if (response.success) {
                this.showSuccessState();
                this.exportToExcel(submissionData);
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorState(error.message);
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    prepareSubmissionData() {
        const timestamp = new Date().toISOString();
        
        return {
            ...this.formData,
            submissionTime: timestamp,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            formVersion: '1.0'
        };
    }

    async submitToBackend(data) {
        // Simulate API call - replace with actual backend endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Form submitted successfully' });
            }, 2000);
        });
        
        // Actual implementation would be:
        /*
        const response = await fetch('/api/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
        */
    }

    exportToExcel(data) {
        // Create CSV format for Excel compatibility
        const csvData = this.convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `dreambridge-contact-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        const headers = [
            'Submission Time',
            'Path Type',
            'Full Name',
            'Email',
            'Phone',
            'Location',
            'Company Name',
            'Industry',
            'Primary Platform',
            'Follower Count',
            'Content Niche',
            'Services',
            'Timeline',
            'Goals',
            'Referral Source',
            'Contact Method'
        ];
        
        const values = [
            data.submissionTime || '',
            data.pathType || '',
            data.fullName || '',
            data.email || '',
            data.phone || '',
            data.location || '',
            data.companyName || '',
            data.industry || '',
            data.primaryPlatform || '',
            data.followerCount || '',
            data.contentNiche || '',
            Array.isArray(data.services) ? data.services.join(', ') : '',
            data.timeline || '',
            data.goals || '',
            data.referralSource || '',
            data.contactMethod || ''
        ];
        
        // Escape CSV values
        const escapedValues = values.map(value => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        
        return headers.join(',') + '\n' + escapedValues.join(',');
    }

    showLoadingState() {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        
        // Add loading overlay to form
        const form = document.querySelector('.dreambridge-form');
        form.classList.add('form-loading');
    }

    hideLoadingState() {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
        
        // Remove loading overlay
        const form = document.querySelector('.dreambridge-form');
        form.classList.remove('form-loading');
    }

    showSuccessState() {
        // Show success modal
        if (typeof showSuccessModal === 'function') {
            showSuccessModal();
        }
        
        // Reset form
        setTimeout(() => {
            this.resetForm();
        }, 3000);
    }

    showErrorState(message) {
        this.showError(`Failed to submit form: ${message}. Please try again or contact us directly.`);
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        document.getElementById('contact-form').reset();
        this.selectPath('creator'); // Default to creator path
        this.updateFormDisplay();
        this.clearErrors();
    }

    // Initialize form validation on page load
    initFormValidation() {
        // Add form validation classes and attributes
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
            // Add validation attributes based on field type
            if (field.type === 'email') {
                field.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
            }
            
            // Add accessibility attributes
            field.setAttribute('aria-describedby', field.name + '-help');
        });
    }
}

// Auto-save functionality
class FormAutoSave {
    constructor(formManager) {
        this.formManager = formManager;
        this.storageKey = 'dreambridge-contact-form-draft';
        this.init();
    }

    init() {
        this.loadDraft();
        this.setupAutoSave();
    }

    setupAutoSave() {
        // Save draft every 30 seconds
        setInterval(() => {
            this.saveDraft();
        }, 30000);

        // Save on form changes
        document.addEventListener('input', () => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveDraft();
            }, 2000);
        });

        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveDraft();
        });
    }

    saveDraft() {
        if (Object.keys(this.formManager.formData).length > 0) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                formData: this.formManager.formData,
                currentStep: this.formManager.currentStep,
                timestamp: Date.now()
            }));
        }
    }

    loadDraft() {
        const draft = localStorage.getItem(this.storageKey);
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                const hourAgo = Date.now() - (60 * 60 * 1000);
                
                // Only restore if draft is less than 1 hour old
                if (parsedDraft.timestamp > hourAgo) {
                    this.confirmRestoreDraft(parsedDraft);
                } else {
                    this.clearDraft();
                }
            } catch (error) {
                console.error('Error loading draft:', error);
                this.clearDraft();
            }
        }
    }

    confirmRestoreDraft(draft) {
        const restore = confirm('We found a saved draft of your form. Would you like to restore it?');
        if (restore) {
            this.restoreDraft(draft);
        } else {
            this.clearDraft();
        }
    }

    restoreDraft(draft) {
        this.formManager.formData = draft.formData;
        this.formManager.currentStep = draft.currentStep;
        
        // Restore form fields
        this.populateFormFields();
        this.formManager.updateFormDisplay();
        
        // Restore path selection
        if (draft.formData.pathType) {
            this.formManager.selectPath(draft.formData.pathType);
        }
    }

    populateFormFields() {
        Object.keys(this.formManager.formData).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = this.formManager.formData[key].includes(field.value);
                } else if (field.type === 'radio') {
                    field.checked = field.value === this.formManager.formData[key];
                } else {
                    field.value = this.formManager.formData[key];
                }
            }
        });
    }

    clearDraft() {
        localStorage.removeItem(this.storageKey);
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = new ContactFormManager();
    const autoSave = new FormAutoSave(contactForm);
    
    // Make form manager globally accessible
    window.contactFormManager = contactForm;
});

// Export functions for global access
window.ContactFormManager = ContactFormManager;