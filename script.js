/**
 * ============================================================================
 * SUDHEER KUMAR - PORTFOLIO JAVASCRIPT
 * Description: Clean, modular, and beginner-friendly JavaScript for portfolio
 * interactions, navigation, filtering, form validation, and scroll animations.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. NAVIGATION & STICKY HEADER
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background blur on scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on initial load

  // Mobile Menu Toggle
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Prevent body scrolling when mobile menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });


  /* --------------------------------------------------------------------------
     2. ACTIVE NAVIGATION LINK SPY (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  // Observer with offset to trigger when section enters viewport
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(updateActiveNavLink, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));


  /* --------------------------------------------------------------------------
     3. PROJECT FILTER TABS
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state on buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-filter');

      // Filter project cards with a subtle fade animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  /* --------------------------------------------------------------------------
     4. RESUME MANAGEMENT: UPLOAD, PREVIEW, OPEN IN NEW TAB & INDEXEDDB
     -------------------------------------------------------------------------- */
  const DEFAULT_RESUME = {
    url: 'resume/Sudheer-Kumar-Resume.pdf',
    imgUrl: './images/resume-preview.png',
    name: 'Sudheer-Kumar-Resume.pdf',
    type: 'application/pdf',
  };

  let activeResume = { ...DEFAULT_RESUME };
  let activeBlobUrl = null;

  // DOM Elements
  const resumeUploadInput = document.getElementById('resume-upload-input');
  const uploadResumeBtn = document.getElementById('upload-resume-btn');
  const resetResumeBtn = document.getElementById('reset-resume-btn');
  const viewResumeBtn = document.getElementById('view-resume-btn');
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  const resumeFileName = document.getElementById('resume-file-name');
  const resumeFileIcon = document.getElementById('resume-file-icon');
  const resumeUploadBadge = document.getElementById('resume-upload-badge');
  const resumeDropzone = document.getElementById('resume-dropzone');
  const resumeDocWrapper = document.getElementById('resume-document-wrapper');
  const resumeImg = document.getElementById('resume-preview-img');
  const resumePdfFrame = document.getElementById('resume-pdf-frame');
  const downloadLinks = document.querySelectorAll('.resume-download-link');
  const toastContainer = document.getElementById('toast-container');

  // Modal elements (if used)
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeModalBackdrop = document.getElementById('resume-modal-backdrop');
  const modalResumeImg = document.getElementById('modal-resume-img');
  const modalResumeFrame = document.getElementById('modal-resume-frame');
  const modalViewTabBtn = document.getElementById('modal-view-tab-btn');
  const modalDownloadBtn = document.getElementById('modal-download-btn');

  // Helper: Toast Notifications
  const showToast = (message, type = 'success', duration = 3500) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  };

  // Helper: Format bytes
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // ----------------- IndexedDB Storage for Persistence -----------------
  const DB_NAME = 'PortfolioResumeDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'resumes';

  const openResumeDB = () => {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  };

  const saveResumeToDB = async (fileData) => {
    try {
      const db = await openResumeDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const record = {
          id: 'custom_resume',
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          blob: fileData.blob,
          timestamp: Date.now()
        };
        const request = store.put(record);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.warn('Could not save to IndexedDB:', err);
    }
  };

  const loadResumeFromDB = async () => {
    try {
      const db = await openResumeDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get('custom_resume');
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.warn('Could not load from IndexedDB:', err);
      return null;
    }
  };

  const deleteResumeFromDB = async () => {
    try {
      const db = await openResumeDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete('custom_resume');
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.warn('Could not delete from IndexedDB:', err);
    }
  };

  // ----------------- Apply Resume to UI & Links -----------------
  const applyResume = (customData = null) => {
    // Revoke existing Blob URL to avoid memory leaks
    if (activeBlobUrl) {
      URL.revokeObjectURL(activeBlobUrl);
      activeBlobUrl = null;
    }

    if (customData && customData.blob) {
      // Create new fresh object URL for the uploaded blob
      activeBlobUrl = URL.createObjectURL(customData.blob);
      activeResume = {
        url: activeBlobUrl,
        name: customData.name || 'Uploaded-Resume.pdf',
        type: customData.type || 'application/pdf',
        size: customData.size || customData.blob.size,
        isCustom: true
      };
    } else {
      // Revert to default
      activeResume = { ...DEFAULT_RESUME, isCustom: false };
    }

    const isPDF = activeResume.type === 'application/pdf' || activeResume.name.toLowerCase().endsWith('.pdf');

    // Update File Info Bar
    if (resumeFileName) {
      const sizeText = activeResume.size ? ` (${formatFileSize(activeResume.size)})` : '';
      resumeFileName.textContent = `${activeResume.name}${sizeText}`;
    }

    if (resumeFileIcon) {
      resumeFileIcon.className = isPDF ? 'fa-solid fa-file-pdf' : 'fa-solid fa-file-image';
    }

    // Toggle Badge & Reset Buttons
    if (resumeUploadBadge) {
      resumeUploadBadge.style.display = activeResume.isCustom ? 'inline-flex' : 'none';
    }
    document.querySelectorAll('.reset-resume-btn').forEach(btn => {
      btn.style.display = activeResume.isCustom ? 'inline-flex' : 'none';
    });

    // Update Upload Card Status Pill
    const uploadStatusPill = document.getElementById('upload-status-pill');
    if (uploadStatusPill) {
      if (activeResume.isCustom) {
        uploadStatusPill.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Active: <strong>${activeResume.name}</strong> (${formatFileSize(activeResume.size)})`;
      } else {
        uploadStatusPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> Instant Display &amp; New Tab Viewer`;
      }
    }

    // Update Preview Viewer
    if (activeResume.isCustom) {
      if (isPDF) {
        if (resumePdfFrame) {
          resumePdfFrame.src = activeResume.url + '#toolbar=1&view=FitH';
          resumePdfFrame.style.display = 'block';
        }
        if (resumeImg) {
          resumeImg.style.display = 'none';
        }
      } else {
        // Image preview
        if (resumeImg) {
          resumeImg.src = activeResume.url;
          resumeImg.style.display = 'block';
        }
        if (resumePdfFrame) {
          resumePdfFrame.src = '';
          resumePdfFrame.style.display = 'none';
        }
      }
    } else {
      // Default state: show default image preview
      if (resumeImg) {
        resumeImg.src = DEFAULT_RESUME.imgUrl;
        resumeImg.style.display = 'block';
      }
      if (resumePdfFrame) {
        resumePdfFrame.src = '';
        resumePdfFrame.style.display = 'none';
      }
    }

    // Update "Open in New Tab" button
    if (viewResumeBtn) {
      viewResumeBtn.href = activeResume.url;
      viewResumeBtn.setAttribute('target', '_blank');
      viewResumeBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // Update all Download buttons
    downloadLinks.forEach(link => {
      link.href = activeResume.url;
      link.setAttribute('download', activeResume.name);
    });
    if (downloadResumeBtn) {
      downloadResumeBtn.href = activeResume.url;
      downloadResumeBtn.setAttribute('download', activeResume.name);
    }

    // Update Modal targets (if modal exists)
    if (modalViewTabBtn) {
      modalViewTabBtn.href = activeResume.url;
    }
    if (modalDownloadBtn) {
      modalDownloadBtn.href = activeResume.url;
      modalDownloadBtn.setAttribute('download', activeResume.name);
    }
    if (modalResumeImg && !isPDF) {
      modalResumeImg.src = activeResume.url;
      modalResumeImg.style.display = 'block';
      if (modalResumeFrame) modalResumeFrame.style.display = 'none';
    } else if (modalResumeFrame && isPDF && activeResume.isCustom) {
      modalResumeFrame.src = activeResume.url;
      modalResumeFrame.style.display = 'block';
      if (modalResumeImg) modalResumeImg.style.display = 'none';
    }
  };

  // ----------------- Open in New Tab explicit handler -----------------
  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeResume.url) {
        window.open(activeResume.url, '_blank');
      }
    });
  }

  // Clicking on Document Wrapper opens current resume in new tab
  if (resumeDocWrapper) {
    resumeDocWrapper.addEventListener('click', (e) => {
      if (e.target.closest('.document-hover-hint') || e.target === resumeImg || e.target === resumeDocWrapper) {
        if (activeResume.url) {
          window.open(activeResume.url, '_blank');
        }
      }
    });
  }

  // ----------------- Upload Processing -----------------
  const handleUploadedFile = async (file) => {
    if (!file) return;

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('File is too large! Maximum allowed size is 15MB.', 'error');
      return;
    }

    // Validate file type (PDF or common image formats)
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      showToast('Unsupported format! Please upload a PDF or image (PNG, JPG).', 'error');
      return;
    }

    try {
      const fileData = {
        name: file.name,
        type: file.type || (isPDF ? 'application/pdf' : 'image/jpeg'),
        size: file.size,
        blob: file
      };

      // Save to IndexedDB for automatic reload recovery
      await saveResumeToDB(fileData);

      // Render updated resume immediately
      applyResume(fileData);

      // Smooth scroll to resume preview
      const resumeSection = document.getElementById('resume');
      if (resumeSection) {
        resumeSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Resume "${file.name}" uploaded! Preview updated.`, 'success');
    } catch (err) {
      console.error('Error handling uploaded resume:', err);
      showToast('Failed to process uploaded resume. Please try again.', 'error');
    }
  };

  // Connect all elements with .upload-resume-trigger to open file dialog
  document.querySelectorAll('.upload-resume-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeUploadInput) {
        resumeUploadInput.click();
      }
    });
  });

  // File Input Event Listener
  if (resumeUploadInput) {
    resumeUploadInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUploadedFile(e.target.files[0]);
        // Reset input value so uploading the same file again triggers change
        e.target.value = '';
      }
    });
  }

  // Reset Buttons Event Listener
  document.querySelectorAll('.reset-resume-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await deleteResumeFromDB();
      applyResume(null);
      showToast('Reverted to default portfolio resume.', 'info');
    });
  });

  // ----------------- Drag & Drop Handling -----------------
  if (resumeDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        resumeDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'dragend'].forEach(eventName => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!resumeDropzone.contains(e.relatedTarget)) {
          resumeDropzone.classList.remove('drag-over');
        }
      });
    });

    resumeDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resumeDropzone.classList.remove('drag-over');

      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleUploadedFile(dt.files[0]);
      }
    });
  }

  // ----------------- Modal Handling (if opened) -----------------
  const openResumeModal = (e) => {
    if (e) e.preventDefault();
    if (resumeModal) {
      resumeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    if (resumeModal) {
      resumeModal.style.display = 'none';
      if (!navMenu.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }
  };

  document.querySelectorAll('.open-resume-modal-btn').forEach(btn => {
    btn.addEventListener('click', openResumeModal);
  });

  if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
  if (resumeModalBackdrop) resumeModalBackdrop.addEventListener('click', closeResumeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.style.display === 'flex') {
      closeResumeModal();
    }
  });

  // ----------------- Initial Load: Restore from IndexedDB -----------------
  loadResumeFromDB().then((saved) => {
    if (saved && saved.blob) {
      applyResume(saved);
    } else {
      applyResume(null);
    }
  }).catch(() => {
    applyResume(null);
  });


  /* --------------------------------------------------------------------------
     5. CONTACT FORM CLIENT-SIDE VALIDATION & FEEDBACK
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  // Helper to show inline errors
  const setFieldError = (inputElement, errorElementId, message) => {
    const errorEl = document.getElementById(errorElementId);
    if (message) {
      inputElement.style.borderColor = '#ef4444';
      if (errorEl) errorEl.textContent = message;
    } else {
      inputElement.style.borderColor = '';
      if (errorEl) errorEl.textContent = '';
    }
  };

  // Email format validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time input clear error on typing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      setFieldError(input, `${input.id}-error`, '');
      if (formAlert) formAlert.style.display = 'none';
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, 'name-error', 'Please enter your name.');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        setFieldError(nameInput, 'name-error', '');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setFieldError(emailInput, 'email-error', 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, 'email-error', 'Please provide a valid email address.');
        isValid = false;
      } else {
        setFieldError(emailInput, 'email-error', '');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, 'subject-error', 'Please enter a subject.');
        isValid = false;
      } else if (subjectInput.value.trim().length < 3) {
        setFieldError(subjectInput, 'subject-error', 'Subject must be at least 3 characters.');
        isValid = false;
      } else {
        setFieldError(subjectInput, 'subject-error', '');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setFieldError(messageInput, 'message-error', 'Please write your message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        setFieldError(messageInput, 'message-error', 'Message should be at least 10 characters long.');
        isValid = false;
      } else {
        setFieldError(messageInput, 'message-error', '');
      }

      if (!isValid) return;

      // Simulate sending state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        // Success state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formAlert.className = 'form-alert success';
        formAlert.innerHTML = `
          <strong><i class="fa-solid fa-circle-check"></i> Thank you, ${nameInput.value.trim()}!</strong><br>
          Your message has been validated successfully. Since this is a static portfolio, you can also reach me directly at <a href="mailto:rsk203096@gmail.com" style="color: #06b6d4; text-decoration: underline;">rsk203096@gmail.com</a> or phone <a href="tel:+918299403883" style="color: #06b6d4; text-decoration: underline;">+91 8299403883</a>.
        `;
        formAlert.style.display = 'block';

        // Reset inputs
        contactForm.reset();
      }, 700);
    });
  }


  /* --------------------------------------------------------------------------
     6. SCROLL TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  const toggleScrollToTop = () => {
    if (window.scrollY > 350) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleScrollToTop, { passive: true });
  toggleScrollToTop();

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* --------------------------------------------------------------------------
     7. DYNAMIC FOOTER YEAR
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
