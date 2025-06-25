// DreamBridge Media - Advanced Animations with Anime.js

class DreamBridgeAnimations {
    constructor() {
        this.isInitialized = false;
        this.scrollObserver = null;
        this.animationQueue = [];
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollObserver();
        this.initHeroAnimations();
        this.initServiceAnimations();
        this.initParallaxEffects();
        this.initMorphingElements();
        this.initFloatingElements();
        this.initGlowEffects();
        this.initTextAnimations();
        
        this.isInitialized = true;
    }

    // Setup Intersection Observer for scroll-triggered animations
    setupScrollObserver() {
        const options = {
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
            rootMargin: '0px 0px -100px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, options);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .service-card, .pillar, .feature-item, .process-step').forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    // Hero Section Animations
    initHeroAnimations() {
        // Logo entrance animation
        anime({
            targets: '.hero-logo',
            opacity: [0, 1],
            translateY: [60, 0],
            scale: [0.8, 1],
            duration: 1200,
            easing: 'easeOutBack',
            delay: 500
        });

        // Tagline carousel animation
        this.animateTaglineCarousel();

        // CTA buttons animation
        anime({
            targets: '.cta-button',
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.9, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(200, {start: 1000})
        });

        // Scroll indicator animation
        anime({
            targets: '.scroll-indicator',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
            easing: 'easeOutSine',
            delay: 1500,
            loop: true,
            direction: 'alternate'
        });
    }

    // Tagline Carousel with smooth transitions
    animateTaglineCarousel() {
        const taglines = document.querySelectorAll('.tagline');
        if (taglines.length === 0) return;

        let currentIndex = 0;

        const showTagline = (index) => {
            taglines.forEach((tagline, i) => {
                if (i === index) {
                    anime({
                        targets: tagline,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        scale: [0.95, 1],
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                } else {
                    anime({
                        targets: tagline,
                        opacity: [1, 0],
                        translateY: [0, -30],
                        scale: [1, 0.95],
                        duration: 600,
                        easing: 'easeInQuart'
                    });
                }
            });
        };

        // Initial animation
        showTagline(0);

        // Cycle through taglines
        setInterval(() => {
            currentIndex = (currentIndex + 1) % taglines.length;
            showTagline(currentIndex);
        }, 4000);
    }

    // Service Cards Animations
    initServiceAnimations() {
        document.querySelectorAll('.service-card').forEach((card, index) => {
            // Initial state
            anime.set(card, {
                opacity: 0,
                translateY: 50,
                scale: 0.9
            });

            // Hover animations
            this.setupServiceCardHover(card);
        });
    }

    setupServiceCardHover(card) {
        const orb = card.querySelector('.service-orb');
        const icon = orb?.querySelector('i');

        card.addEventListener('mouseenter', () => {
            // Card hover animation
            anime({
                targets: card,
                translateY: -12,
                scale: 1.03,
                boxShadow: ['0 10px 20px rgba(99, 102, 241, 0.1)', '0 25px 50px rgba(99, 102, 241, 0.25)'],
                duration: 400,
                easing: 'easeOutQuart'
            });

            // Orb animation
            if (orb) {
                anime({
                    targets: orb,
                    scale: 1.15,
                    rotate: 15,
                    duration: 300,
                    easing: 'easeOutBack'
                });
            }

            // Icon animation
            if (icon) {
                anime({
                    targets: icon,
                    scale: 1.2,
                    rotate: 10,
                    duration: 300,
                    easing: 'easeOutBack'
                });
            }

            // Shimmer effect
            this.createShimmerEffect(card);
        });

        card.addEventListener('mouseleave', () => {
            // Reset animations
            anime({
                targets: card,
                translateY: 0,
                scale: 1,
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.1)',
                duration: 300,
                easing: 'easeOutQuart'
            });

            if (orb) {
                anime({
                    targets: orb,
                    scale: 1,
                    rotate: 0,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }

            if (icon) {
                anime({
                    targets: icon,
                    scale: 1,
                    rotate: 0,
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            }
        });
    }

    // Shimmer effect for cards
    createShimmerEffect(element) {
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(shimmer);

        anime({
            targets: shimmer,
            left: '100%',
            duration: 800,
            easing: 'easeInOutQuart',
            complete: () => {
                element.removeChild(shimmer);
            }
        });
    }

    // Parallax Effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                
                anime.set(element, {
                    translateY: yPos
                });
            });
        });
    }

    // Morphing Elements
    initMorphingElements() {
        document.querySelectorAll('.morph-on-scroll').forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    // Floating Elements Animation
    initFloatingElements() {
        document.querySelectorAll('.floating-img').forEach((img, index) => {
            anime({
                targets: img,
                translateY: [
                    { value: -20, duration: 2000 },
                    { value: 0, duration: 2000 }
                ],
                rotate: [
                    { value: 2, duration: 2000 },
                    { value: -2, duration: 2000 },
                    { value: 0, duration: 2000 }
                ],
                easing: 'easeInOutSine',
                loop: true,
                delay: index * 1000
            });
        });

        // Floating words
        this.animateFloatingWords();
    }

    animateFloatingWords() {
        const container = document.querySelector('.floating-words');
        if (!container) return;

        const words = ['Legacy', 'Real Influence', 'Creator Power', 'Dreams', 'Innovation', 'Bridge', 'Success', 'Authenticity'];
        
        const createFloatingWord = () => {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[Math.floor(Math.random() * words.length)];
            word.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 1.5 + 1}rem;
                font-weight: 600;
                opacity: 0;
                left: ${Math.random() * 100}%;
                top: 100%;
                pointer-events: none;
                background: linear-gradient(45deg, #6366f1, #ec4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            `;
            
            container.appendChild(word);

            // Animate the floating word
            anime({
                targets: word,
                translateY: [0, -window.innerHeight - 100],
                translateX: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 0.6, 0.6, 0],
                rotate: [0, Math.random() * 360],
                scale: [0.8, 1.2, 0.8],
                duration: Math.random() * 10000 + 8000,
                easing: 'linear',
                complete: () => {
                    if (word.parentNode) {
                        word.parentNode.removeChild(word);
                    }
                }
            });
        };

        // Create floating words at intervals
        setInterval(createFloatingWord, 3000);
        
        // Create initial words
        for (let i = 0; i < 3; i++) {
            setTimeout(createFloatingWord, i * 1000);
        }
    }

    // Glow Effects
    initGlowEffects() {
        document.querySelectorAll('.glow-on-hover').forEach(element => {
            element.addEventListener('mouseenter', () => {
                anime({
                    targets: element,
                    boxShadow: [
                        '0 0 20px rgba(99, 102, 241, 0.3)',
                        '0 0 40px rgba(99, 102, 241, 0.6)',
                        '0 0 60px rgba(236, 72, 153, 0.4)'
                    ],
                    duration: 500,
                    easing: 'easeOutQuart'
                });
            });

            element.addEventListener('mouseleave', () => {
                anime({
                    targets: element,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.1)',
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
        });
    }

    // Text Animations
    initTextAnimations() {
        // Typewriter effect
        document.querySelectorAll('.typewriter').forEach(element => {
            this.typewriterEffect(element);
        });

        // Text reveal on scroll
        document.querySelectorAll('.text-reveal').forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #6366f1';

        anime({
            targets: element,
            textContent: [0, text.length],
            round: 1,
            duration: text.length * 50,
            easing: 'linear',
            update: (anim) => {
                const progress = Math.round(anim.progress * text.length / 100);
                element.textContent = text.substring(0, progress);
            },
            complete: () => {
                // Remove cursor
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        });
    }

    // Scroll-triggered animations
    triggerScrollAnimation(element, ratio) {
        if (element.classList.contains('service-card')) {
            this.animateServiceCard(element, ratio);
        } else if (element.classList.contains('pillar')) {
            this.animatePillar(element, ratio);
        } else if (element.classList.contains('feature-item')) {
            this.animateFeatureItem(element, ratio);
        } else if (element.classList.contains('process-step')) {
            this.animateProcessStep(element, ratio);
        } else if (element.classList.contains('text-reveal')) {
            this.animateTextReveal(element);
        }
    }

    animateServiceCard(card, ratio) {
        if (card.dataset.animated) return;
        card.dataset.animated = 'true';

        anime({
            targets: card,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            duration: 800,
            easing: 'easeOutBack',
            delay: anime.stagger(200)
        });
    }

    animatePillar(pillar, ratio) {
        if (pillar.dataset.animated) return;
        pillar.dataset.animated = 'true';

        anime({
            targets: pillar,
            opacity: [0, 1],
            translateY: [30, 0],
            rotateY: [15, 0],
            duration: 600,
            easing: 'easeOutQuart'
        });
    }

    animateFeatureItem(item, ratio) {
        if (item.dataset.animated) return;
        item.dataset.animated = 'true';

        anime({
            targets: item,
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 500,
            easing: 'easeOutQuart'
        });
    }

    animateProcessStep(step, ratio) {
        if (step.dataset.animated) return;
        step.dataset.animated = 'true';

        const content = step.querySelector('.step-content');
        const visual = step.querySelector('.step-visual');
        const icon = step.querySelector('.step-icon');

        // Animate step icon
        if (icon) {
            anime({
                targets: icon,
                scale: [0, 1],
                rotate: [180, 0],
                duration: 600,
                easing: 'easeOutBack'
            });
        }

        // Animate content
        if (content) {
            anime({
                targets: content,
                opacity: [0, 1],
                translateX: [-50, 0],
                duration: 600,
                easing: 'easeOutQuart',
                delay: 200
            });
        }

        // Animate visual
        if (visual) {
            anime({
                targets: visual,
                opacity: [0, 1],
                translateX: [50, 0],
                duration: 600,
                easing: 'easeOutQuart',
                delay: 400
            });
        }
    }

    animateTextReveal(element) {
        if (element.dataset.animated) return;
        element.dataset.animated = 'true';

        // Split text into characters
        const text = element.textContent;
        element.innerHTML = text.split('').map(char => 
            `<span style="opacity: 0; transform: translateY(20px);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        // Animate each character
        anime({
            targets: element.querySelectorAll('span'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 50,
            delay: anime.stagger(30),
            easing: 'easeOutQuart'
        });
    }

    // Stats counter animation
    animateStats() {
        document.querySelectorAll('.stat-item').forEach(stat => {
            const value = stat.querySelector('.stat-value');
            const finalNumber = parseInt(value.textContent);
            
            anime({
                targets: value,
                textContent: [0, finalNumber],
                round: 1,
                duration: 2000,
                easing: 'easeOutQuart'
            });
        });
    }

    // Modal animations
    animateModal(modal, show = true) {
        if (show) {
            anime({
                targets: modal,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 400,
                easing: 'easeOutBack'
            });
        } else {
            anime({
                targets: modal,
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 300,
                easing: 'easeInQuart'
            });
        }
    }

    // Button ripple effect
    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
        `;

        button.appendChild(ripple);

        anime({
            targets: ripple,
            scale: [0, 2],
            opacity: [0.3, 0],
            duration: 600,
            easing: 'easeOutQuart',
            complete: () => {
                button.removeChild(ripple);
            }
        });
    }

    // Cleanup
    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        this.isInitialized = false;
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dreamBridgeAnimations = new DreamBridgeAnimations();
});

// Add ripple effect to buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('button, .cta-button, .know-more-btn')) {
        if (window.dreamBridgeAnimations) {
            window.dreamBridgeAnimations.createRippleEffect(e.target, e);
        }
    }
});

// Export for global use
window.DreamBridgeAnimations = DreamBridgeAnimations;
