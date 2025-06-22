/**
 * KSteel ERP - Modal Handler
 * Manages modals with improved animations and functionality
 */

// Initialize all modals when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initModals();
});

// Initialize modals with proper event listeners and classes
function initModals() {
  // Find all modals
  const modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    // Clean up inline styles
    if (modal.hasAttribute("style")) {
      modal.removeAttribute("style");
    }

    // Set up close buttons
    const closeBtns = modal.querySelectorAll(
      '.close-modal, [data-dismiss="modal"]'
    );
    const modalContent = modal.querySelector(".modal-content");

    if (modalContent && modalContent.hasAttribute("style")) {
      modalContent.removeAttribute("style");
    }

    closeBtns.forEach((btn) => {
      // Remove existing onclick attributes
      if (btn.hasAttribute("onclick")) {
        btn.removeAttribute("onclick");
      }

      // Add proper event listener
      btn.addEventListener("click", function () {
        closeModal(modal.id);
      });
    });

    // Close modal if clicking outside content
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  }); // Find all triggers
  const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');

  modalTriggers.forEach((trigger) => {
    const targetId = trigger.getAttribute("data-target");
    if (targetId) {
      // Remove any existing event listeners by cloning
      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);

      // Add new event listener with prevent default
      newTrigger.addEventListener(
        "click",
        function (e) {
          console.log("Modal trigger clicked: " + targetId);
          e.preventDefault();
          e.stopPropagation();
          openModal(targetId.replace("#", ""));
          return false;
        },
        true
      ); // Use capture phase

      // Make sure it's visible and clickable
      newTrigger.style.cursor = "pointer";
      newTrigger.style.pointerEvents = "auto";
      newTrigger.style.position = "relative";
      newTrigger.style.zIndex = "1000";
    }
  });

  // Add ESC key listener
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const visibleModal = document.querySelector(".modal.show");
      if (visibleModal) {
        closeModal(visibleModal.id);
      }
    }
  });
}

// Open modal function
function openModal(modalId) {
  // Prevent event default behavior that might cause page reload
  if (window.event) {
    window.event.preventDefault();
    window.event.stopPropagation();
  }

  const modal = document.getElementById(modalId);
  if (modal) {
    // Show modal
    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Make sure buttons work
    const buttons = modal.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.zIndex = "10001";
      button.style.position = "relative";
      button.style.pointerEvents = "auto";
    });

    // Fire event
    const event = new CustomEvent("modal:opened", {
      detail: { modalId: modalId },
    });
    document.dispatchEvent(event);

    console.log("Modal opened: " + modalId);
    return false; // Prevent event propagation
  }
}

// Close modal function
function closeModal(modalId) {
  // Prevent event default behavior that might cause page reload
  if (window.event) {
    window.event.preventDefault();
    window.event.stopPropagation();
  }

  const modal = document.getElementById(modalId);
  if (modal) {
    // Hide modal
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      setTimeout(() => {
        modal.style.display = "";
      }, 100);
    }, 300);
    document.body.style.overflow = "";

    // Fire event
    const event = new CustomEvent("modal:closed", {
      detail: { modalId: modalId },
    });
    document.dispatchEvent(event);

    console.log("Modal closed: " + modalId);
    return false; // Prevent event propagation
  }
}

// Global functions (exposed to window)
window.openModal = openModal;
window.closeModal = closeModal;
