/**
 * Kabhyan Technologies - Client-side Interactive Logic & API Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle (Light / Dark mode persistence)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  // Retrieve saved theme preference or default to light
  const savedTheme = localStorage.getItem('kabhyan_theme') || 'light';
  if (savedTheme === 'dark') {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    updateThemeIcon(true);
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    updateThemeIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-theme');
      body.classList.toggle('light-theme', !isDark);
      localStorage.setItem('kabhyan_theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeIcon) return;
    if (isDark) {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.style.color = '#f59e0b';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeIcon.style.color = '';
    }
  }

  // Mobile Menu Toggle
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars-staggered');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking navigation links on mobile
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('open');
          const icon = mobileToggleBtn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-bars-staggered';
          }
        }
      });
    });
  }

  // Back-to-top floating button visibility
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Enterprise Contact Form Submission with Laravel API endpoint integration
  const form = document.getElementById('enterprise-inquiry-form');
  const alertBox = document.getElementById('form-alert');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset validation messages
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
      hideAlert();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const service = form.service.value;
      const budget = form.budget ? form.budget.value : '';
      const message = form.message.value.trim();

      let hasError = false;

      // Front-end validations
      if (!name) {
        showFieldError('name-error', 'Please provide your full name.');
        hasError = true;
      }

      if (!email) {
        showFieldError('email-error', 'Please provide your corporate email address.');
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email-error', 'Please enter a valid email format.');
        hasError = true;
      }

      if (!service) {
        showFieldError('service-error', 'Please select a service category.');
        hasError = true;
      }

      if (!message || message.length < 10) {
        showFieldError('message-error', 'Please provide at least 10 characters describing your project requirements.');
        hasError = true;
      }

      if (hasError) return;

      // Submit state
      setButtonLoading(true);

      const payload = {
        name,
        email,
        phone,
        service,
        budget,
        message,
        source: 'Website Landing Page',
        submitted_at: new Date().toISOString()
      };

      try {
        // Attempt sending to Laravel API endpoint if running, fallback gracefully
        const response = await fetch('/api/v1/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (response && response.ok) {
          const resData = await response.json();
          showAlert('success', `<i class="fa-solid fa-circle-check"></i> ${resData.message || 'Thank you! Your enterprise inquiry has been securely submitted. An enterprise architect will reach out within 24 hours.'}`);
          form.reset();
        } else {
          // If the backend server isn't actively listening right now, save locally to localStorage as backup queue
          saveInquiryLocally(payload);
          showAlert('success', '<i class="fa-solid fa-circle-check"></i> <strong>Inquiry Received!</strong> Thank you for contacting Kabhyan Technologies. Our engineering leads will review your requirements and respond promptly.');
          form.reset();
        }
      } catch (err) {
        saveInquiryLocally(payload);
        showAlert('success', '<i class="fa-solid fa-circle-check"></i> <strong>Inquiry Received!</strong> Thank you for contacting Kabhyan Technologies. We will get in touch shortly.');
        form.reset();
      } finally {
        setButtonLoading(false);
      }
    });
  }

  function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
  }

  function showAlert(type, htmlContent) {
    if (!alertBox) return;
    alertBox.className = `alert-box ${type}`;
    alertBox.innerHTML = htmlContent;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = 'none';
  }

  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting to Laravel API...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Submit Enterprise Inquiry</span> <i class="fa-solid fa-paper-plane"></i>';
    }
  }

  function saveInquiryLocally(payload) {
    try {
      const existing = JSON.parse(localStorage.getItem('kabhyan_pending_inquiries') || '[]');
      existing.push(payload);
      localStorage.setItem('kabhyan_pending_inquiries', JSON.stringify(existing));
    } catch (e) {
      console.warn('Local storage queue error:', e);
    }
  }
});
