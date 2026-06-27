/* =====================================================================
   HUNGERING BELLS — site interactions
   - Sticky header state (transparent over hero -> solid on scroll)
   - Mobile menu toggle
   - Active nav link on scroll (scroll-spy)
   - Scroll reveal animations (IntersectionObserver)
   - Enquiry form: validation + modular submit handler
   ===================================================================== */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  /* ----------------------------------------------------------------
     1. Sticky header — toggle "at-top" while over the dark hero
  ---------------------------------------------------------------- */
  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.remove("at-top");
    } else {
      header.classList.add("at-top");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ----------------------------------------------------------------
     2. Mobile menu
  ---------------------------------------------------------------- */
  function setMenu(open) {
    navToggle.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
  }
  navToggle.addEventListener("click", function () {
    setMenu(!mobileMenu.classList.contains("open"));
  });
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  /* ----------------------------------------------------------------
     3. Scroll-spy — highlight the active nav link
  ---------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ----------------------------------------------------------------
     4. Scroll reveal
  ---------------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // small stagger for grouped cards
            const delay = entry.target.dataset.delay || Math.min(i * 60, 180);
            setTimeout(function () { entry.target.classList.add("in"); }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------------
     5. Footer year
  ---------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     6. Enquiry form
     -----------------------------------------------------------------
     This is frontend-only for now. The submit handler collects all
     fields into a structured object and routes it through a single
     `deliverEnquiry()` function. To connect a real backend later,
     pick ONE of the integration stubs inside deliverEnquiry() and
     fill it in — the rest of the form code does not need to change.
  ---------------------------------------------------------------- */
  const form = document.getElementById("enquiryForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearStatus();

      // Validate required fields
      const required = form.querySelectorAll("[required]");
      let firstInvalid = null;
      required.forEach(function (field) {
        const ok = field.value.trim() !== "" && field.checkValidity();
        field.classList.toggle("invalid", !ok);
        if (!ok && !firstInvalid) firstInvalid = field;
      });

      const emailField = form.querySelector("#email");
      if (emailField && emailField.value && !emailField.checkValidity()) {
        emailField.classList.add("invalid");
        if (!firstInvalid) firstInvalid = emailField;
      }

      if (firstInvalid) {
        showStatus("Please fill in the highlighted fields correctly.", "error");
        firstInvalid.focus();
        return;
      }

      // Collect structured payload
      const payload = collectPayload(form);

      // Submit
      setLoading(true);
      try {
        await deliverEnquiry(payload);
        form.reset();
        showStatus(
          "Thank you! Your enquiry has been received. The Hungering Bells team will get back to you within 1–2 business days.",
          "success"
        );
      } catch (err) {
        console.error("Enquiry submit failed:", err);
        showStatus(
          "Something went wrong while sending. Please try again, or reach out on Instagram @hungering_bells.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    });

    // Clear invalid state as the user fixes a field
    form.addEventListener("input", function (e) {
      if (e.target.classList.contains("invalid")) {
        e.target.classList.remove("invalid");
      }
    });
  }

  function collectPayload(formEl) {
    const data = new FormData(formEl);
    const obj = {};
    data.forEach(function (value, key) { obj[key] = String(value).trim(); });
    return {
      ...obj,
      source: "hungering-bells-website",
      submittedAt: new Date().toISOString(),
    };
  }

  /* ----------------------------------------------------------------
     deliverEnquiry — single integration point.
     Currently simulates a successful send. Replace the body with
     ONE of the options below when you're ready.
  ---------------------------------------------------------------- */
  async function deliverEnquiry(payload) {
    // --- CURRENT: frontend-only demo (logs to console) ---
    console.log("[Hungering Bells] Enquiry payload:", payload);
    await new Promise(function (r) { setTimeout(r, 900); });
    return true;

    /* ----------------------------------------------------------------
       OPTION A — Send to your own backend / API endpoint
    -------------------------------------------------------------------
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    return res.json();
    ---------------------------------------------------------------- */

    /* ----------------------------------------------------------------
       OPTION B — Google Sheets (via a Google Apps Script Web App URL)
    -------------------------------------------------------------------
    const SHEETS_URL = "https://script.google.com/macros/s/XXXX/exec";
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Sheets request failed");
    return true;
    ---------------------------------------------------------------- */

    /* ----------------------------------------------------------------
       OPTION C — Email via a form service (Formspree / Getform / etc.)
    -------------------------------------------------------------------
    const res = await fetch("https://formspree.io/f/XXXX", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Email service failed");
    return true;
    ---------------------------------------------------------------- */

    /* ----------------------------------------------------------------
       OPTION D — Open a pre-filled WhatsApp message
    -------------------------------------------------------------------
    const PHONE = "9100000000"; // include country code, no + or spaces
    const text =
      `New promotion enquiry%0A` +
      `Business: ${payload.businessName}%0A` +
      `Contact: ${payload.contactName} (${payload.phone})%0A` +
      `Type: ${payload.businessType} | ${payload.promotionType}%0A` +
      `City: ${payload.city}%0A` +
      `Budget: ${payload.budget}%0A` +
      `Message: ${payload.message}`;
    window.open(`https://wa.me/${PHONE}?text=${text}`, "_blank");
    return true;
    ---------------------------------------------------------------- */
  }

  /* ----------------------------------------------------------------
     Status + loading helpers
  ---------------------------------------------------------------- */
  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status show " + (type || "");
  }
  function clearStatus() {
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.className = "form-status";
  }
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Sending…" : "Send Enquiry";
    submitBtn.style.opacity = loading ? "0.75" : "";
  }
})();
