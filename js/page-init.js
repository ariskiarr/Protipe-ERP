/**
 * KSteel ERP - Page Initialization Script
 * This script should be included in all pages to ensure consistent role-based navigation
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize role-based navigation
  const role = localStorage.getItem("ksteel-user-role") || "admin";
  const username = localStorage.getItem("ksteel-username") || "Admin KSteel";

  // Prevent reloads on customers.html page
  if (window.location.pathname.includes("customers.html")) {
    console.log("On customers page - applying special handling");

    // Intercept all link clicks on the page
    document.addEventListener(
      "click",
      function (e) {
        // Check if the clicked element or its parent is a link to customers.html
        const clickedElement = e.target;
        const parentLink = clickedElement.closest("a");

        if (
          parentLink &&
          parentLink.getAttribute("href") &&
          parentLink.getAttribute("href").includes("customers.html")
        ) {
          e.preventDefault();
          console.log("Preventing customers.html navigation - already on page");
          return false;
        }

        // Also prevent clicks on menu items for customers page
        if (
          clickedElement.classList.contains("menu-item") ||
          clickedElement.closest(".menu-item")
        ) {
          const menuItem = clickedElement.classList.contains("menu-item")
            ? clickedElement
            : clickedElement.closest(".menu-item");
          if (menuItem.getAttribute("data-page") === "customers") {
            e.preventDefault();
            console.log(
              "Preventing menu navigation to customers - already on page"
            );
            return false;
          }
        }
      },
      true
    );
  }

  // Render sidebar based on role
  renderSidebar(role);

  // Update user info in header
  updateUserInfo(role, username);

  // Initialize common UI elements
  initializeUI();

  // Fix all modal buttons that might not be properly initialized
  initializeAllModalButtons();

  // Re-initialize when content changes
  const observer = new MutationObserver(function () {
    initializeAllModalButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

// Initialize UI elements
function initializeUI() {
  // Toggle sidebar
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (menuToggle && sidebar && mainContent) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // Setup logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Clear role info
      localStorage.removeItem("ksteel-user-role");
      localStorage.removeItem("ksteel-username");

      // Redirect to login
      window.location.href = getBasePath() + "login.html";
    });
  }
}

// Get base path to handle proper navigation from pages folder
function getBasePath() {
  // Check if we're in the pages folder
  if (window.location.pathname.includes("/pages/")) {
    return "../";
  }
  return "";
}

// Function to handle role switching for demo purposes
function switchRole(role, username) {
  if (!role) return;

  // Store role in localStorage
  localStorage.setItem("ksteel-user-role", role);
  localStorage.setItem("ksteel-username", username || "User");

  // Update UI
  renderSidebar(role);
  updateUserInfo(role, username || "User");

  // Redirect to appropriate dashboard
  const basePath = getBasePath();
  switch (role) {
    case "admin":
      window.location.href = basePath + "index.html";
      break;
    case "sales":
      window.location.href = basePath + "index-sales.html";
      break;
    case "warehouse":
      window.location.href = basePath + "index-warehouse.html";
      break;
    default:
      window.location.href = basePath + "index.html";
  }
}

/**
 * Ensure all modal buttons are properly initialized for all pages
 */
function initializeAllModalButtons() {
  // For all elements with data-toggle="modal"
  document.querySelectorAll('[data-toggle="modal"]').forEach((button) => {
    // Remove any previous event listeners
    const clone = button.cloneNode(true);
    button.parentNode.replaceChild(clone, button);

    // Add new event listener
    const targetModalId = clone.getAttribute("data-target")?.replace("#", "");
    if (targetModalId) {
      clone.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal(targetModalId);
        return false;
      });

      // Make sure it's visible and clickable
      clone.style.cursor = "pointer";
      clone.style.pointerEvents = "auto";
      clone.style.position = "relative";
      clone.style.zIndex = "1000";
    }
  });
}
