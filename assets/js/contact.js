document.addEventListener("DOMContentLoaded", function () {
  // CONFIGURATIONS
  const GOOGLE_SCRIPT_URL = "{{CONTACT_FORM_URL}}"; // This will be replaced by GitHub Actions
  
  // Check if we're in development mode (URL not replaced)
  const isDevelopment = GOOGLE_SCRIPT_URL.includes("{{CONTACT_FORM_URL}}");
  
  if (isDevelopment) {
    console.warn("Development mode: Contact form will simulate submission");
  }

  const contactForm = document.getElementById("contact-form");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitButtonText = submitButton.querySelector("span");
  const submitButtonIcon = submitButton.querySelector("svg");

  // Track submission state to prevent duplicates
  let isSubmitting = false;

  // Handle Form Submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
      console.log("Form already being submitted, ignoring duplicate request");
      return;
    }

    // Clear any previous messages
    hideMessage();

    // Get form data manually to ensure all fields are captured
    const formObject = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      organization: document.getElementById("organization").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    // Debug: Log form data for troubleshooting
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form data being sent:", formObject);
    console.log(
      "First Name:",
      `"${formObject.firstName}" (length: ${formObject.firstName.length})`
    );
    console.log(
      "Last Name:",
      `"${formObject.lastName}" (length: ${formObject.lastName.length})`
    );
    console.log(
      "Email:",
      `"${formObject.email}" (length: ${formObject.email.length})`
    );
    console.log(
      "Subject:",
      `"${formObject.subject}" (length: ${formObject.subject.length})`
    );
    console.log(
      "Message:",
      `"${formObject.message}" (length: ${formObject.message.length})`
    );

    // Validate form
    const validationResult = validateForm(formObject);
    console.log("Validation result:", validationResult);

    if (!validationResult) {
      console.log("Validation failed - stopping submission");
      return;
    }

    console.log("Validation passed - proceeding with submission");

    // Mark as submitting to prevent duplicates
    isSubmitting = true;

    // Show loading state
    showLoadingState();

    // Handle development vs production
    if (isDevelopment) {
      // Simulate form submission in development
      console.log("=== DEVELOPMENT MODE - SIMULATING FORM SUBMISSION ===");
      console.log("Form data that would be sent:", formObject);
      
      setTimeout(() => {
        hideLoadingState();
        showSuccessMessage("✅ Development mode: Form submission simulated successfully!");
        contactForm.reset();
        isSubmitting = false;
      }, 2000);
    } else {
      // Send to Google Sheets in production
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(formObject),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      })
        .then((response) => {
          // With no-cors mode, we can't read the response
          // So we'll assume success if no error is thrown
          console.log("Data sent to Google Sheets (no-cors mode)");
          hideLoadingState();
          showSuccessMessage();
          contactForm.reset();

          // Reset submission flag after success
          isSubmitting = false;
        })
        .catch((error) => {
          console.error("Form submission failed:", error);
          hideLoadingState();
          showErrorMessage("Failed to submit form. Please try again.");

          // Reset submission flag after error
          isSubmitting = false;
        });
    }
  });

  // Validation
  function validateForm(data) {
    console.log("=== VALIDATION DEBUG ===");
    const errors = [];

    // Check each field individually with detailed logging
    console.log("Checking firstName:", data.firstName, typeof data.firstName);
    if (!data.firstName || data.firstName.length === 0) {
      console.log("firstName validation FAILED");
      errors.push("First name is required");
    } else {
      console.log("firstName validation PASSED");
    }

    console.log("Checking lastName:", data.lastName, typeof data.lastName);
    if (!data.lastName || data.lastName.length === 0) {
      console.log("lastName validation FAILED");
      errors.push("Last name is required");
    } else {
      console.log("lastName validation PASSED");
    }

    console.log("Checking email:", data.email, typeof data.email);
    if (!data.email || data.email.length === 0) {
      console.log("email validation FAILED - empty");
      errors.push("Email is required");
    } else if (!isValidEmail(data.email)) {
      console.log("email validation FAILED - invalid format");
      errors.push("Please enter a valid email address");
    } else {
      console.log("email validation PASSED");
    }

    console.log("Checking subject:", data.subject, typeof data.subject);
    if (!data.subject || data.subject.length === 0) {
      console.log("subject validation FAILED - empty");
      errors.push("Subject is required");
    } else if (data.subject.length < 3) {
      console.log("subject validation FAILED - too short");
      errors.push("Subject must be at least 3 characters long");
    } else {
      console.log("subject validation PASSED");
    }

    console.log("Checking message:", data.message, typeof data.message);
    if (!data.message || data.message.length === 0) {
      console.log("message validation FAILED - empty");
      errors.push("Message is required");
    } else if (data.message.length < 10) {
      console.log("message validation FAILED - too short");
      errors.push("Message must be at least 10 characters long");
    } else {
      console.log("message validation PASSED");
    }

    console.log("Total validation errors:", errors.length);
    console.log("Errors array:", errors);

    if (errors.length > 0) {
      showErrorMessage(
        "Please fix the following issues:<br>• " + errors.join("<br>• ")
      );
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // UI helpers
  function showLoadingState() {
    submitButton.disabled = true;
    submitButtonText.textContent = "Sending...";
    submitButtonIcon.style.display = "none";
    hideMessage(); // Hide any previous messages
  }

  function hideLoadingState() {
    submitButton.disabled = false;
    submitButtonText.textContent = "Send Message";
    submitButtonIcon.style.display = "inline-block";
  }

  function showSuccessMessage(customMessage) {
    console.log("Showing success message inline");
    const message = customMessage || "✅ Message sent successfully! We will get back to you soon.";
    showMessage(message, "success");

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      hideMessage();
    }, 5000);
  }

  function showErrorMessage(msg) {
    showMessage("❌ " + msg, "error");
  }

  function showMessage(message, type) {
    const messageElement = document.getElementById("form-message");

    if (!messageElement) {
      console.error("Message container not found!");
      return;
    }

    console.log(`Displaying ${type} message:`, message);

    // Use innerHTML to support line breaks and bullets
    messageElement.innerHTML = message.replace(/\n/g, "<br>");
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = "block";

    // Scroll to message smoothly
    messageElement.scrollIntoView({ behavior: "smooth", block: "nearest" });

    console.log("Message displayed successfully");
  }

  function hideMessage() {
    const messageElement = document.getElementById("form-message");
    messageElement.style.display = "none";
    messageElement.className = "form-message";
  }
});
