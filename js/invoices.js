import { getInvoices, saveInvoices, getClients } from "./data.js";

import { generateId, formatCurrency } from "./utils.js";

// =========================
// STATE
// =========================
let invoices = [];
let clients = [];

// =========================
// DOM ELEMENTS
// =========================
const form = document.getElementById("invoiceForm");
const clientSelect = document.getElementById("invoiceClient");
const titleInput = document.getElementById("serviceTitle");
const descInput = document.getElementById("invoiceDescription");
const amountInput = document.getElementById("invoiceAmount");
const dateInput = document.getElementById("invoiceDate");
const invoiceIdInput = document.getElementById("invoiceId");
const tableBody = document.getElementById("invoiceTableBody");
const submitBtn = document.getElementById("submitInvoiceBtn");
const sortSelect = document.getElementById("sortInvoices");

// =========================
// INIT
// =========================
function init() {
  invoices = getInvoices();
  clients = getClients();

  renderClientOptions();
  renderInvoices();
}

init();

// =========================
// LOAD CLIENT DROPDOWN
// =========================
function renderClientOptions() {
  clientSelect.innerHTML = `<option value="">Select Client</option>`;

  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    clientSelect.appendChild(option);
  });
}

// =========================
// RENDER INVOICES
// =========================
function renderInvoices(data = invoices) {
  tableBody.innerHTML = "";

  data.forEach((invoice) => {
    const client = clients.find((c) => c.id == invoice.clientId);

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${client ? client.name : "Unknown"}</td>
            <td>${invoice.title}</td>
            <td>${formatCurrency(invoice.amount)}</td>
            <td>${invoice.date}</td>
            <td>
                <span class="badge ${invoice.paid ? "paid" : "unpaid"}">
                    ${invoice.paid ? "🟢 Paid" : "🔴 Unpaid"}
                </span>
            </td>
            <td>
                <button class="btn-icon edit" onclick="editInvoice(${invoice.id})">
    <i class="fa-solid fa-pen"></i>
</button>

<button class="btn-icon delete" onclick="deleteInvoice(${invoice.id})">
    <i class="fa-solid fa-trash"></i>
</button>

<button class="btn-icon toggle" onclick="toggleStatus(${invoice.id})">
    <i class="fa-solid fa-arrows-rotate"></i>
</button>
            </td>
        `;

    tableBody.appendChild(row);
  });
}

// =========================
// CREATE / UPDATE INVOICE
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const clientId = clientSelect.value;
  const title = titleInput.value.trim();
  const amount = amountInput.value;
  const date = dateInput.value;

  if (isNaN(amount) || Number(amount) <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  const id = invoiceIdInput.value;

  if (id) {
    // UPDATE
    invoices = invoices.map((inv) =>
      inv.id == id
        ? {
            ...inv,
            clientId,
            title,
            description: descInput.value.trim(),
            amount: Number(amount),
            date,
          }
        : inv,
    );
  } else {
    // CREATE
    const newInvoice = {
      id: generateId(),
      clientId,
      title,
      description: descInput.value.trim(),
      amount: Number(amount),
      date,
      paid: false,
    };

    invoices.push(newInvoice);
  }

  saveInvoices(invoices);
  resetForm();
  renderInvoices();
});

// =========================
// EDIT
// =========================
window.editInvoice = function (id) {
  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) return;

  clientSelect.value = invoice.clientId;
  titleInput.value = invoice.title;
  descInput.value = invoice.description;
  amountInput.value = invoice.amount;
  dateInput.value = invoice.date;
  invoiceIdInput.value = invoice.id;

  submitBtn.innerHTML = "Update Invoice";
};

// =========================
// DELETE
// =========================
window.deleteInvoice = function (id) {
  if (!confirm("Delete this invoice?")) return;

  invoices = invoices.filter((i) => i.id !== id);

  saveInvoices(invoices);
  renderInvoices();
};

// =========================
// TOGGLE PAID / UNPAID
// =========================
window.toggleStatus = function (id) {
  invoices = invoices.map((inv) =>
    inv.id == id ? { ...inv, paid: !inv.paid } : inv,
  );

  saveInvoices(invoices);
  renderInvoices();
};

// =========================
// SORT
// =========================
sortSelect.addEventListener("change", (e) => {
  const key = e.target.value;

  let sorted = [...invoices];

  if (key === "amount") {
    sorted.sort((a, b) => b.amount - a.amount);
  } else if (key === "date") {
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (key === "status") {
    sorted.sort((a, b) => Number(b.paid) - Number(a.paid));
  }

  renderInvoices(sorted);
});

// =========================
// RESET FORM
// =========================
function resetForm() {
  form.reset();
  invoiceIdInput.value = "";
  submitBtn.innerHTML = "Create Invoice";
}
