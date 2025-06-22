// KSteel Nusantara ERP System JS

document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // Mobile sidebar toggle
  const mobileToggle = document.querySelector(".mobile-toggle");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      sidebar.classList.toggle("mobile-visible");
    });
  }

  // Add tooltips to menu items
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    const itemText = item.querySelector("span")?.textContent;
    if (itemText) {
      item.setAttribute("data-title", itemText);
    }
  });

  // Initialize all pages
  initializePage();

  // Navigation handling
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const pageId = this.getAttribute("data-page");
      if (pageId) {
        navigateToPage(pageId);
      }
    });
  });

  // Setup form validation
  setupFormValidation();

  // Setup dynamic tables
  setupTables();

  // Initialize charts on dashboard
  if (document.getElementById("salesChart")) {
    initializeCharts();
  }
});

// Page navigation
function navigateToPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => (page.style.display = "none"));

  // Show selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = "block";
  }

  // Update active menu item
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-page") === pageId) {
      item.classList.add("active");
    }
  });

  // Update page title
  updatePageTitle(pageId);
}

function updatePageTitle(pageId) {
  const pageTitleMap = {
    dashboard: "Dashboard",
    customers: "Data Pelanggan",
    suppliers: "Data Supplier",
    invoices: "Faktur Penjualan",
    inventory: "Barang & Stok",
    incoming: "Barang Masuk",
    outgoing: "Barang Keluar",
    shipping: "Surat Jalan",
    "slow-moving": "Barang Slow-Moving",
    reports: "Laporan",
    settings: "Pengaturan",
  };

  const pageTitle = document.querySelector(".page-title");
  if (pageTitle && pageTitleMap[pageId]) {
    pageTitle.textContent = pageTitleMap[pageId];
  }
}

// Initialize page based on URL or default to dashboard
function initializePage() {
  const hash = window.location.hash.substring(1) || "dashboard";
  navigateToPage(hash);
}

// Form validation
function setupFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      if (!validateForm(this)) {
        event.preventDefault();
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  // Remove previous error message
  const errorElement = field.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }

  // Check required fields
  if (field.hasAttribute("required") && value === "") {
    showError(field, "Field ini harus diisi");
    isValid = false;
  }

  // Email validation
  if (field.type === "email" && value !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(field, "Format email tidak valid");
      isValid = false;
    }
  }

  // Phone validation
  if (field.classList.contains("phone-input") && value !== "") {
    const phoneRegex = /^[0-9\+\-\s]{10,15}$/;
    if (!phoneRegex.test(value)) {
      showError(field, "Format nomor telepon tidak valid");
      isValid = false;
    }
  }

  return isValid;
}

function showError(field, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";

  field.parentNode.appendChild(errorDiv);
  field.classList.add("error");
}

// Table functionality
function setupTables() {
  // Customer table
  setupCustomerTable();

  // Supplier table
  setupSupplierTable();

  // Inventory table
  setupInventoryTable();

  // Invoice table
  setupInvoiceTable();

  // Shipping table
  setupShippingTable();

  // Slow moving table
  setupSlowMovingTable();
}

