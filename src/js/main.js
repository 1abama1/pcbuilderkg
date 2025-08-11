// Main JavaScript for PC Builder Pro

class PCBuilder {
    constructor() {
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupHeaderScroll();
        this.setupOnLoadAnimations();
        this.setupScrollReveal();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Contact modal trigger for hero button
        const heroContactBtn = document.querySelector('#openContactModal');
        if (heroContactBtn) {
            heroContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.telegramBot) {
                    window.telegramBot.openModal();
                }
            });
        }
    }

    setupHeaderScroll() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateHeaderVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateHeaderVisibility() {
        const header = document.querySelector('.header');
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!header) return;

        // Показываем header если пользователь прокручивает вверх или находится в начале страницы
        if (currentScrollTop <= this.scrollThreshold) {
            header.classList.remove('header-hidden');
        } else if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.scrollThreshold) {
            // Скрываем header если пользователь прокручивает вниз
            header.classList.add('header-hidden');
        } else if (currentScrollTop < this.lastScrollTop) {
            // Показываем header если пользователь прокручивает вверх
            header.classList.remove('header-hidden');
        }

        this.lastScrollTop = currentScrollTop;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

    setupMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        if (navToggle && navMenu) {
            // Close menu when clicking on a link (including contact button)
            const closeMenuOnLinkClick = () => {
                navMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                });
            };

            // Initial setup
            closeMenuOnLinkClick();

            // Re-setup after contact button is added (with a small delay)
            setTimeout(closeMenuOnLinkClick, 100);

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }
    }

    setupOnLoadAnimations() {
        const runAnimations = () => {
            const title = document.querySelector('.hero-title');
            const description = document.querySelector('.hero-description');
            const buttons = document.querySelector('.hero-buttons');
            const mockup = document.querySelector('.pc-mockup');

            if (title) {
                title.classList.add('animate-fade-up');
            }
            if (description) {
                setTimeout(() => description.classList.add('animate-fade-up', 'delay-100'), 50);
            }
            if (buttons) {
                setTimeout(() => buttons.classList.add('animate-fade-up', 'delay-200'), 100);
            }
            if (mockup) {
                setTimeout(() => mockup.classList.add('animate-fade-right', 'delay-150'), 80);
            }

            // Remove preload class after initial animations begin
            setTimeout(() => {
                document.body.classList.remove('preload');
            }, 700);
        };

        // Kick off on next frame to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runAnimations);
        } else {
            runAnimations();
        }
    }

    setupScrollReveal() {
        const elements = document.querySelectorAll('.portfolio-item, .section-title, .feature');
        if (!elements.length) return;

        const reveal = (el) => {
            el.classList.add('revealed');
        };

        // Fallback for browsers without IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            elements.forEach((el, idx) => {
                setTimeout(() => reveal(el), idx * 100);
            });
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    reveal(el);
                    obs.unobserve(el);
                }
            });
        }, { 
            threshold: 0.2, 
            rootMargin: '0px 0px -50px 0px' 
        });

        elements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize the PC Builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pcBuilder = new PCBuilder();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        border-left: 4px solid #6366f1;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: #10b981;
    }

    .notification-warning {
        border-left-color: #f59e0b;
    }

    .notification i {
        color: #6366f1;
    }

    .notification-success i {
        color: #10b981;
    }

    .notification-warning i {
        color: #f59e0b;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
