// DreamBridge Media - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHeroCarousel();
    initTaglineCarousel();
    initScrollAnimations();
    initServiceCards();
    initContactForm();
    initMobileMenu();
    initStats();
    initFloatingWords();
    initProcessTimeline();
    
    // Initialize cursor trail if on desktop
    if (window.innerWidth > 768) {
        initCursorTrail();
    }
    
    // Initialize WebGL bridge if available
    if (typeof initBridge === 'function') {
        initBridge();
    }
    
    // Initialize stars background
    initStarsBackground();
});

// Navigation Functions
function initNavigation() {
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Hero Carousel
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Tagline Carousel
function initTaglineCarousel() {
    const taglines = document.querySelectorAll('.tagline');
    let currentTagline = 0;
    
    if (taglines.length === 0) return;
    
    function nextTagline() {
        taglines[currentTagline].classList.remove('active');
        currentTagline = (currentTagline + 1) % taglines.length;
        taglines[currentTagline].classList.add('active');
    }
    
    // Change tagline every 4 seconds
    setInterval(nextTagline, 4000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .stagger-children').forEach(el => {
        observer.observe(el);
    });
    
    // Animate elements based on scroll position
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.parallax');
        
        parallax.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Service Cards
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    if (!modal) return;
    
    const serviceData = {
        'talent-management': {
            title: 'Talent & Creator Management',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <img src="https://pixabay.com/get/g61c3b0af8f925cf9b2d189e0f61883a4d6025bee7f4c4282998dd4824fa9086b76d04aff8ec3a40262d7be7d80bdd1991f08e77ca0d28dd73efb45f466f974af_1280.jpg" alt="Talent Management" class="w-full h-64 object-cover rounded-xl mb-6">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Our comprehensive talent management service is designed to transform creators into industry leaders through strategic planning, brand development, and growth acceleration.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Core Services</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-star text-dream-purple mt-1"></i>
                                    <span><strong>Influencer Talent Management:</strong> End-to-end representation and career guidance</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-paint-brush text-dream-pink mt-1"></i>
                                    <span><strong>Personal Brand Development:</strong> Strategic brand positioning and identity creation</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-chart-line text-dream-blue mt-1"></i>
                                    <span><strong>Growth Strategy:</strong> Data-driven strategies for platform growth</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-handshake text-dream-gold mt-1"></i>
                                    <span><strong>Brand Deals & Negotiation:</strong> Professional contract management</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What You Get</h3>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Dedicated account manager</li>
                                    <li>• Monthly strategy sessions</li>
                                    <li>• Performance analytics reports</li>
                                    <li>• PR and media opportunities</li>
                                    <li>• Long-term monetization planning</li>
                                    <li>• Platform optimization guidance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'influencer-marketing': {
            title: 'Influencer Marketing & Brand Partnerships',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <img src="https://pixabay.com/get/g77d201a8928d155d9cb36a9a300100b949ed0bb2aa8686832d0735392b285914ad06954ef23e13f33a24ed046f1b92fd3aeb20dd6d69a3db916f836f81f1aba9_1280.jpg" alt="Brand Partnerships" class="w-full h-64 object-cover rounded-xl mb-6">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Strategic brand-creator collaborations that drive authentic engagement and measurable results through carefully curated partnerships and data-driven campaigns.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Campaign Services</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-bullseye text-dream-pink mt-1"></i>
                                    <span><strong>Brand-Creator Strategy:</strong> Custom campaign development for maximum impact</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-search text-dream-purple mt-1"></i>
                                    <span><strong>Influencer Discovery:</strong> AI-powered talent matching</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-cogs text-dream-blue mt-1"></i>
                                    <span><strong>Campaign Execution:</strong> Complete management from concept to delivery</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-analytics text-dream-gold mt-1"></i>
                                    <span><strong>Performance Tracking:</strong> Comprehensive ROI reporting</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Campaign Types</h3>
                            <div class="space-y-4">
                                <div class="bg-gradient-to-r from-dream-purple/10 to-dream-pink/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Product Launch Campaigns</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Multi-creator campaigns for new product introductions</p>
                                </div>
                                <div class="bg-gradient-to-r from-dream-blue/10 to-dream-gold/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Brand Awareness</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Long-term brand building through authentic storytelling</p>
                                </div>
                                <div class="bg-gradient-to-r from-dream-pink/10 to-dream-blue/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">UGC Campaigns</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">User-generated content for social proof</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'content-production': {
            title: 'In-House Content Production',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <img src="https://pixabay.com/get/gf1b802b7ad4672dd2690a3b752de233c9359d236bdb26a7842f647905e7299c54f0c3d85b049ef3a048e15985b0d0a9b643514811e727953ce27bc2ce79975e8_1280.jpg" alt="Content Production" class="w-full h-64 object-cover rounded-xl mb-6">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Professional content creation services from concept to delivery, featuring state-of-the-art equipment, creative direction, and post-production excellence.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Production Services</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-film text-dream-blue mt-1"></i>
                                    <span><strong>Branded Content:</strong> High-quality content for all social platforms</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fab fa-youtube text-red-500 mt-1"></i>
                                    <span><strong>YouTube Production:</strong> Complete video production from script to edit</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-camera text-dream-purple mt-1"></i>
                                    <span><strong>Studio Shoots:</strong> Professional studio environment</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-edit text-dream-pink mt-1"></i>
                                    <span><strong>Post-Production:</strong> Expert editing and enhancement</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Equipment & Facilities</h3>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• 4K camera equipment</li>
                                    <li>• Professional lighting setups</li>
                                    <li>• Audio recording equipment</li>
                                    <li>• Green screen capabilities</li>
                                    <li>• Drone footage services</li>
                                    <li>• Advanced editing suites</li>
                                    <li>• Color grading and effects</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'brand-strategy': {
            title: 'Brand Strategy & Growth Services',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <img src="https://pixabay.com/get/ga224336504fbf72f15ab5d0276433313cebb3070154d609345f6252a06c7b0147510ec74ad7e93ccd2983f84216c997ba21d9b9046c386042ed9c186df46310f_1280.jpg" alt="Brand Strategy" class="w-full h-64 object-cover rounded-xl mb-6">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Comprehensive brand strategy development and growth acceleration through data-driven insights, trend analysis, and innovative digital marketing approaches.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Strategy Services</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-compass text-dream-gold mt-1"></i>
                                    <span><strong>360° Campaign Planning:</strong> Holistic strategies across all touchpoints</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-users text-dream-purple mt-1"></i>
                                    <span><strong>Audience Building:</strong> Strategic community development</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-trending-up text-dream-pink mt-1"></i>
                                    <span><strong>Trend Analysis:</strong> Real-time market insights</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-bullhorn text-dream-blue mt-1"></i>
                                    <span><strong>PR & Media:</strong> Strategic media relationship management</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Growth Framework</h3>
                            <div class="space-y-4">
                                <div class="bg-gradient-to-r from-dream-gold/10 to-dream-purple/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Phase 1: Analysis</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Market research and competitive analysis</p>
                                </div>
                                <div class="bg-gradient-to-r from-dream-purple/10 to-dream-pink/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Phase 2: Strategy</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Custom growth strategy development</p>
                                </div>
                                <div class="bg-gradient-to-r from-dream-pink/10 to-dream-blue/10 rounded-xl p-4">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Phase 3: Execution</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Implementation and optimization</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'creative-consulting': {
            title: 'Creative & Strategic Consulting',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Expert guidance on content strategy, creative direction, and market insights to help you navigate the ever-evolving digital landscape.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Consulting Areas</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-calendar text-purple-500 mt-1"></i>
                                    <span><strong>Content Calendar:</strong> Strategic planning and scheduling</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-palette text-dream-pink mt-1"></i>
                                    <span><strong>Creative Direction:</strong> Visual and brand guidance</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-chart-bar text-dream-blue mt-1"></i>
                                    <span><strong>Market Insights:</strong> Industry reports and analysis</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Deliverables</h3>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Monthly strategy reports</li>
                                    <li>• Content calendar templates</li>
                                    <li>• Creative brief frameworks</li>
                                    <li>• Performance dashboards</li>
                                    <li>• Trend analysis reports</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'pr-media': {
            title: 'PR & Media Management',
            content: `
                <div class="service-detail-content">
                    <div class="mb-8">
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Professional PR campaigns, media coverage, and public image management to enhance your brand reputation and visibility.
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">PR Services</h3>
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-newspaper text-pink-500 mt-1"></i>
                                    <span><strong>Media Relations:</strong> Press releases and media outreach</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-microphone text-dream-purple mt-1"></i>
                                    <span><strong>Interview Coordination:</strong> Media appearances and interviews</span>
                                </li>
                                <li class="flex items-start space-x-3">
                                    <i class="fas fa-shield-alt text-dream-blue mt-1"></i>
                                    <span><strong>Crisis Management:</strong> Reputation protection and recovery</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Media Coverage</h3>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Industry publications</li>
                                    <li>• Podcast appearances</li>
                                    <li>• Speaking opportunities</li>
                                    <li>• Award submissions</li>
                                    <li>• Media kit development</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    // Handle service card clicks
    serviceCards.forEach(card => {
        const knowMoreBtn = card.querySelector('.know-more-btn');
        if (knowMoreBtn) {
            knowMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const serviceKey = card.dataset.service;
                const service = serviceData[serviceKey];
                
                if (service) {
                    modalTitle.textContent = service.title;
                    modalBody.innerHTML = service.content;
                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    
                    // Animate modal in
                    setTimeout(() => {
                        modal.querySelector('.modal-content').classList.add('animate-zoom-in');
                    }, 50);
                }
            });
        }
    });
    
    // Close modal handlers
    if (closeModal) {
        closeModal.addEventListener('click', closeServiceModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeServiceModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeServiceModal();
        }
    });
    
    function closeServiceModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Contact Form
function initContactForm() {
    const creatorPath = document.getElementById('creator-path');
    const brandPath = document.getElementById('brand-path');
    const contactForm = document.getElementById('contact-form');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    
    let currentStep = 1;
    
    // Path toggle
    if (creatorPath && brandPath) {
        creatorPath.addEventListener('click', function() {
            creatorPath.classList.add('active', 'bg-dream-purple', 'text-white');
            creatorPath.classList.remove('text-gray-600', 'dark:text-gray-300');
            brandPath.classList.remove('active', 'bg-dream-purple', 'text-white');
            brandPath.classList.add('text-gray-600', 'dark:text-gray-300');
        });
        
        brandPath.addEventListener('click', function() {
            brandPath.classList.add('active', 'bg-dream-purple', 'text-white');
            brandPath.classList.remove('text-gray-600', 'dark:text-gray-300');
            creatorPath.classList.remove('active', 'bg-dream-purple', 'text-white');
            creatorPath.classList.add('text-gray-600', 'dark:text-gray-300');
        });
    }
    
    // Step navigation
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep < formSteps.length) {
                formSteps[currentStep - 1].classList.remove('active');
                currentStep++;
                formSteps[currentStep - 1].classList.add('active');
            }
        });
    });
    
    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                formSteps[currentStep - 1].classList.remove('active');
                currentStep--;
                formSteps[currentStep - 1].classList.add('active');
            }
        });
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            showNotification('Thank you! Your message has been sent. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            currentStep = 1;
            formSteps.forEach((step, index) => {
                step.classList.toggle('active', index === 0);
            });
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars';
            } else {
                icon.className = 'fas fa-times';
            }
        });
    }
}

// Stats Counter Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-item');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('div:first-child');
                const finalValue = statValue.textContent;
                
                // Extract number and suffix
                const match = finalValue.match(/(\d+)([^0-9]*)/);
                if (match) {
                    const number = parseInt(match[1]);
                    const suffix = match[2];
                    
                    // Animate the number
                    let current = 0;
                    const increment = number / 30;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            current = number;
                            clearInterval(timer);
                        }
                        statValue.textContent = Math.floor(current) + suffix;
                    }, 50);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// Floating Words Animation
function initFloatingWords() {
    const floatingWordsContainer = document.querySelector('.floating-words');
    if (!floatingWordsContainer) return;
    
    const words = ['Legacy', 'Real Influence', 'Creator Power', 'Dreams', 'Innovation', 'Bridge', 'Success'];
    
    function createFloatingWord() {
        const word = document.createElement('span');
        word.className = 'floating-word';
        word.textContent = words[Math.floor(Math.random() * words.length)];
        word.style.left = Math.random() * 100 + '%';
        word.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        word.style.animationDelay = Math.random() * 5 + 's';
        
        floatingWordsContainer.appendChild(word);
        
        // Remove word after animation
        setTimeout(() => {
            if (word.parentNode) {
                word.parentNode.removeChild(word);
            }
        }, 15000);
    }
    
    // Create floating words periodically
    setInterval(createFloatingWord, 3000);
    
    // Create initial words
    for (let i = 0; i < 3; i++) {
        setTimeout(createFloatingWord, i * 1000);
    }
}

// Process Timeline Animation
function initProcessTimeline() {
    const processSteps = document.querySelectorAll('.process-step');
    
    const observerOptions = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        observer.observe(step);
    });
}

// Cursor Trail
function initCursorTrail() {
    const trail = document.getElementById('cursor-trail');
    if (!trail) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // Hide trail when cursor leaves window
    document.addEventListener('mouseleave', function() {
        trail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        trail.style.opacity = '1';
    });
}

// Stars Background
function initStarsBackground() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    const numberOfStars = 100;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        
        starsContainer.appendChild(star);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[200] max-w-sm p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add resize handler for responsive updates
window.addEventListener('resize', debounce(() => {
    // Reinitialize cursor trail on desktop
    if (window.innerWidth > 768 && !document.getElementById('cursor-trail').style.display) {
        initCursorTrail();
    } else if (window.innerWidth <= 768) {
        const trail = document.getElementById('cursor-trail');
        if (trail) trail.style.display = 'none';
    }
}, 250));
