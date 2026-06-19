import { getClients, getInvoices } from "./data.js";
import { fetchQuote } from "./utils.js";

// =========================
// SIDEBAR TOGGLE
// =========================
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  if (!sidebar || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

document.addEventListener("DOMContentLoaded", initSidebar);

// =========================
// DASHBOARD STATS
// =========================
function loadStats() {
  const clients = getClients();
  const invoices = getInvoices();

  // Clients
  document.getElementById("totalClients").textContent = clients.length;

  // Invoices
  document.getElementById("totalInvoices").textContent = invoices.length;

  // Revenue (reduce)
  const revenue = invoices.reduce((sum, inv) => {
    return sum + Number(inv.amount || 0);
  }, 0);

  document.getElementById("totalRevenue").textContent = `$${revenue}`;

  // Paid / Unpaid
  const paid = invoices.filter((inv) => inv.paid).length;
  const unpaid = invoices.length - paid;

  document.getElementById("paidInvoices").textContent = paid;
  document.getElementById("paidCount").textContent = paid;
  document.getElementById("unpaidCount").textContent = unpaid;

  // Completion Rate
  const rate = invoices.length
    ? ((paid / invoices.length) * 100).toFixed(0)
    : 0;

  document.getElementById("completionRate").textContent = `${rate}%`;

  // Recent Invoices (last 5)
  const recent = [...invoices].slice(-5).reverse();

  const tbody = document.getElementById("recentInvoices");

  if (tbody) {
    tbody.innerHTML = "";

    recent.forEach((inv) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${inv.clientId}</td>
                <td>${inv.title}</td>
                <td>$${inv.amount}</td>
                <td>
                    <span class="badge ${inv.paid ? "paid" : "unpaid"}">
                        ${inv.paid ? "🟢 Paid" : "🔴 Unpaid"}
                    </span>
                </td>
            `;

      tbody.appendChild(row);
    });
  }
}

// =========================
// MOTIVATIONAL QUOTE (API)
// =========================
async function loadQuote() {
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");

  if (!quoteText || !quoteAuthor) return;

  try {
    const data = await fetchQuote();

    quoteText.textContent = `"${data.text}"`;
    quoteAuthor.textContent = `— ${data.author}`;
  } catch (err) {
    quoteText.textContent = "Stay consistent and keep building.";
    quoteAuthor.textContent = "Unknown";
  }
}

// =========================
// INIT DASHBOARD
// =========================
function init() {
  loadStats();
  loadQuote();
}

init();
