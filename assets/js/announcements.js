// News page filtering and pagination functionality

document.addEventListener("DOMContentLoaded", function () {
  const filterTabs = document.querySelectorAll(".filter-tab");
  const newsGrid = document.querySelector(".news-grid");
  const paginationContainer = document.querySelector(".pagination-container");

  let currentPage = 1;
  let currentFilter = "all";
  let newsData = [];
  let filteredData = [];

  // Pagination configuration
  const ITEMS_PER_PAGE = {
    1: 5, // Page 1: 1 featured + 4 recent
    default: 6, // Page 2+: 6 news per page
  };

  function getItemsPerPage(page) {
    return ITEMS_PER_PAGE[page] || ITEMS_PER_PAGE.default;
  }

  // Google Sheets API URL - This will be replaced by GitHub Actions
  const GOOGLE_SHEETS_API_URL = "{{NEWS_API_URL}}";

  // Show loading state
  function showLoadingState() {
    newsGrid.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading latest news...</p>
            </div>
        `;
  }

  // Force refresh function (bypasses cache) - Make it global
  window.forceRefreshNews = function () {
    localStorage.removeItem("ngkore-news-cache");
    localStorage.removeItem("ngkore-news-cache-time");
    loadNewsData();
  };

  // Load news data from Google Sheets with caching
  async function loadNewsData() {
    showLoadingState();

    try {
      // Check for cached data (5 minutes cache)
      const cachedData = localStorage.getItem("ngkore-news-cache");
      const cacheTime = localStorage.getItem("ngkore-news-cache-time");
      const now = Date.now();

      if (cachedData && cacheTime && now - parseInt(cacheTime) < 60000) {
        // 1 minute
        console.log("Using cached news data");
        newsData = JSON.parse(cachedData);
        applyFilter("all");
        return;
      }

      console.log("=== FETCHING NEWS DATA ===");
      console.log("API URL:", GOOGLE_SHEETS_API_URL);

      const response = await fetch(GOOGLE_SHEETS_API_URL);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      console.log("Number of items received:", data.length);

      // Debug each item's date
      data.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          Date: item.Date,
          DateType: typeof item.Date,
          Title: item.Title,
          MainTag: item["Main Tag"],
        });
      });

      // Sort by date (newest first) with robust date parsing
      newsData = data.sort((a, b) => {
        const dateA = parseNewsDate(a.Date);
        const dateB = parseNewsDate(b.Date);
        return dateB - dateA;
      });

      // Cache the data
      localStorage.setItem("ngkore-news-cache", JSON.stringify(newsData));
      localStorage.setItem("ngkore-news-cache-time", now.toString());

      // Initialize with all data
      applyFilter("all");
    } catch (error) {
      console.error("Error loading news data:", error);
      showErrorState();
    }
  }

  // Show error state
  function showErrorState() {
    newsGrid.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Unable to load news</h3>
                <p>Please check your internet connection and try again.</p>
                <button onclick="loadNewsData()" class="retry-btn">Retry</button>
            </div>
        `;
  }

  // Enhanced date parsing function
  function parseNewsDate(dateString) {
    if (!dateString) return new Date(0);

    console.log("Parsing date:", dateString, "Type:", typeof dateString);

    try {
      // If it's already a valid ISO date (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return new Date(dateString + "T00:00:00");
      }

      // Handle DD/MM/YYYY format (like 25/06/2025) - PRIMARY FORMAT FROM GOOGLE SHEETS
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
        const parts = dateString.split("/");
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const year = parseInt(parts[2]);

        console.log(
          "DD/MM/YYYY format detected - Day:",
          day,
          "Month:",
          month + 1,
          "Year:",
          year
        );

        // Validate day and month ranges
        if (
          day >= 1 &&
          day <= 31 &&
          month >= 0 &&
          month <= 11 &&
          year >= 1900
        ) {
          const parsedDate = new Date(year, month, day);
          console.log("Successfully parsed date:", parsedDate);
          return parsedDate;
        } else {
          console.warn(
            "Invalid date ranges - Day:",
            day,
            "Month:",
            month + 1,
            "Year:",
            year
          );
          return new Date(); // Return current date as fallback
        }
      }

      // Handle text dates like "15 Jan 2025", "January 15, 2025"
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        console.log("Successfully parsed text date:", parsedDate);
        return parsedDate;
      }

      // If all else fails, return current date as fallback
      console.warn("Could not parse date, using current date:", dateString);
      return new Date();
    } catch (error) {
      console.error("Date parsing error for:", dateString, error);
      return new Date(); // Current date as fallback
    }
  }

  // Get image path based on main tag
  function getImagePath(mainTag) {
    const imageMap = {
      blogs: "../assets/images/news/blog.gif",
      videos: "../assets/images/news/video.gif",
      events: "../assets/images/news/event.gif",
      collaboration: "../assets/images/news/collaboration.gif",
    };

    return imageMap[mainTag.toLowerCase()] || "../assets/images/news/blog.gif";
  }

  // Create HTML for a news card
  function createNewsCard(newsItem, isFeatured = false) {
    const minorTagsArray = newsItem["Minor Tags"]
      .split(/[|,]/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const hasLink = newsItem.Link !== "#";

    // Format date using the same parsing function
    const date = parseNewsDate(newsItem.Date);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create summary with read more link
    let summaryHTML = newsItem.Summary;
    if (hasLink) {
      summaryHTML += ` <a href="${newsItem.Link}" target="_blank" class="read-more-link">Read more</a>`;
    } else {
      summaryHTML += ` <a href="#" class="read-more-link">Read more</a>`;
    }

    const cardClass = isFeatured ? "news-card featured" : "news-card";
    const headingTag = isFeatured ? "h2" : "h3";
    const categoryFilter = newsItem["Main Tag"].toLowerCase();
    const imagePath = getImagePath(newsItem["Main Tag"]);

    return `
            <article class="${cardClass}" data-category="${categoryFilter}">
                <div class="news-image">
                    <img src="${imagePath}" alt="${newsItem.Title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="news-placeholder" style="display: none;">${
                      newsItem["Main Tag"]
                    }</div>
                </div>
                <div class="news-content">
                    <div class="news-main-content">
                        <div class="news-meta">
                            <span class="news-category">${
                              newsItem["Main Tag"]
                            }</span>
                            <time class="news-date">${formattedDate}</time>
                        </div>
                        <${headingTag}>${newsItem.Title}</${headingTag}>
                        <p>${summaryHTML}</p>
                    </div>
                    <div class="news-tags">
                        ${minorTagsArray
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
            </article>
        `;
  }

  // Render news cards
  function renderNewsCards() {
    if (!newsGrid) return;

    // Clear existing cards
    newsGrid.innerHTML = "";

    // Calculate items to show based on current page
    let startIndex = 0;
    let endIndex = 0;

    if (currentPage === 1) {
      startIndex = 0;
      endIndex = getItemsPerPage(1);
    } else {
      startIndex = getItemsPerPage(1) + (currentPage - 2) * getItemsPerPage(2);
      endIndex = startIndex + getItemsPerPage(2);
    }

    // Render cards for current page
    for (let i = startIndex; i < endIndex && i < filteredData.length; i++) {
      const isFeatured = currentPage === 1 && i === 0; // First item on page 1 is featured
      const cardHTML = createNewsCard(filteredData[i], isFeatured);
      newsGrid.innerHTML += cardHTML;
    }
  }

  function applyFilter(filter) {
    currentFilter = filter;

    // Get filtered data
    if (filter === "all") {
      filteredData = [...newsData];
    } else {
      filteredData = newsData.filter(
        (item) => item["Main Tag"].toLowerCase() === filter
      );
    }

    // Reset to page 1 when filter changes
    currentPage = 1;
    renderNewsCards();
    updatePagination();
  }

  function updatePagination() {
    if (!paginationContainer) return;

    // Calculate total pages
    const totalItems = filteredData.length;
    let totalPages = 1;

    if (totalItems > getItemsPerPage(1)) {
      const remainingItems = totalItems - getItemsPerPage(1);
      totalPages = 1 + Math.ceil(remainingItems / getItemsPerPage(2));
    }

    // Clear existing pagination
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    // Create pagination controls
    const paginationList = document.createElement("ul");
    paginationList.className = "pagination";

    // Previous button
    const prevBtn = document.createElement("li");
    prevBtn.className = `pagination-item ${
      currentPage === 1 ? "disabled" : ""
    }`;
    prevBtn.innerHTML = `<button class="pagination-btn" ${
      currentPage === 1 ? "disabled" : ""
    }>Previous</button>`;
    prevBtn.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderNewsCards();
        updatePagination();
      }
    });
    paginationList.appendChild(prevBtn);

    // Calculate visible page range (show max 3 pages)
    let startPage, endPage;
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages <= 3
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate sliding window
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        // Show first 3 pages
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Show last 3 pages
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Show current page in middle
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // Add "..." and first page if needed
    if (startPage > 1) {
      const firstPageBtn = document.createElement("li");
      firstPageBtn.className = "pagination-item";
      firstPageBtn.innerHTML = `<button class="pagination-btn">1</button>`;
      firstPageBtn.addEventListener("click", function () {
        currentPage = 1;
        renderNewsCards();
        updatePagination();
      });
      paginationList.appendChild(firstPageBtn);

      if (startPage > 2) {
        const dotsBtn = document.createElement("li");
        dotsBtn.className = "pagination-item disabled";
        dotsBtn.innerHTML = `<button class="pagination-btn" disabled>...</button>`;
        paginationList.appendChild(dotsBtn);
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement("li");
      pageBtn.className = `pagination-item ${
        i === currentPage ? "active" : ""
      }`;
      pageBtn.innerHTML = `<button class="pagination-btn">${i}</button>`;
      pageBtn.addEventListener("click", function () {
        currentPage = i;
        renderNewsCards();
        updatePagination();
      });
      paginationList.appendChild(pageBtn);
    }

    // Add "..." and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dotsBtn = document.createElement("li");
        dotsBtn.className = "pagination-item disabled";
        dotsBtn.innerHTML = `<button class="pagination-btn" disabled>...</button>`;
        paginationList.appendChild(dotsBtn);
      }

      const lastPageBtn = document.createElement("li");
      lastPageBtn.className = "pagination-item";
      lastPageBtn.innerHTML = `<button class="pagination-btn">${totalPages}</button>`;
      lastPageBtn.addEventListener("click", function () {
        currentPage = totalPages;
        renderNewsCards();
        updatePagination();
      });
      paginationList.appendChild(lastPageBtn);
    }

    // Next button
    const nextBtn = document.createElement("li");
    nextBtn.className = `pagination-item ${
      currentPage === totalPages ? "disabled" : ""
    }`;
    nextBtn.innerHTML = `<button class="pagination-btn" ${
      currentPage === totalPages ? "disabled" : ""
    }>Next</button>`;
    nextBtn.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderNewsCards();
        updatePagination();
      }
    });
    paginationList.appendChild(nextBtn);

    paginationContainer.appendChild(paginationList);
  }

  // Filter tab event listeners
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active tab
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Apply filter and pagination
      applyFilter(filter);
    });
  });

  // Initialize by loading data
  loadNewsData();
});
