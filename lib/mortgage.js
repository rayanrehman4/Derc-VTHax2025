/**
 * Mortgage calculation utilities
 */

/**
 * Calculate monthly principal and interest payment
 */
export function monthlyPI(principal, annualRate, termYears = 30) {
  if (annualRate === 0) return principal / (termYears * 12);
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return monthlyPayment;
}

/**
 * Calculate required annual income based on home price and assumptions
 */
export function requiredIncome({
  price,
  ratePct,
  downPct = 20,
  dti = 0.30, // 30% debt-to-income ratio
  taxPct = 1.1, // 1.1% property tax
  insuranceAnnual = 1200
}) {
  const downPayment = price * (downPct / 100);
  const loanAmount = price - downPayment;
  
  // Monthly principal and interest
  const monthlyPI = monthlyPI(loanAmount, ratePct);
  
  // Monthly property tax
  const monthlyTax = (price * (taxPct / 100)) / 12;
  
  // Monthly insurance
  const monthlyInsurance = insuranceAnnual / 12;
  
  // Total monthly housing payment (PITI)
  const monthlyPITI = monthlyPI + monthlyTax + monthlyInsurance;
  
  // Required monthly gross income (housing should be <= DTI% of income)
  const requiredMonthlyIncome = monthlyPITI / dti;
  
  // Annual income
  return requiredMonthlyIncome * 12;
}

/**
 * Generate mortgage rate path from current rate to target rate over time
 */
export function generateRatePath(currentRate, targetRate, months = 12) {
  const ratePath = [];
  const rateChange = (targetRate - currentRate) / months;
  
  for (let i = 0; i <= months; i++) {
    ratePath.push(currentRate + (rateChange * i));
  }
  
  return ratePath;
}

/**
 * Calculate affordability score (median income / required income)
 */
export function affordabilityScore(medianIncome, requiredIncome) {
  if (requiredIncome === 0) return 1;
  return Math.min(medianIncome / requiredIncome, 2); // Cap at 2x for display
}