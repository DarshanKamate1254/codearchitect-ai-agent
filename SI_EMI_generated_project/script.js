// Cache DOM elements for Simple Interest and EMI calculators
// Simple Interest elements
const siPrincipal = document.getElementById('si-principal');
const siRate = document.getElementById('si-rate');
const siTime = document.getElementById('si-time');
const siError = document.getElementById('si-error');
const siResult = document.getElementById('si-result');
const siReset = document.getElementById('si-reset');

// EMI elements
const emiPrincipal = document.getElementById('emi-principal');
const emiRate = document.getElementById('emi-rate');
const emiTenure = document.getElementById('emi-tenure');
const emiError = document.getElementById('emi-error');
const emiResult = document.getElementById('emi-result');
const emiReset = document.getElementById('emi-reset');

/**
 * Safely parse a value to a number. Returns 0 for NaN, empty string, null, undefined.
 * @param {*} value - The value to convert.
 * @returns {number}
 */
function parseNumber(value) {
  return Number(value) || 0;
}

/**
 * Display an error message and mark the related input with an error style.
 * The related input is assumed to be the immediate previous sibling of the error element.
 * @param {HTMLElement} errorEl - The element where the error message will be shown.
 * @param {string} message - The error message text.
 */
function showError(errorEl, message) {
  errorEl.textContent = message;
  const relatedInput = errorEl.previousElementSibling;
  if (relatedInput && relatedInput.tagName === 'INPUT') {
    relatedInput.classList.add('error');
  }
}

/**
 * Clear an error message and remove the error style from the related input.
 * @param {HTMLElement} errorEl - The element containing the error message.
 */
function clearError(errorEl) {
  errorEl.textContent = '';
  const relatedInput = errorEl.previousElementSibling;
  if (relatedInput && relatedInput.tagName === 'INPUT') {
    relatedInput.classList.remove('error');
  }
}

// Export helpers and cached elements for external access / testing
window.siElements = {
  principal: siPrincipal,
  rate: siRate,
  time: siTime,
  error: siError,
  result: siResult,
  reset: siReset,
};

window.emiElements = {
  principal: emiPrincipal,
  rate: emiRate,
  tenure: emiTenure,
  error: emiError,
  result: emiResult,
  reset: emiReset,
};

window.parseNumber = parseNumber;
window.showError = showError;
window.clearError = clearError;

/**
 * Calculate Simple Interest.
 * @param {number} principal - The principal amount.
 * @param {number} rate - The interest rate (percentage per annum).
 * @param {number} time - The time period (in years).
 * @returns {number} The calculated simple interest.
 */
function calculateSimpleInterest(principal, rate, time) {
  return (principal * rate * time) / 100;
}

/**
 * Calculate Equated Monthly Installment (EMI) details.
 * @param {number} principal - The loan amount.
 * @param {number} annualRate - Annual interest rate (percentage).
 * @param {number} months - Loan tenure in months.
 * @returns {{emi: number, totalPayment: number, totalInterest: number}} An object containing the monthly EMI, total payment over the tenure, and total interest payable.
 */
