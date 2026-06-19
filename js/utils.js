// =========================
// ID GENERATOR
// =========================
export function generateId() {
  return Date.now();
}

// =========================
// EMAIL VALIDATION
// =========================
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================
// FORMAT CURRENCY
// =========================
export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// =========================
// RANDOM USER API (Clients)
// =========================
export async function fetchRandomClients() {
  try {
    const res = await fetch("https://randomuser.me/api/?results=5&nat=us");
    const data = await res.json();

    return data.results.map((user) => ({
      id: generateId(),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      company: "Freelance Inc.",
      notes: "",
    }));
  } catch (err) {
    console.error("Random User Error:", err);
    return [];
  }
}

// =========================
// ZEN QUOTES API
// =========================
export async function fetchQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/quotes");
    const data = await res.json();

    const quote = data[0];

    return {
      text: quote?.q || "Stay focused and keep learning.",
      author: quote?.a && quote.a !== "Unknown" ? quote.a : "Inspiration",
    };
  } catch (err) {
    return {
      text: "Stay focused and keep learning.",
      author: "Inspiration",
    };
  }
}
