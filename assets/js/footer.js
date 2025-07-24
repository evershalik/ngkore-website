/**
 * NgKore Universal Footer Loader
 * Automatically loads the footer component for any page
 */

(function() {
  // Function to load footer component
  function loadFooter() {
    // Determine the current page location relative to the root
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Check if we're in a subdirectory (pages/expertise/, pages/, or docs/)
    if (currentPath.includes('/pages/expertise/')) {
      basePath = '../../';
    } else if (currentPath.includes('/pages/')) {
      basePath = '../';
    } else if (currentPath.includes('/docs/')) {
      basePath = '../';
    } else {
      basePath = './';
    }
    
    // Create footer container if it doesn't exist
    let footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
      footerContainer = document.createElement('div');
      footerContainer.id = 'footer-container';
      document.body.appendChild(footerContainer);
    }
    
    // Load footer component
    fetch(basePath + 'components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Footer component not found');
        }
        return response.text();
      })
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        // Fallback: create a simple footer
        footerContainer.innerHTML = `
          <footer class="footer" style="background: #2d4a73; color: white; padding: 2rem 0; text-align: center;">
            <div class="container">
              <p>&copy; 2025 NgKore Community. All rights reserved.</p>
            </div>
          </footer>
        `;
      });
  }
  
  // Load footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();