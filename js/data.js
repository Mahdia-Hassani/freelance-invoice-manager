const CLIENTS_KEY = "clients";
const INVOICES_KEY = "invoices";

// =========================
// GET DATA
// =========================
export function getClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function getInvoices() {
  try {
    return JSON.parse(localStorage.getItem(INVOICES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// =========================
// SAVE DATA
// =========================
export function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function saveInvoices(invoices) {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}
