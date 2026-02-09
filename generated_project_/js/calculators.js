// Financial Calculators
// This script defines reusable financial calculation functions and exposes them
// on the global `window.Calculators` object for use throughout the application.
// It performs input validation and throws descriptive errors for invalid inputs.

(function () {
  // Ensure the global namespace exists
  if (!window.Calculators) {
    window.Calculators = {};
  }

  /**
   * Validate that a value is a finite number and optionally non‑negative.
   * @param {string} name - Parameter name for error messages.
   * @param {*} value - The value to validate.
   * @param {boolean} [allowZero=true] - Whether zero is considered valid.
   */
  function validateNumber(name, value, allowZero = true) {
    if (typeof value !== "number" || !isFinite(value)) {
      throw new Error(`${name} must be a finite number.`);
    }
    if (!allowZero && value <= 0) {
      throw new Error(`${name} must be greater than 0.`);
    }
    if (allowZero && value < 0) {
      throw new Error(`${name} cannot be negative.`);
    }
  }

  /**
   * Simple Interest = P * R/100 * T
   */
  function calculateSimpleInterest(principal, rate, time) {
    validateNumber("principal", principal);
    validateNumber("rate", rate);
    validateNumber("time", time);
    return principal * (rate / 100) * time;
  }

  /**
   * Compound Interest = P * ((1 + (R/100)/n)^(n*t)) - P
   */
  function calculateCompoundInterest(principal, rate, time, frequency) {
    validateNumber("principal", principal);
    validateNumber("rate", rate);
    validateNumber("time", time);
    validateNumber("frequency", frequency, false); // frequency must be > 0
    const base = 1 + (rate / 100) / frequency;
    const exponent = frequency * time;
    return principal * Math.pow(base, exponent) - principal;
  }

  /**
   * EMI calculation using the standard formula.
   */
  function calculateEMI(principal, annualRate, tenureMonths) {
    validateNumber("principal", principal);
    validateNumber("annualRate", annualRate);
    validateNumber("tenureMonths", tenureMonths, false);
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) {
      // If interest rate is 0, EMI is simply principal divided by months.
      return principal / tenureMonths;
    }
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }

  /**
   * Total payment over the loan tenure based on EMI.
   */
  function calculateTotalPaymentEMI(emi, tenureMonths) {
    validateNumber("emi", emi);
    validateNumber("tenureMonths", tenureMonths, false);
    return emi * tenureMonths;
  }

  /**
   * Total interest paid over the loan tenure.
   */
  function calculateTotalInterestEMI(totalPayment, principal) {
    validateNumber("totalPayment", totalPayment);
    validateNumber("principal", principal);
    return totalPayment - principal;
  }

  /**
   * Future value of a Systematic Investment Plan (SIP).
   * FV = P * [((1 + r)^n - 1) / r] * (1 + r)
   */
  function calculateSIPFutureValue(monthlyInvestment, annualRate, years) {
    validateNumber("monthlyInvestment", monthlyInvestment);
    validateNumber("annualRate", annualRate);
    validateNumber("years", years, false);
    const r = annualRate / 12 / 100; // monthly rate
    const n = years * 12;
    if (r === 0) {
      // No interest case – future value is just total invested.
      return monthlyInvestment * n;
    }
    const factor = Math.pow(1 + r, n);
    return monthlyInvestment * ((factor - 1) / r) * (1 + r);
  }

  /**
   * Total amount invested in a SIP (principal only).
   */
  function calculateTotalInvestedSIP(monthlyInvestment, years) {
    validateNumber("monthlyInvestment", monthlyInvestment);
    validateNumber("years", years, false);
    return monthlyInvestment * years * 12;
  }

  // Export functions to the global namespace
  Object.assign(window.Calculators, {
    calculateSimpleInterest,
    calculateCompoundInterest,
    calculateEMI,
    calculateTotalPaymentEMI,
    calculateTotalInterestEMI,
    calculateSIPFutureValue,
    calculateTotalInvestedSIP,
  });
})();
