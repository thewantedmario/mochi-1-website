/* =========================
   NAVIGATION (MOBILE MENU)
========================= */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  if (nav) nav.classList.toggle("active");
}

/* =========================
   AI PLAYGROUND (FRONTEND)
========================= */
function generate() {
  const promptEl = document.getElementById("prompt");
  const outputEl = document.getElementById("output");

  // Safety check (important for pages without playground)
  if (!promptEl || !outputEl) return;

  const prompt = promptEl.value.trim();

  if (prompt === "") {
    outputEl.textContent = "Please enter a prompt to generate a video.";
    return;
  }

  // Placeholder UI (backend-ready)
  outputEl.textContent =
    "⏳ Generating video...\n\n" +
    `"${prompt}"\n\n` +
    "(Video preview will appear here)";
}

/* =========================
   PROMPT COPY FUNCTION
========================= */
function copyPrompt(id, button) {
  const promptEl = document.getElementById(id);
  if (!promptEl) return;

  const text = promptEl.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = "Copied ✓";
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copied");
    }, 1500);
  });
}

/* =========================
   FAQ ACCORDION
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      if (!item) return;

      const openItem = document.querySelector(".faq-item.active");

      // Close previously open FAQ
      if (openItem && openItem !== item) {
        openItem.classList.remove("active");
      }

      item.classList.toggle("active");
    });
  });

  /* =========================
     FOOTER YEAR (AUTO)
  ========================= */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
