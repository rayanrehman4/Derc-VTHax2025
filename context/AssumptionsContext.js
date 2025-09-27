import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AssumptionsContext = createContext();

export const useAssumptions = () => {
  const context = useContext(AssumptionsContext);
  if (!context) {
    throw new Error('useAssumptions must be used within AssumptionsProvider');
  }
  return context;
};

const DEFAULT_ASSUMPTIONS = {
  downPct: 20,
  dti: 0.28,
  taxPct: 1.1,
  insuranceAnnual: 1200
};

export const AssumptionsProvider = ({ children }) => {
  const router = useRouter();
  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Load from URL params on mount
  useEffect(() => {
    if (router.isReady) {
      const urlAssumptions = { ...DEFAULT_ASSUMPTIONS };
      
      if (router.query.downPct) urlAssumptions.downPct = parseFloat(router.query.downPct);
      if (router.query.dti) urlAssumptions.dti = parseFloat(router.query.dti);
      if (router.query.taxPct) urlAssumptions.taxPct = parseFloat(router.query.taxPct);
      if (router.query.insuranceAnnual) urlAssumptions.insuranceAnnual = parseInt(router.query.insuranceAnnual);
      
      setAssumptions(urlAssumptions);
    }
  }, [router.isReady, router.query]);

  // Sync to URL when assumptions change
  const updateAssumptions = (newAssumptions) => {
    setIsLoading(true);
    setAssumptions(newAssumptions);
    
    // Update URL params
    const query = { ...router.query };
    Object.keys(newAssumptions).forEach(key => {
      if (newAssumptions[key] !== DEFAULT_ASSUMPTIONS[key]) {
        query[key] = newAssumptions[key].toString();
      } else {
        delete query[key];
      }
    });
    
    router.replace({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true }).finally(() => {
      setIsLoading(false);
    });
  };

  const resetAssumptions = () => {
    updateAssumptions(DEFAULT_ASSUMPTIONS);
  };

  // Calculate required income with current assumptions
  const calculateRequiredIncome = (medianPrice, mortgageRate = 7.12) => {
    const { downPct, dti, taxPct, insuranceAnnual } = assumptions;
    
    const loanAmount = medianPrice * (1 - downPct / 100);
    const monthlyRate = mortgageRate / 100 / 12;
    const numPayments = 30 * 12;
    
    // Monthly P&I
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Monthly taxes and insurance
    const monthlyTax = (medianPrice * taxPct / 100) / 12;
    const monthlyInsurance = insuranceAnnual / 12;
    
    // Total monthly payment (PITI)
    const monthlyPITI = monthlyPI + monthlyTax + monthlyInsurance;
    
    // Required annual income (monthly payment / DTI * 12)
    return (monthlyPITI / dti) * 12;
  };

  return (
    <AssumptionsContext.Provider value={{
      assumptions,
      updateAssumptions,
      resetAssumptions,
      calculateRequiredIncome,
      isLoading
    }}>
      {children}
    </AssumptionsContext.Provider>
  );
};