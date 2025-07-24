// Enhanced JavaScript for NgKore Website
// Header functionality moved to header.js

// Wait for DOM and header component to load
document.addEventListener("DOMContentLoaded", function () {
  // Add any page-specific initialization here
  setTimeout(initializePageFeatures, 100); // Small delay to ensure header is loaded
});

function initializePageFeatures() {
  // Smooth Scrolling for Hash Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const header = document.querySelector(".header");
        const headerHeight = header ? header.offsetHeight : 0;
        const offsetTop = target.offsetTop - (headerHeight + 20);
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      // Optional: Stop observing once animated
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation on page load
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".tech-item, .highlight-card, .research-card, .team-member, .value-card, .focus-card, .fade-in-up"
  );

  animateElements.forEach((el) => {
    el.classList.add("fade-in-up");
    observer.observe(el);
  });
});

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
  const start = parseInt(element.textContent) || 0;
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

// Initialize counter animations when visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll(".stat-number");
        counters.forEach((counter, index) => {
          const text = counter.textContent;
          const number = parseInt(text.replace(/\D/g, ""));
          if (number > 0) {
            counter.textContent = "0";
            setTimeout(() => {
              animateCounter(counter, number);
              // Restore the '+' or other suffix
              setTimeout(() => {
                if (text.includes("+")) {
                  counter.textContent = number + "+";
                }
              }, 2000);
            }, index * 200);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Observe stats sections
document.addEventListener("DOMContentLoaded", () => {
  const statsElements = document.querySelectorAll(
    ".overview-stats, .hero-stats, .community-stats"
  );
  statsElements.forEach((el) => {
    statsObserver.observe(el);
  });

  // Handle data-count attributes for community stats
  const communityCounters = document.querySelectorAll(
    ".stat-number[data-count]"
  );
  const communityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetValue = parseInt(counter.getAttribute("data-count"));
          animateCounter(counter, targetValue);
          communityObserver.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  communityCounters.forEach((counter) => {
    communityObserver.observe(counter);
  });
});

// Enhanced Button Interactions
document.querySelectorAll(".btn").forEach((button) => {
  // Hover effect
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });

  // Ripple effect on click
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.classList.add("ripple");
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
        `;

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Tech Showcase Interaction
document.querySelectorAll(".tech-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Form Handling (if contact form exists)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      showNotification(
        "Thank you for your message! We will get back to you soon.",
        "success"
      );
      this.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        transform: translateX(100%);
        display: flex;
        align-items: center;
        gap: 12px;
    `;

  // Set background color based on type
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  notification.style.background = colors[type] || colors.info;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Parallax Effect for Hero Section
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(
    ".geometric-pattern, .hero-background"
  );

  parallaxElements.forEach((element) => {
    const speed = element.dataset.speed || 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });

  ticking = false;
}

function requestParallaxTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener("scroll", requestParallaxTick);

// Typing animation with real-time styling for capital words
function typeWriter(element, text, speed = 50) {
  if (!element) return;

  let i = 0;
  element.innerHTML = "";

  function applyRealTimeStyle(currentText) {
    // Apply styling in real-time as text is being typed
    let styledText = currentText
      .replace(
        /OPEN SOURCE/g,
        '<span class="highlight-text">OPEN SOURCE</span>'
      )
      .replace(/FUTURE/g, '<span class="highlight-text">FUTURE</span>');

    // Handle partial matches for capital words being typed
    if (currentText.includes("OPEN") && !currentText.includes("OPEN SOURCE")) {
      // If we're in the middle of typing "OPEN SOURCE"
      const openIndex = currentText.lastIndexOf("OPEN");
      const beforeOpen = currentText.substring(0, openIndex);
      const openPart = currentText.substring(openIndex);
      styledText =
        beforeOpen + '<span class="highlight-text">' + openPart + "</span>";
    }

    if (currentText.includes("FUTU") && !currentText.includes("FUTURE")) {
      // If we're in the middle of typing "FUTURE"
      const futureIndex = currentText.lastIndexOf("FUTU");
      if (futureIndex !== -1) {
        const beforeFuture = currentText.substring(0, futureIndex);
        const futurePart = currentText.substring(futureIndex);
        // Only apply if we haven't already styled OPEN SOURCE in this part
        if (
          !beforeFuture.includes(
            '<span class="highlight-text">OPEN SOURCE</span>'
          )
        ) {
          styledText =
            beforeFuture.replace(
              /OPEN SOURCE/g,
              '<span class="highlight-text">OPEN SOURCE</span>'
            ) +
            '<span class="highlight-text">' +
            futurePart +
            "</span>";
        } else {
          styledText =
            beforeFuture +
            '<span class="highlight-text">' +
            futurePart +
            "</span>";
        }
      }
    }

    // Structure it properly with NgKore: and gradient-text wrapper
    if (styledText.includes("NgKore:")) {
      const parts = styledText.split("NgKore:");
      if (parts.length === 2 && parts[1].trim()) {
        return `NgKore: <span class="gradient-text">${parts[1].trim()}</span>`;
      }
    }

    return styledText;
  }

  function type() {
    if (i < text.length) {
      const currentText = text.substring(0, i + 1);
      element.innerHTML = applyRealTimeStyle(currentText);
      i++;
      // Use a consistent speed for all characters, no special delays
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing animation on page load
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    // Get the plain text version for typing
    const originalText = heroTitle.textContent || heroTitle.innerText;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50);
    }, 100);
  }
});

// Theme Toggle (if implemented)
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
}

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});

// Search Functionality (if search input exists)
const searchInput = document.querySelector(".search-input");
if (searchInput) {
  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.toLowerCase();
      // Implement search logic here
      console.log("Searching for:", query);
    }, 300);
  });
}

// Add CSS for ripple effect and animations
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in-up.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
    }
    
    .notification-message {
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    body.nav-open {
        overflow: hidden;
    }
    
    /* Stagger animations */
    .tech-item:nth-child(1) { animation-delay: 0.1s; }
    .tech-item:nth-child(2) { animation-delay: 0.2s; }
    .tech-item:nth-child(3) { animation-delay: 0.3s; }
    
    .highlight-card:nth-child(1) { animation-delay: 0.1s; }
    .highlight-card:nth-child(2) { animation-delay: 0.2s; }
    .highlight-card:nth-child(3) { animation-delay: 0.3s; }
    .highlight-card:nth-child(4) { animation-delay: 0.4s; }
    
    .research-card:nth-child(1) { animation-delay: 0.1s; }
    .research-card:nth-child(2) { animation-delay: 0.2s; }
    .research-card:nth-child(3) { animation-delay: 0.3s; }
`;

document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    // Scroll-based animations and effects
    updateParallax();
  }, 16)
);

// Lazy loading for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
});

// Print styles and accessibility
if (window.matchMedia) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty("--animation-duration", "0s");
  }
}

// Service Worker Registration removed - not needed for this project

// Console message for developers
console.log(
  "%cNgKore Website",
  "color: #6B9BD1; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cDriving OPEN SOURCE Innovation for the FUTURE",
  "color: #6B9BD1; font-size: 16px;"
);
console.log(
  "%cInterested in contributing? Visit our GitHub or contact us!",
  "color: #666; font-size: 14px;"
);