function calculateEMI(principal, annualRate, months) {
  const monthlyRate = annualRate / (12 * 100);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

// Export calculation functions for external use / testing
window.calculateSimpleInterest = calculateSimpleInterest;
window.calculateEMI = calculateEMI;

/**
 * Validate Simple Interest inputs.
 * Ensures principal, rate, and time are greater than zero.
 * Shows an error message in the si-error container if validation fails.
 * @returns {boolean} true if all inputs are valid, otherwise false.
 */
function validateSimpleInterestInputs() {
  clearError(siError);
  const principal = parseNumber(siElements.principal.value);
  const rate = parseNumber(siElements.rate.value);
  const time = parseNumber(siElements.time.value);

  if (principal <= 0) {
    showError(siError, 'Principal must be greater than 0');
    return false;
  }
  if (rate <= 0) {
    showError(siError, 'Rate must be greater than 0');
    return false;
  }
  if (time <= 0) {
    showError(siError, 'Time must be greater than 0');
    return false;
  }
  // All good – ensure any previous error styling is cleared.
  clearError(siError);
  return true;
}

/**
 * Validate EMI inputs.
 * Ensures loan amount, rate, and tenure are greater than zero.
 * Shows an error message in the emi-error container if validation fails.
 * @returns {boolean} true if all inputs are valid, otherwise false.
 */
function validateEMIInputs() {
  clearError(emiError);
  const principal = parseNumber(emiElements.principal.value);
  const rate = parseNumber(emiElements.rate.value);
  const tenure = parseNumber(emiElements.tenure.value);

  if (principal <= 0) {
    showError(emiError, 'Loan amount must be greater than 0');
    return false;
  }
  if (rate <= 0) {
    showError(emiError, 'Interest rate must be greater than 0');
    return false;
  }
  if (tenure <= 0) {
    showError(emiError, 'Tenure must be greater than 0');
    return false;
  }
  clearError(emiError);
  return true;
}

/**
 * Render Simple Interest calculation result.
 * @param {number} value - Calculated simple interest.
 */
function renderSimpleInterestResult(value) {
  siElements.result.textContent = `Simple Interest: $${value.toFixed(2)}`;
}

/**
 * Render EMI calculation results.
 * @param {{emi: number, totalPayment: number, totalInterest: number}} param0
 */
function renderEMIResult({ emi, totalPayment, totalInterest }) {
  emiElements.result.textContent = `EMI: $${emi.toFixed(2)} | Total Payment: $${totalPayment.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)}`;
}

/**
 * Handle input events for Simple Interest calculator.
 */
function handleSimpleInterestInput() {
  if (validateSimpleInterestInputs()) {
    const p = parseNumber(siElements.principal.value);
    const r = parseNumber(siElements.rate.value);
    const t = parseNumber(siElements.time.value);
    const interest = calculateSimpleInterest(p, r, t);
    renderSimpleInterestResult(interest);
  } else {
    siElements.result.textContent = '';
  }
}

/**
 * Handle input events for EMI calculator.
 */
function handleEMIInput() {
  if (validateEMIInputs()) {
    const p = parseNumber(emiElements.principal.value);
    const r = parseNumber(emiElements.rate.value);
    const months = parseNumber(emiElements.tenure.value);
    const result = calculateEMI(p, r, months);
    renderEMIResult(result);
  } else {
    emiElements.result.textContent = '';
  }
}

/**
 * Reset Simple Interest calculator UI.
 */
function resetSimpleInterest() {
  siElements.principal.value = '';
  siElements.rate.value = '';
  siElements.time.value = '';
  clearError(siElements.error);
  siElements.result.textContent = '';
}

/**
 * Reset EMI calculator UI.
 */
function resetEMI() {
  emiElements.principal.value = '';
  emiElements.rate.value = '';
  emiElements.tenure.value = '';
  clearError(emiElements.error);
  emiElements.result.textContent = '';
}

/**
 * Initialise event listeners after DOM is ready.
 */
function init() {
  // Simple Interest listeners
  siElements.principal.addEventListener('input', handleSimpleInterestInput);
  siElements.rate.addEventListener('input', handleSimpleInterestInput);
  siElements.time.addEventListener('input', handleSimpleInterestInput);
  siElements.reset.addEventListener('click', resetSimpleInterest);

  // EMI listeners
  emiElements.principal.addEventListener('input', handleEMIInput);
  emiElements.rate.addEventListener('input', handleEMIInput);
  emiElements.tenure.addEventListener('input', handleEMIInput);
  emiElements.reset.addEventListener('click', resetEMI);
}

document.addEventListener('DOMContentLoaded', init);

// Export validation functions for testing / external use
window.validateSimpleInterestInputs = validateSimpleInterestInputs;
window.validateEMIInputs = validateEMIInputs;

// Export render functions for testing if needed
window.renderSimpleInterestResult = renderSimpleInterestResult;
window.renderEMIResult = renderEMIResult;
