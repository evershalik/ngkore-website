// Enhanced About Page JavaScript with Capgemini-inspired Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations on page load
    initializeAnimations();
    initializeScrollAnimations();
    initializeCounterAnimations();
    initializeTimelineAnimations();
    initializeParallaxEffects();
});

// Initialize hero animations
function initializeAnimations() {
    // Add animate-in class to hero elements with delays
    setTimeout(() => {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('animate-in');
            }, index * 300);
        });
    }, 500);

    setTimeout(() => {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) subtitle.classList.add('animate-in');
    }, 1200);

    setTimeout(() => {
        const stats = document.querySelector('.hero-stats');
        if (stats) stats.classList.add('animate-in');
    }, 1500);
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('animate-on-scroll')) {
                    entry.target.classList.add('in-view');
                }
                
                // Trigger staggered animations for team members
                if (entry.target.classList.contains('team-grid')) {
                    animateTeamMembers(entry.target);
                }
                
                // Trigger timeline animations
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                
                // Trigger mission highlights
                if (entry.target.classList.contains('mission-highlights')) {
                    animateMissionHighlights(entry.target);
                }
                
                // Trigger social cards
                if (entry.target.classList.contains('social-grid')) {
                    animateSocialCards(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animateElements = document.querySelectorAll([
        '.animate-on-scroll',
        '.team-grid',
        '.timeline-item',
        '.mission-highlights',
        '.social-grid'
    ].join(', '));

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animations for statistics
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Team member staggered animations
function animateTeamMembers(container) {
    const members = container.querySelectorAll('.team-member');
    members.forEach((member, index) => {
        setTimeout(() => {
            member.classList.add('animate-on-scroll');
        }, index * 100);
    });
}

// Timeline item animations
function animateTimelineItem(item) {
    item.classList.add('animate-on-scroll');
    
    // Animate organization cards within the timeline item
    const cards = item.querySelectorAll('.organization-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Initialize timeline animations
function initializeTimelineAnimations() {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateTimelineItem(entry.target);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Mission highlights staggered animation
function animateMissionHighlights(container) {
    const highlights = container.querySelectorAll('.highlight-item');
    highlights.forEach((highlight, index) => {
        highlight.style.opacity = '0';
        highlight.style.transform = 'translateX(-30px)';
        highlight.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            highlight.style.opacity = '1';
            highlight.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

// Social cards staggered animation
function animateSocialCards(container) {
    const cards = container.querySelectorAll('.social-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}

// Parallax effects for floating elements
function initializeParallaxEffects() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    }, 16));
}

// Enhanced hover effects for team members
document.addEventListener('DOMContentLoaded', function() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const card = member.querySelector('.member-card');
        const image = member.querySelector('.member-image img');
        const overlay = member.querySelector('.member-overlay');
        const social = member.querySelector('.member-social');
        
        member.addEventListener('mouseenter', () => {
            // Add hover effects
            card.style.transform = 'translateY(-12px) scale(1.02)';
            
            if (image && !image.classList.contains('grayscale')) {
                image.style.transform = 'scale(1.1)';
            }
            
            if (social) {
                social.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        member.addEventListener('mouseleave', () => {
            // Reset hover effects
            card.style.transform = '';
            
            if (image) {
                image.style.transform = '';
            }
            
            if (social) {
                social.style.transform = '';
            }
        });
    });
});

// Enhanced hover effects for organization cards
document.addEventListener('DOMContentLoaded', function() {
    const orgCards = document.querySelectorAll('.organization-card');
    
    orgCards.forEach(card => {
        const logo = card.querySelector('.org-logo');
        const tags = card.querySelectorAll('.tag');
        
        card.addEventListener('mouseenter', () => {
            if (logo) {
                logo.style.transform = 'scale(1.1) rotate(5deg)';
                logo.style.transition = 'transform 0.3s ease';
            }
            
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                    tag.style.transition = 'transform 0.2s ease';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            if (logo) {
                logo.style.transform = '';
            }
            
            tags.forEach(tag => {
                tag.style.transform = '';
            });
        });
    });
});

// Highlight items interactive effects
document.addEventListener('DOMContentLoaded', function() {
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    highlightItems.forEach(item => {
        const icon = item.querySelector('.highlight-icon');
        
        item.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
});

// Social cards enhanced interactions
document.addEventListener('DOMContentLoaded', function() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        const icon = card.querySelector('.social-icon');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = '';
            }
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Tech sphere interaction
document.addEventListener('DOMContentLoaded', function() {
    const techSphere = document.querySelector('.tech-sphere');
    const sphereElements = document.querySelectorAll('.sphere-element');
    
    if (techSphere) {
        techSphere.addEventListener('mouseenter', () => {
            sphereElements.forEach((element, index) => {
                element.style.animationPlayState = 'paused';
                setTimeout(() => {
                    element.style.transform = `scale(1.1)`;
                    element.style.transition = 'transform 0.3s ease';
                }, index * 100);
            });
        });
        
        techSphere.addEventListener('mouseleave', () => {
            sphereElements.forEach(element => {
                element.style.animationPlayState = 'running';
                element.style.transform = '';
            });
        });
    }
});

// Smooth reveal animations for page sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('in-view');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

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

// Add CSS animations dynamically
const dynamicStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
        }
        50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .timeline-item:nth-child(odd) .organization-card {
        animation: slideInFromLeft 0.6s ease-out forwards;
    }
    
    .timeline-item:nth-child(even) .organization-card {
        animation: slideInFromRight 0.6s ease-out forwards;
    }
    
    .social-card.animate {
        animation: bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
`;

// Add dynamic styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Performance monitoring
let animationFrameId;

function optimizeAnimations() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (reducedMotion.matches) {
        // Disable complex animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Remove floating elements animation
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            el.style.animation = 'none';
        });
        
        // Simplify sphere animation
        const sphereElements = document.querySelectorAll('.sphere-element');
        sphereElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeAnimations);

// Console branding
console.log('%cNgKore About Page', 'color: #6B9BD1; font-size: 24px; font-weight: bold;');
console.log('%cDiscover our journey and meet our team', 'color: #6B9BD1; font-size: 16px;');

// Animation for scroll effects
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Handle reduced motion preferences
const handleReducedMotion = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (reducedMotion.matches) {
        // Disable complex animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Add all animation classes immediately
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.classList.add('animate-visible');
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    handleReducedMotion();
    initializePartnersCarousel();
});

// Initialize Partners Carousel
function initializePartnersCarousel() {
    console.log('Initializing Partners Carousel...');
    const partnersTrack = document.getElementById('partners-track');
    
    if (!partnersTrack) {
        console.error('Partners track element not found!');
        return;
    }
    
    console.log('Partners track element found:', partnersTrack);
    
    // Remove loading placeholder
    const loadingPlaceholder = partnersTrack.querySelector('.loading-placeholder');
    if (loadingPlaceholder) {
        loadingPlaceholder.remove();
    }
    
    // All partner logos from the collaboration directory
    const partnerLogos = [
        'aether.png',
        'bmw-labs.png',
        'cnti.png',
        'free5gc.png',
        'hyperledger.png',
        'l3af.png',
        'lf.png',
        'lfc.png',
        'lfdt.png',
        'lfn.png',
        'magma.png',
        'nephio.png',
        'nextarch.png',
        'ntust.png',
        'onf.png',
        'open5gs.png',
        'openairinterface.png',
        'openinfra.png',
        'openssl-corporation.png',
        'openssl-foundation.png',
        'openstack.png',
        'oqs.png',
        'oran-alliance.png',
        'osc.png',
        'pki.png',
        'pqca.png',
        'sdcore.png',
        'sdran.png',
        'srsran.png',
        'tars.png',
        'university of delhi.png'
    ];
    
    // Create logo elements with card containers and add them to the track
    partnerLogos.forEach((logo, index) => {
        // Create card container
        const card = document.createElement('div');
        card.className = 'partner-card';
        
        // Create image element
        const img = document.createElement('img');
        img.src = `../assets/images/collaboration/${logo}`;
        img.alt = logo.replace('.png', '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').toUpperCase();
        img.className = 'partner-logo';
        img.loading = 'eager'; // Load immediately for visible cards
        
        // Add error handling for missing images
        img.onerror = function() {
            card.style.display = 'none';
        };
        
        // Add image to card, then card to track
        card.appendChild(img);
        partnersTrack.appendChild(card);
    });
    
    // Create one duplicate set for seamless infinite scroll
    partnerLogos.forEach(logo => {
        // Create card container
        const card = document.createElement('div');
        card.className = 'partner-card';
        
        // Create image element
        const img = document.createElement('img');
        img.src = `../assets/images/collaboration/${logo}`;
        img.alt = logo.replace('.png', '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').toUpperCase();
        img.className = 'partner-logo';
        img.loading = 'eager'; // Load immediately for duplicate set
        
        // Add error handling for missing images
        img.onerror = function() {
            card.style.display = 'none';
        };
        
        // Add image to card, then card to track
        card.appendChild(img);
        partnersTrack.appendChild(card);
    });
    
    console.log(`Partners carousel initialized with ${partnerLogos.length} collaboration logos (2 sets for seamless infinite loop)`);
}