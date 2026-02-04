// Header Component Loader
document.addEventListener("DOMContentLoaded", function () {
  loadHeader();
});

function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) {
    console.error("Header container not found");
    return;
  }

  // Determine the base path based on current page location
  const currentPath = window.location.pathname;
  let basePath = "";

  // Check if we're in a subdirectory
  if (currentPath.includes("/pages/expertise/")) {
    basePath = "../../";
  } else if (currentPath.includes("/pages/")) {
    basePath = "../";
  }

  // Load header HTML
  fetch(`${basePath}components/header.html`)
    .then((response) => response.text())
    .then((html) => {
      headerContainer.innerHTML = html;

      // Configure navigation links and logo
      configureHeader(basePath);

      // Initialize header functionality
      initializeHeader();
    })
    .catch((error) => {
      console.error("Error loading header:", error);
    });
}

function configureHeader(basePath) {
  // Configure logo link
  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.href = basePath || "/";
  }

  // Configure logo image (if present)
  const logoImg = document.getElementById("logo-img");
  if (logoImg) {
    // Try different logo paths
    const logoPath = `${basePath}assets/images/ngkore.png`;
    const altLogoPath = `${basePath}assets/images/ngkore.png`;

    // Test if the main logo exists, fallback to alt logo
    logoImg.src = logoPath;
    logoImg.onerror = function () {
      this.src = altLogoPath;
    };
  }

  // Configure navigation links
  const links = {
    "home-link": basePath || "/",
    "about-link": `${basePath}pages/about`,
    "meetings-link": `${basePath}pages/meetings`,
    "products-link": `${basePath}pages/expertise`,
    "announcements-link": `${basePath}pages/announcements`,
    "docs-link": "https://docs.ngkorefoundation.org",
    "contact-link": `${basePath}pages/contact`,
  };

  // Set href attributes
  Object.keys(links).forEach((linkId) => {
    const link = document.getElementById(linkId);
    if (link) {
      link.href = links[linkId];
      // Make docs link open in new tab
      if (linkId === "docs-link") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  });

  // Set active link based on current page
  setActiveLink();
}

function setActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    link.classList.remove("active");

    // Check if current path matches link
    const linkPath = link.getAttribute("href");
    if (linkPath) {
      // Handle different path scenarios
      if (
        currentPath.endsWith("/") &&
        (linkPath === "/" || linkPath.includes("index"))
      ) {
        link.classList.add("active");
      } else if (currentPath.includes(linkPath.replace("../", ""))) {
        link.classList.add("active");
      } else if (
        currentPath === "/" &&
        (linkPath === "/" || linkPath.includes("index"))
      ) {
        link.classList.add("active");
      }
    }
  });
}

function initializeHeader() {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Header scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}
