// js/main.js
// This script wires up all calculator pages and the home navigation.
// It runs automatically when included in the HTML.

(function () {
  // ---------------------------------------------------------------------------
  // Helper utilities
  // ---------------------------------------------------------------------------

  /**
   * Shows an error for a given input element.
   * Adds the class `error` to the input and displays a message in a sibling
   * element with the class `error-message`. If the message element does not exist
   * it will be created.
   * @param {HTMLInputElement|HTMLSelectElement} inputElem
   * @param {string} message
   */
  function showError(inputElem, message) {
    inputElem.classList.add("error");
    let msgElem = inputElem.parentElement.querySelector(".error-message");
    if (!msgElem) {
      msgElem = document.createElement("div");
      msgElem.className = "error-message";
      // Insert after the input element
      inputElem.parentElement.appendChild(msgElem);
    }
    msgElem.textContent = message;
  }

  /**
   * Clears any error state from the input element.
   * @param {HTMLInputElement|HTMLSelectElement} inputElem
   */
  function clearError(inputElem) {
    inputElem.classList.remove("error");
    const msgElem = inputElem.parentElement.querySelector(".error-message");
    if (msgElem) {
      msgElem.remove();
    }
  }

  /**
   * Injects HTML into a result container element.
   * If the container does not exist, it will be created after the form.
   * @param {HTMLElement} containerElem
   * @param {string} html
   */
  function displayResult(containerElem, html) {
    containerElem.innerHTML = html;
    containerElem.style.display = "block";
  }

  /**
   * Formats a number as Indian Rupee currency (₹12,345.67).
   * @param {number} value
   * @returns {string}
   */
  function formatRupee(value) {
    // Using toLocaleString ensures proper comma placement for Indian format.
    return value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
  }

  // ---------------------------------------------------------------------------
  // Page detection
  // ---------------------------------------------------------------------------
  const page = document.body.dataset.page; // e.g., "home", "simple", ...

  // Store references to listeners for optional cleanup on unload.
  const listeners = [];

  // ---------------------------------------------------------------------------
  // Home page navigation cards
  // ---------------------------------------------------------------------------
  if (page === "home") {
    // Expect navigation cards to have a data-target attribute pointing to the
    // destination HTML file (e.g., "simple.html"). If not present we fallback to
    // the first anchor (<a>) inside the card.
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const clickHandler = function (e) {
        // Prevent default if the click originated from a link inside the card.
        e.preventDefault();
        const target = card.dataset.target;
        if (target) {
          window.location.href = target;
        } else {
          const link = card.querySelector("a[href]");
          if (link) {
            window.location.href = link.getAttribute("href");
          }
        }
      };
      card.addEventListener("click", clickHandler);
      listeners.push({ elem: card, type: "click", handler: clickHandler });
    });
  }

  // ---------------------------------------------------------------------------
  // Calculator pages – generic form handling
  // ---------------------------------------------------------------------------
  const calculatorPages = ["simple", "compound", "emi", "sip"];

  if (calculatorPages.includes(page)) {
    const form = document.querySelector("form");
    if (!form) {
      console.warn("No form found on calculator page.");
    } else {
      // Result container – try to find an element with class .result-display.
      let resultContainer = document.querySelector(".result-display");
      if (!resultContainer) {
        resultContainer = document.createElement("div");
        resultContainer.className = "result-display";
        // Insert after the form
        form.parentNode.insertBefore(resultContainer, form.nextSibling);
      }

      const submitHandler = function (e) {
        e.preventDefault();
        // Clear previous errors and result.
        const inputs = form.querySelectorAll("input, select");
        inputs.forEach(clearError);
        resultContainer.innerHTML = "";
        let hasError = false;
        const values = {};

        // Helper to fetch, trim and validate a field.
        function getValue(name, allowZero = false) {
          const field = form.querySelector(`[name="${name}"]`);
          if (!field) {
            console.error(`Field with name ${name} not found`);
            return null;
          }
          const raw = field.value.trim();
          if (raw === "") {
            showError(field, "This field is required.");
            hasError = true;
            return null;
          }
          const num = Number(raw);
          if (isNaN(num)) {
            showError(field, "Please enter a valid number.");
            hasError = true;
            return null;
          }
          if (!allowZero && num <= 0) {
            showError(field, "Value must be greater than 0.");
            hasError = true;
            return null;
          }
          if (allowZero && num < 0) {
            showError(field, "Value cannot be negative.");
            hasError = true;
            return null;
          }
          return num;
        }

        // Page‑specific extraction & calculation
        let resultHTML = "";
        try {
          if (page === "simple") {
            const P = getValue("principal");
            const R = getValue("rate");
            const T = getValue("time");
            if (!hasError) {
              const interest = window.Calculators.calculateSimpleInterest(P, R, T);
              resultHTML = `<p>Simple Interest: ${formatRupee(interest)}</p>`;
            }
          } else if (page === "compound") {
            const P = getValue("principal");
            const R = getValue("rate");
            const T = getValue("time");
            const N = getValue("frequency", true); // frequency must be >0, not allow zero
            if (!hasError) {
              const ci = window.Calculators.calculateCompoundInterest(P, R, T, N);
              resultHTML = `<p>Compound Interest: ${formatRupee(ci)}</p>`;
            }
          } else if (page === "emi") {
            const P = getValue("principal");
            const R = getValue("annualRate");
            const months = getValue("tenureMonths", false);
            if (!hasError) {
              const emi = window.Calculators.calculateEMI(P, R, months);
              const total = window.Calculators.calculateTotalPaymentEMI(emi, months);
              const interest = window.Calculators.calculateTotalInterestEMI(total, P);
              resultHTML = `
                <p>EMI: ${formatRupee(emi)}</p>
                <p>Total Payment: ${formatRupee(total)}</p>
                <p>Total Interest: ${formatRupee(interest)}</p>
              `;
            }
          } else if (page === "sip") {
            const P = getValue("monthlyInvestment");
            const R = getValue("annualRate");
            const Y = getValue("years", false);
            if (!hasError) {
              const fv = window.Calculators.calculateSIPFutureValue(P, R, Y);
              const invested = window.Calculators.calculateTotalInvestedSIP(P, Y);
              const gain = fv - invested;
              resultHTML = `
                <p>Future Value: ${formatRupee(fv)}</p>
                <p>Total Invested: ${formatRupee(invested)}</p>
                <p>Estimated Gain: ${formatRupee(gain)}</p>
              `;
            }
          }
        } catch (err) {
          // Unexpected error from calculator functions – show generic message.
          console.error(err);
          resultHTML = `<p class="error-message">An error occurred while calculating. Please check your inputs.</p>`;
        }

        if (!hasError && resultHTML) {
          displayResult(resultContainer, resultHTML);
        }
      };

      form.addEventListener("submit", submitHandler);
      listeners.push({ elem: form, type: "submit", handler: submitHandler });
    }
  }

  // ---------------------------------------------------------------------------
  // Optional cleanup on page unload to avoid memory leaks.
  // ---------------------------------------------------------------------------
  window.addEventListener("beforeunload", function () {
    listeners.forEach(({ elem, type, handler }) => {
      elem.removeEventListener(type, handler);
    });
  });
})();
