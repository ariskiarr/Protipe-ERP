/**
 * KSteel ERP - Role-based navigation and permissions
 */

// Define menus for each role
const roleMenus = {
  // Admin - managerial oversight and system management
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-th-large",
      url: "../index.html",
    },
    {
      id: "inventory",
      label: "Barang & Stok",
      icon: "fas fa-boxes",
      url: "inventory.html",
    },
    {
      id: "incoming",
      label: "Barang Masuk",
      icon: "fas fa-truck-loading",
      url: "incoming.html",
    },
    {
      id: "outgoing",
      label: "Barang Keluar",
      icon: "fas fa-dolly",
      url: "outgoing.html",
    },
    {
      id: "slow-moving",
      label: "Barang Slow-Moving",
      icon: "fas fa-hourglass-half",
      url: "slow-moving.html",
    },
    {
      id: "shipping",
      label: "Surat Jalan",
      icon: "fas fa-shipping-fast",
      url: "shipping.html",
    },
    {
      id: "sales-reports",
      label: "Laporan Penjualan",
      icon: "fas fa-chart-bar",
      url: "sales-reports.html",
    },
    {
      id: "stock-reports",
      label: "Laporan Stok",
      icon: "fas fa-clipboard-list",
      url: "stock-reports.html",
    },
    {
      id: "reports",
      label: "Laporan Pergerakan Stok",
      icon: "fas fa-chart-line",
      url: "reports.html",
    },
    {
      id: "settings",
      label: "Pengaturan",
      icon: "fas fa-cog",
      url: "settings.html",
    },
  ], // Staf Sales - manages customers, suppliers, and sales transactions
  sales: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-th-large",
      url: "../index-sales.html",
    },
    {
      id: "customers",
      label: "Data Pelanggan",
      icon: "fas fa-users",
      url: "customers2.html",
      noNavIfActive: true, // Special flag to prevent navigation when already active
    },
    {
      id: "suppliers",
      label: "Data Supplier",
      icon: "fas fa-building",
      url: "suppliers.html",
    },
    {
      id: "invoices",
      label: "Faktur Penjualan",
      icon: "fas fa-file-invoice-dollar",
      url: "invoices.html",
    },
    {
      id: "inventory-view",
      label: "Lihat Stok",
      icon: "fas fa-boxes",
      url: "inventory-view.html",
    },
  ],
  // Staf Gudang - manages inventory, shipping, and warehouse operations
  warehouse: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-th-large",
      url: "../index-warehouse.html",
    },
    {
      id: "inventory",
      label: "Barang & Stok",
      icon: "fas fa-boxes",
      url: "inventory.html",
    },
    {
      id: "incoming",
      label: "Barang Masuk",
      icon: "fas fa-truck-loading",
      url: "incoming.html",
    },
    {
      id: "outgoing",
      label: "Barang Keluar",
      icon: "fas fa-dolly",
      url: "outgoing.html",
    },
    {
      id: "slow-moving",
      label: "Barang Slow-Moving",
      icon: "fas fa-hourglass-half",
      url: "slow-moving.html",
    },
    {
      id: "shipping",
      label: "Surat Jalan",
      icon: "fas fa-shipping-fast",
      url: "shipping.html",
    },
    {
      id: "stock-reports",
      label: "Laporan Stok",
      icon: "fas fa-clipboard-list",
      url: "stock-reports.html",
    },
  ],
};

// Render sidebar menu based on user role
function renderSidebar(role) {
  const sidebar = document.querySelector(".sidebar-menu");
  if (!sidebar) return;

  // Clear existing menu items
  sidebar.innerHTML = "";

  // Get current page to highlight active menu
  const currentPage = window.location.pathname.split("/").pop();

  // Add menu items for the role
  const menuItems = roleMenus[role] || roleMenus.admin; // Default to admin if role not found
  // Get base path for correct URL generation
  const basePath = getBasePath();

  menuItems.forEach((item) => {
    // Process URL for correct path
    let itemUrl = item.url;

    // Handle URLs properly based on current location and target
    if (basePath === "../" && !itemUrl.startsWith("../")) {
      // We're in the pages folder, and the URL is not a reference to the root (like ../index.html)
      // Keep it as is since we're already in the pages folder
      itemUrl = itemUrl;
    } else if (
      basePath === "" &&
      !itemUrl.startsWith("../") &&
      !itemUrl.startsWith("pages/")
    ) {
      // We're in the root folder and the URL is referring to a page in the pages folder
      // Add the pages/ prefix
      itemUrl = "pages/" + itemUrl;
    }
    const isActive = currentPage === itemUrl.split("/").pop();
    const menuItem = document.createElement("li");
    menuItem.className = `menu-item ${isActive ? "active" : ""}`;
    menuItem.setAttribute("data-page", item.id);
    menuItem.setAttribute("data-title", item.label);

    // Create the menu item as a direct link instead of nesting an anchor
    menuItem.innerHTML = `
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
        `; // Make the entire li element act as a link, but with special handling for customers.html
    menuItem.addEventListener("click", function (e) {
      e.preventDefault(); // Always prevent default first

      // Get the current page filename and target page filename
      const currentPageFile = window.location.pathname.split("/").pop();
      const targetPageFile = itemUrl.split("/").pop();
      // Special case for customers.html or any page with noNavIfActive flag
      if (
        (item.noNavIfActive === true && isActive) ||
        (targetPageFile === "customers.html" &&
          currentPageFile === "customers.html")
      ) {
        console.log(
          "Already on active page with noNavIfActive flag - preventing navigation"
        );
        return false;
      }

      // If we're already on the target page, don't reload
      if (currentPageFile === targetPageFile) {
        console.log(
          "Already on " + currentPageFile + " - preventing navigation"
        );
        return false;
      }

      // Otherwise navigate to the target page
      console.log("Navigating to: " + itemUrl);
      window.location.href = itemUrl;
    });

    sidebar.appendChild(menuItem);
  });
}

// Get base path to handle proper navigation from pages folder
function getBasePath() {
  // Check if we're in the pages folder
  if (window.location.pathname.includes("/pages/")) {
    return "../";
  }
  return "";
}

// Update header with user info based on role
function updateUserInfo(role, username) {
  const userInfo = document.querySelector(".user-info");
  if (!userInfo) return;

  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  userInfo.innerHTML = `
        <div>
            <div class="user-name">${username}</div>
            <div class="user-role">${roleDisplay}</div>
        </div>
    `;
}

// Initialize role from localStorage or set to default
function initializeRole() {
  const role = localStorage.getItem("ksteel-user-role") || "admin";
  const username = localStorage.getItem("ksteel-username") || "Admin KSteel";

  renderSidebar(role);
  updateUserInfo(role, username);

  return { role, username };
}

// Event handlers for role switching (for demo purposes)
document.addEventListener("DOMContentLoaded", function () {
  const userRole = initializeRole();

  // Update page title with role
  if (document.title.indexOf(" - ") > -1) {
    const baseName = document.title.split(" - ")[0];
    document.title = `${baseName} - ${
      userRole.role.charAt(0).toUpperCase() + userRole.role.slice(1)
    } - PT KSteel Nusantara ERP`;
  }
});

// Function to switch roles (for demo)
function switchRole(role, username) {
  localStorage.setItem("ksteel-user-role", role);
  localStorage.setItem("ksteel-username", username);

  // Redirect to appropriate dashboard
  switch (role) {
    case "sales":
      window.location.href = "../index-sales.html";
      break;
    case "warehouse":
      window.location.href = "../index-warehouse.html";
      break;
    default:
      window.location.href = "../index.html";
  }
}
