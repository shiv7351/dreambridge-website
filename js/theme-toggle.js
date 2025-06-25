// DreamBridge Media - Theme Toggle System

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggleButton = null;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.transitionDuration = 500;
        
        this.init();
    }

    init() {
        this.toggleButton = document.getElementById('theme-toggle');
        if (!this.toggleButton) return;

        // Load saved theme or use system preference
        this.loadTheme();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme, false);
        
        // Update UI
        this.updateToggleButton();
    }

    loadTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('dreambridge-theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else if (this.prefersDark.matches) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
    }

    setupEventListeners() {
        // Toggle button click
        this.toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // System theme change
        this.prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('dreambridge-theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
                this.updateToggleButton();
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        if (theme === this.currentTheme) return;

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme();
        this.updateToggleButton();
        this.triggerThemeChange();
    }

    applyTheme(theme, animated = true) {
        const html = document.documentElement;
        const body = document.body;

        if (animated) {
            this.createThemeTransition();
        }

        if (theme === 'dark') {
            html.classList.add('dark');
            body.classList.add('dark');
        } else {
            html.classList.remove('dark');
            body.classList.remove('dark');
        }

        // Update CSS custom properties for smooth transitions
        this.updateCustomProperties(theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    createThemeTransition() {
        // Create smooth transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'light' ? '#1f2937' : '#ffffff'};
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity ${this.transitionDuration}ms ease-in-out;
        `;

        document.body.appendChild(overlay);

        // Trigger transition
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.3';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, this.transitionDuration);
            }, this.transitionDuration / 2);
        });

        // Add smooth transition to all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
        });

        // Remove transition after animation
        setTimeout(() => {
            allElements.forEach(el => {
                el.style.transition = '';
            });
        }, this.transitionDuration);
    }

    updateCustomProperties(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#111827');
            root.style.setProperty('--bg-secondary', '#1f2937');
            root.style.setProperty('--text-primary', '#f9fafb');
            root.style.setProperty('--text-secondary', '#d1d5db');
            root.style.setProperty('--border-color', '#374151');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f9fafb');
            root.style.setProperty('--text-primary', '#111827');
            root.style.setProperty('--text-secondary', '#6b7280');
            root.style.setProperty('--border-color', '#e5e7eb');
        }
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#1f2937' : '#ffffff';
    }

    updateToggleButton() {
        if (!this.toggleButton) return;

        const sunIcon = this.toggleButton.querySelector('.fa-sun');
        const moonIcon = this.toggleButton.querySelector('.fa-moon');

        if (this.currentTheme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            this.toggleButton.setAttribute('aria-label', 'Switch to light mode');
            this.toggleButton.title = 'Switch to light mode';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            this.toggleButton.setAttribute('aria-label', 'Switch to dark mode');
            this.toggleButton.title = 'Switch to dark mode';
        }

        // Add rotation animation to button
        this.animateToggleButton();
    }

    animateToggleButton() {
        if (!this.toggleButton) return;

        this.toggleButton.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            this.toggleButton.style.transform = 'rotate(0deg)';
        }, 200);
    }

    saveTheme() {
        localStorage.setItem('dreambridge-theme', this.currentTheme);
    }

    triggerThemeChange() {
        // Dispatch custom event for other components
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                previousTheme: this.currentTheme === 'light' ? 'dark' : 'light'
            }
        });
        
        document.dispatchEvent(event);

        // Update WebGL bridge if available
        if (window.webglBridge && typeof window.webglBridge.updateTheme === 'function') {
            window.webglBridge.updateTheme(this.currentTheme);
        }

        // Update animations if available
        if (window.dreamBridgeAnimations) {
            this.updateAnimationsTheme();
        }
    }

    updateAnimationsTheme() {
        // Update particle colors and effects based on theme
        const particles = document.querySelectorAll('.floating-word');
        particles.forEach(particle => {
            if (this.currentTheme === 'dark') {
                particle.style.filter = 'brightness(1.2) contrast(1.1)';
            } else {
                particle.style.filter = 'brightness(0.9) contrast(0.9)';
            }
        });

        // Update glow effects
        const glowElements = document.querySelectorAll('.service-card, .pillar, .cta-button');
        glowElements.forEach(element => {
            if (this.currentTheme === 'dark') {
                element.style.boxShadow = element.style.boxShadow.replace(/rgba\(0,0,0/g, 'rgba(255,255,255');
            } else {
                element.style.boxShadow = element.style.boxShadow.replace(/rgba\(255,255,255/g, 'rgba(0,0,0');
            }
        });
    }

    // Special "DreamScroll" effect at midnight
    initMidnightEffect() {
        const checkMidnight = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            
            // Check if it's around midnight (11:59 PM to 12:01 AM)
            if ((hours === 23 && minutes >= 59) || (hours === 0 && minutes <= 1)) {
                this.activateMidnightMode();
            }
        };

        // Check every minute
        setInterval(checkMidnight, 60000);
        checkMidnight(); // Check immediately
    }

    activateMidnightMode() {
        if (document.body.classList.contains('midnight-mode')) return;

        document.body.classList.add('midnight-mode');
        
        // Add special styling
        const style = document.createElement('style');
        style.id = 'midnight-style';
        style.textContent = `
            .midnight-mode {
                background: linear-gradient(45deg, #0f0f23, #1a1a3a) !important;
            }
            .midnight-mode .floating-word {
                animation-duration: 20s !important;
                opacity: 0.8 !important;
                filter: drop-shadow(0 0 10px #6366f1) !important;
            }
            .midnight-mode .hero-slide {
                filter: sepia(0.3) contrast(0.8) !important;
            }
        `;
        document.head.appendChild(style);

        // Add ambient sound effect (optional)
        this.playMidnightSound();

        // Remove midnight mode after 2 minutes
        setTimeout(() => {
            document.body.classList.remove('midnight-mode');
            const midnightStyle = document.getElementById('midnight-style');
            if (midnightStyle) {
                midnightStyle.remove();
            }
        }, 120000);
    }

    playMidnightSound() {
        // Create soft ambient sound
        if (typeof AudioContext !== 'undefined') {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
        }
    }

    // Theme presets for different times of day
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        
        if (hour >= 6 && hour < 18) {
            return 'light'; // Daytime
        } else if (hour >= 18 && hour < 22) {
            return 'twilight'; // Evening
        } else {
            return 'dark'; // Night
        }
    }

    // Auto theme switching based on time
    enableAutoTheme() {
        const updateThemeByTime = () => {
            if (!localStorage.getItem('dreambridge-theme')) {
                const timeTheme = this.getTimeBasedTheme();
                if (timeTheme !== this.currentTheme) {
                    this.setTheme(timeTheme);
                }
            }
        };

        // Check every hour
        setInterval(updateThemeByTime, 3600000);
        updateThemeByTime(); // Check immediately
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Initialize theme manager
let themeManager;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    
    // Initialize midnight effect
    themeManager.initMidnightEffect();
    
    // Optional: Enable auto theme switching
    // themeManager.enableAutoTheme();
});

// Export for global use
window.ThemeManager = ThemeManager;
window.getThemeManager = () => themeManager;

// Legacy support for existing theme toggle functions
window.toggleTheme = () => {
    if (themeManager) {
        themeManager.toggleTheme();
    }
};

window.setTheme = (theme) => {
    if (themeManager) {
        themeManager.setTheme(theme);
    }
};
