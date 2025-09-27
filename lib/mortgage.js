export const calculateMonthlyPI = (principal, ratePct, years = 30) => {
  const monthlyRate = ratePct / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export const calculateRequiredIncome = ({ 
  price, 
  ratePct = 7.12, 
  downPct = 20, 
  dti = 0.28, 
  taxPct = 1.1, 
  insuranceAnnual = 1200 
}) => {
  const loanAmount = price * (1 - downPct / 100);
  const monthlyPI = calculateMonthlyPI(loanAmount, ratePct);
  const monthlyTax = (price * taxPct / 100) / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyPITI = monthlyPI + monthlyTax + monthlyInsurance;
  
  return (monthlyPITI / dti) * 12;
};

export const calculateAffordabilityScore = (requiredIncome, medianIncome) => {
  return Math.min(medianIncome / requiredIncome, 1.0);
};