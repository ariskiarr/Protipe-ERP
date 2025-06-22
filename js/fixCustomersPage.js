/**
 * Special fix for customers page reload issues (works for both customers.html and customers2.html)
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Applying special fix for customers page");

  // Only apply this fix on the customers page
  if (
    !window.location.pathname.includes("customers.html") &&
    !window.location.pathname.includes("customers2.html")
  ) {
    return;
  }

  console.log("Detected customers page - applying navigation fix");

  // 1. Fix the sidebar navigation for Data Pelanggan
  const customersMenuItem = document.querySelector(
    '.menu-item[data-page="customers"]'
  );
  if (customersMenuItem) {
    // Clone to remove all event listeners
    const newMenuItem = customersMenuItem.cloneNode(true);
    customersMenuItem.parentNode.replaceChild(newMenuItem, customersMenuItem);

    // No click handler - this prevents navigation when already on customers page
    console.log("Removed click handler from customers menu item");
  }

  // 2. Intercept all link clicks that might cause refresh
  document.addEventListener(
    "click",
    function (e) {
      // Check for sidebar menu item clicks specifically
      if (e.target.closest('.sidebar-menu .menu-item[data-page="customers"]')) {
        console.log("Intercepted click on customers menu item");
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Check for any links to customers.html
      const clickedLink = e.target.closest("a");
      if (
        clickedLink &&
        clickedLink.getAttribute("href") &&
        clickedLink.getAttribute("href").includes("customers.html")
      ) {
        console.log("Intercepted click on link to customers.html");
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true
  ); // Use capture phase to intercept before bubbling

  // 3. Special fix for the "Tambah Pelanggan" button
  const addCustomerBtn = document.getElementById("addCustomerBtn");
  if (addCustomerBtn) {
    // Remove all existing listeners
    const newAddBtn = addCustomerBtn.cloneNode(true);
    addCustomerBtn.parentNode.replaceChild(newAddBtn, addCustomerBtn);

    // Add new listener with explicit modal opening
    newAddBtn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Tambah Pelanggan button clicked, opening modal");
        openModal("addCustomerModal");
        return false;
      },
      true
    );
  }

  // 4. Fix edit buttons to ensure they open modals correctly
  document.querySelectorAll(".edit-btn").forEach(function (btn) {
    // Remove existing listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    // Add new listener with explicit customer editing
    newBtn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        const customerId = this.getAttribute("data-id");
        console.log("Edit button clicked for customer ID: " + customerId);
        editCustomer(customerId);
        return false;
      },
      true
    );
  });
});

// Special version of editCustomer function to ensure it doesn't reload page
function editCustomer(customerId) {
  console.log("Opening edit modal for customer: " + customerId);
  // Get the data from our mock data set
  const customerData = {
    1: {
      name: "PT Maju Bersama",
      phone: "021-5553210",
      address: "Jl. Raya Kelapa Dua No. 10, Jakarta Barat",
      email: "contact@majubersama.co.id",
      contactPerson: "Budi Santoso",
      status: "Active",
    },
    2: {
      name: "CV Abadi Jaya",
      phone: "022-6784512",
      address: "Jl. Gatot Subroto 123, Bandung",
      email: "info@abadijaya.com",
      contactPerson: "Dewi Lestari",
      status: "Active",
    },
    3: {
      name: "PT Sejahtera Makmur",
      phone: "031-8873421",
      address: "Jl. Panglima Sudirman 88, Surabaya",
      email: "admin@sejahteramakmur.id",
      contactPerson: "Ahmad Hidayat",
      status: "Inactive",
    },
  };

  // Get customer data or use empty values if not found
  const customer = customerData[customerId] || {
    name: "",
    phone: "",
    address: "",
    email: "",
    contactPerson: "",
    status: "Active",
  };

  // Populate the form fields
  const modal = document.getElementById("editCustomerModal");
  if (modal) {
    document.getElementById("editCustomerName").value = customer.name;
    document.getElementById("editCustomerPhone").value = customer.phone;
    document.getElementById("editCustomerAddress").value = customer.address;
    document.getElementById("editCustomerEmail").value = customer.email || "";
    document.getElementById("editCustomerContact").value =
      customer.contactPerson || "";
    document.getElementById("editCustomerStatus").value = customer.status;

    // Update button's data-id attribute
    const updateBtn = document.getElementById("updateCustomerBtn");
    if (updateBtn) {
      updateBtn.setAttribute("data-id", customerId);
    }

    // Show the modal using our modal system
    openModal("editCustomerModal");
    return false;
  }
}
