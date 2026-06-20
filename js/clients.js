import { getClients, saveClients } from "./data.js";

import { fetchRandomClients, generateId, validateEmail } from "./utils.js";

// =========================
// STATE
// =========================
let clients = [];

// =========================
// DOM ELEMENTS
// =========================
const form = document.getElementById("clientForm");
const nameInput = document.getElementById("clientName");
const emailInput = document.getElementById("clientEmail");
const companyInput = document.getElementById("clientCompany");
const notesInput = document.getElementById("clientNotes");
const clientIdInput = document.getElementById("clientId");
const tableBody = document.getElementById("clientsTableBody");
const submitBtn = document.getElementById("submitClientBtn");
const sortSelect = document.getElementById("sortClients");

// =========================
// INIT
// =========================
async function init() {
  const localData = getClients();

  if (localData.length === 0) {
    try {
      clients = await fetchRandomClients();
    } catch (error) {
      console.error(error);
      clients = [];
    }

    saveClients(clients);
  } else {
    clients = localData;
  }

  renderClients();
}

init();

// =========================
// RENDER CLIENTS
// =========================
function renderClients(data = clients) {
  tableBody.innerHTML = "";

  data.forEach((client) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.company || "-"}</td>
            <td>${client.notes || "-"}</td>
            <td>
    <button class="btn-icon edit" onclick="editClient(${client.id})">
        <i class="fa-solid fa-pen"></i>
    </button>

    <button class="btn-icon delete" onclick="deleteClient(${client.id})">
        <i class="fa-solid fa-trash"></i>
    </button>
    </td>

        `;

    tableBody.appendChild(row);
  });
}

// =========================
// ADD / UPDATE CLIENT
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name.length < 2) {
    alert("Name must contain at least 2 characters");
    return;
  }

  if (!validateEmail(email)) {
    alert("Invalid email format!");
    return;
  }

  const id = clientIdInput.value;

  if (id) {
    // UPDATE
    clients = clients.map((c) =>
      c.id == id
        ? {
            ...c,
            name,
            email,
            company: companyInput.value.trim(),
            notes: notesInput.value.trim(),
          }
        : c,
    );
  } else {
    // CREATE
    const newClient = {
      id: generateId(),
      name,
      email,
      company: companyInput.value.trim(),
      notes: notesInput.value.trim(),
    };

    clients.push(newClient);
  }

  saveClients(clients);
  resetForm();
  renderClients();
});

// =========================
// EDIT CLIENT
// =========================
window.editClient = function (id) {
  const client = clients.find((c) => c.id === id);

  if (!client) return;

  nameInput.value = client.name;
  emailInput.value = client.email;
  companyInput.value = client.company;
  notesInput.value = client.notes;
  clientIdInput.value = client.id;

  submitBtn.innerHTML = "Update Client";
};

// =========================
// DELETE CLIENT
// =========================
window.deleteClient = function (id) {
  if (!confirm("Are you sure?")) return;

  clients = clients.filter((c) => c.id !== id);

  saveClients(clients);
  renderClients();
};

// =========================
// SORT
// =========================
sortSelect.addEventListener("change", (e) => {
  const key = e.target.value;

  const sorted = [...clients].sort((a, b) =>
    String(a[key] ?? "").localeCompare(String(b[key] ?? "")),
  );

  renderClients(sorted);
});

// =========================
// RESET FORM
// =========================
function resetForm() {
  form.reset();
  clientIdInput.value = "";
  submitBtn.innerHTML = "Add Client";
}