function setupCustomerTable() {
  const customerTable = document.getElementById("customerTable");
  if (!customerTable) return;

  // Check user role
  const userRole = localStorage.getItem("ksteel-user-role");

  // Sample data
  const customers = [
    {
      id: 1,
      name: "PT Maju Bersama",
      phone: "021-5553210",
      address: "Jl. Raya Kelapa Dua No. 10, Jakarta Barat",
      status: "Active",
    },
    {
      id: 2,
      name: "CV Abadi Jaya",
      phone: "022-6784512",
      address: "Jl. Gatot Subroto 123, Bandung",
      status: "Active",
    },
    {
      id: 3,
      name: "PT Sejahtera Makmur",
      phone: "031-8873421",
      address: "Jl. Panglima Sudirman 88, Surabaya",
      status: "Inactive",
    },
  ];

  let tbody = customerTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    customerTable.appendChild(tbody);
  }

  customers.forEach((customer) => {
    const row = document.createElement("tr");

    // Conditionally show or hide delete button based on role
    let actionsHtml = `
      <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${customer.id}" data-toggle="modal" data-target="#editCustomerModal"><i class="fas fa-edit"></i></button>
    `;

    // Only add delete button for non-sales roles
    if (userRole !== "sales") {
      actionsHtml += `<button class="btn btn-sm btn-outline-primary delete-btn" data-id="${customer.id}"><i class="fas fa-trash"></i></button>`;
    }

    row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${customer.status}</td>
            <td class="table-actions">
                ${actionsHtml}
            </td>
        `;
    tbody.appendChild(row);
  });

  // Setup edit and delete buttons
  const editButtons = customerTable.querySelectorAll(".edit-btn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const customerId = this.getAttribute("data-id");
      editCustomer(customerId);
    });
  });

  const deleteButtons = customerTable.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const customerId = this.getAttribute("data-id");
      deleteCustomer(customerId);
    });
  });
}

function editCustomer(id) {
  // Show customer edit modal with data
  const modal = document.getElementById("editCustomerModal");
  if (modal) {
    modal.style.display = "block";

    // Populate form with customer data
    // In a real app, you'd fetch this from an API
    const customer = {
      id: id,
      name: "PT Maju Bersama",
      phone: "021-5553210",
      address: "Jl. Raya Kelapa Dua No. 10, Jakarta Barat",
      email: "contact@majubersama.co.id",
      contactPerson: "Budi Santoso",
    };

    modal.querySelector("#editCustomerName").value = customer.name;
    modal.querySelector("#editCustomerPhone").value = customer.phone;
    modal.querySelector("#editCustomerAddress").value = customer.address;
    modal.querySelector("#editCustomerEmail").value = customer.email;
    modal.querySelector("#editCustomerContact").value = customer.contactPerson;
  }
}

function deleteCustomer(id) {
  if (confirm("Anda yakin ingin menghapus data pelanggan ini?")) {
    console.log(`Deleting customer with ID: ${id}`);
    // In a real app, you'd make an API call to delete

    // For demo, just remove the row
    const row = document
      .querySelector(`.delete-btn[data-id="${id}"]`)
      .closest("tr");
    row.remove();
  }
}

function setupInventoryTable() {
  const inventoryTable = document.getElementById("inventoryTable");
  if (!inventoryTable) return;

  // Sample data
  const inventory = [
    {
      id: 1,
      code: "STL-001",
      name: "Besi Beton 10mm",
      stock: 500,
      minStock: 100,
      status: "high",
    },
    {
      id: 2,
      code: "STL-002",
      name: "Besi Hollow 4x2",
      stock: 120,
      minStock: 100,
      status: "medium",
    },
    {
      id: 3,
      code: "STL-003",
      name: "Kawat Las 2.6mm",
      stock: 20,
      minStock: 50,
      status: "low",
    },
  ];

  let tbody = inventoryTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    inventoryTable.appendChild(tbody);
  }

  inventory.forEach((item) => {
    const row = document.createElement("tr");

    let stockStatus = "";
    switch (item.status) {
      case "high":
        stockStatus = '<span class="stock-indicator stock-high"></span> Cukup';
        break;
      case "medium":
        stockStatus =
          '<span class="stock-indicator stock-medium"></span> Hampir Habis';
        break;
      case "low":
        stockStatus =
          '<span class="stock-indicator stock-low"></span> Stok Habis';
        break;
    }

    row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>${item.minStock}</td>
            <td>${stockStatus}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-primary delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function setupInvoiceTable() {
  const invoiceTable = document.getElementById("invoiceTable");
  if (!invoiceTable) return;

  // Sample data
  const invoices = [
    {
      id: "INV-20250001",
      customer: "PT Maju Bersama",
      date: "2025-06-20",
      total: 15000000,
      status: "approved",
    },
    {
      id: "INV-20250002",
      customer: "CV Abadi Jaya",
      date: "2025-06-21",
      total: 8500000,
      status: "draft",
    },
    {
      id: "INV-20250003",
      customer: "PT Sejahtera Makmur",
      date: "2025-06-22",
      total: 22000000,
      status: "approved",
    },
  ];

  let tbody = invoiceTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    invoiceTable.appendChild(tbody);
  }

  invoices.forEach((invoice) => {
    const row = document.createElement("tr");

    let statusBadge = "";
    switch (invoice.status) {
      case "draft":
        statusBadge = '<span class="status status-draft">Draft</span>';
        break;
      case "approved":
        statusBadge = '<span class="status status-approved">Disetujui</span>';
        break;
    }

    // Format currency
    const formattedTotal = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(invoice.total);

    row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.customer}</td>
            <td>${invoice.date}</td>
            <td>${formattedTotal}</td>
            <td>${statusBadge}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary view-btn" data-id="${invoice.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-primary print-btn" data-id="${invoice.id}"><i class="fas fa-print"></i></button>
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${invoice.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function setupShippingTable() {
  const shippingTable = document.getElementById("shippingTable");
  if (!shippingTable) return;

  // Sample data
  const shipments = [
    {
      id: "SJ-20250001",
      invoice: "INV-20250001",
      customer: "PT Maju Bersama",
      date: "2025-06-21",
      status: "ready",
    },
    {
      id: "SJ-20250002",
      invoice: "INV-20250003",
      customer: "PT Sejahtera Makmur",
      date: "2025-06-22",
      status: "shipping",
    },
    {
      id: "SJ-20250003",
      invoice: "INV-20250004",
      customer: "CV Abadi Jaya",
      date: "2025-06-20",
      status: "delivered",
    },
  ];

  let tbody = shippingTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    shippingTable.appendChild(tbody);
  }

  shipments.forEach((shipment) => {
    const row = document.createElement("tr");

    let statusBadge = "";
    switch (shipment.status) {
      case "ready":
        statusBadge = '<span class="status status-draft">Siap Kirim</span>';
        break;
      case "shipping":
        statusBadge =
          '<span class="status status-shipping">Dalam Perjalanan</span>';
        break;
      case "delivered":
        statusBadge = '<span class="status status-delivered">Terkirim</span>';
        break;
    }

    row.innerHTML = `
            <td>${shipment.id}</td>
            <td>${shipment.invoice}</td>
            <td>${shipment.customer}</td>
            <td>${shipment.date}</td>
            <td>${statusBadge}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary view-btn" data-id="${shipment.id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-primary print-btn" data-id="${shipment.id}"><i class="fas fa-print"></i></button>
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${shipment.id}"><i class="fas fa-edit"></i></button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function setupSupplierTable() {
  const supplierTable = document.getElementById("supplierTable");
  if (!supplierTable) return;

  // Sample data
  const suppliers = [
    {
      id: 1,
      name: "PT Baja Prima",
      phone: "021-8765432",
      address: "Jl. Industri Raya No. 15, Cikarang",
      status: "Active",
    },
    {
      id: 2,
      name: "CV Logam Jaya",
      phone: "022-5671234",
      address: "Jl. Terusan Buah Batu 45, Bandung",
      status: "Active",
    },
    {
      id: 3,
      name: "PT Steel Indonesia",
      phone: "031-7891234",
      address: "Jl. Rungkut Industri III/22, Surabaya",
      status: "Inactive",
    },
  ];

  let tbody = supplierTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    supplierTable.appendChild(tbody);
  }

  suppliers.forEach((supplier) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>${supplier.status}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${supplier.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-primary delete-btn" data-id="${supplier.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function setupSlowMovingTable() {
  const slowMovingTable = document.getElementById("slowMovingTable");
  if (!slowMovingTable) return;

  // Sample data
  const slowMoving = [
    {
      id: 1,
      code: "STL-005",
      name: "Besi U 5x5",
      lastMovement: "2025-05-01",
      stock: 75,
      days: 52,
    },
    {
      id: 2,
      code: "STL-008",
      name: "Plat Besi 2mm",
      lastMovement: "2025-05-10",
      stock: 30,
      days: 43,
    },
    {
      id: 3,
      code: "STL-012",
      name: 'Pipa Besi 2"',
      lastMovement: "2025-05-15",
      stock: 25,
      days: 38,
    },
  ];

  let tbody = slowMovingTable.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    slowMovingTable.appendChild(tbody);
  }

  slowMoving.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.lastMovement}</td>
            <td>${item.stock}</td>
            <td>${item.days} hari</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-accent promo-btn" data-id="${item.id}">Tandai Promo</button>
                <button class="btn btn-sm btn-outline-primary archive-btn" data-id="${item.id}">Arsipkan</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Charts for dashboard
function initializeCharts() {
  // Set white background for all charts
  Chart.defaults.backgroundColor = "#FFFFFF";
  Chart.defaults.color = "#000000";
  Chart.defaults.scale.grid.color = "rgba(0, 0, 0, 0.1)";

  // Prepare the canvas with white background
  const prepareWhiteBackground = (ctx) => {
    ctx.canvas.style.backgroundColor = "#FFFFFF";
    const parent = ctx.canvas.parentNode;
    if (parent) {
      parent.style.backgroundColor = "#FFFFFF";
    }
    // Fill with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  // Sales Chart
  const salesCtx = document.getElementById("salesChart").getContext("2d");
  prepareWhiteBackground(salesCtx);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Penjualan (dalam juta)",
        data: [65, 59, 80, 81, 56, 90],
        backgroundColor: "rgba(0, 51, 102, 0.2)",
        borderColor: "#003366",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };
  new Chart(salesCtx, {
    type: "line",
    data: salesData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: "#FFFFFF",
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#000000",
          },
        },
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#000000",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#000000",
          },
        },
      },
    },
  });
  // Inventory Movement Chart
  const inventoryCtx = document
    .getElementById("inventoryChart")
    .getContext("2d");
  prepareWhiteBackground(inventoryCtx);

  const inventoryData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Barang Masuk",
        data: [30, 20, 25, 40, 35, 45],
        backgroundColor: "rgba(0, 51, 102, 0.7)",
      },
      {
        label: "Barang Keluar",
        data: [25, 15, 20, 35, 30, 40],
        backgroundColor: "rgba(255, 128, 0, 0.7)",
      },
    ],
  };
  new Chart(inventoryCtx, {
    type: "bar",
    data: inventoryData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: "#FFFFFF",
      color: "#000000",
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#000000",
          },
        },
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#000000",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#000000",
          },
        },
      },
    },
  });
}

// Calculate and display invoice total
function calculateInvoiceTotal() {
  const table = document.getElementById("invoiceItemsTable");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  let total = 0;

  rows.forEach((row) => {
    const qty = parseInt(row.querySelector(".item-qty").value) || 0;
    const price = parseFloat(row.querySelector(".item-price").value) || 0;
    const subtotal = qty * price;

    row.querySelector(".item-subtotal").textContent = formatCurrency(subtotal);
    total += subtotal;
  });

  const totalElement = document.getElementById("invoiceTotal");
  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

// Modal handling
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});
