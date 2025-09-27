import { useState } from 'react';
import { useAssumptions } from '../context/AssumptionsContext';

const AssumptionsDrawer = ({ isOpen, onClose }) => {
  const { assumptions, updateAssumptions, resetAssumptions, isLoading } = useAssumptions();
  const [localAssumptions, setLocalAssumptions] = useState(assumptions);

  const handleApply = () => {
    updateAssumptions(localAssumptions);
  };

  const handleReset = () => {
    resetAssumptions();
    setLocalAssumptions({
      downPct: 20,
      dti: 0.28,
      taxPct: 1.1,
      insuranceAnnual: 1200
    });
  };

  const handleInputChange = (key, value) => {
    setLocalAssumptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative ml-auto bg-gray-900 border-l border-gray-700 shadow-2xl w-full max-w-md h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">Assumptions</h2>
            <p className="text-gray-400 text-sm mt-1">Adjust mortgage parameters</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Down Payment: {localAssumptions.downPct}%
            </label>
            <input
              type="range"
              min="10"
              max="20"
              step="1"
              value={localAssumptions.downPct}
              onChange={(e) => handleInputChange('downPct', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Debt-to-Income Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Debt-to-Income Ratio: {(localAssumptions.dti * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.28"
              max="0.31"
              step="0.01"
              value={localAssumptions.dti}
              onChange={(e) => handleInputChange('dti', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>28%</span>
              <span>31%</span>
            </div>
          </div>

          {/* Property Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Property Tax: {localAssumptions.taxPct.toFixed(1)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={localAssumptions.taxPct}
              onChange={(e) => handleInputChange('taxPct', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5%</span>
              <span>2.0%</span>
            </div>
          </div>

          {/* Insurance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Insurance: ${localAssumptions.insuranceAnnual.toLocaleString()}/year
            </label>
            <input
              type="range"
              min="600"
              max="2400"
              step="100"
              value={localAssumptions.insuranceAnnual}
              onChange={(e) => handleInputChange('insuranceAnnual', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$600</span>
              <span>$2,400</span>
            </div>
          </div>

          {/* Impact Preview */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Impact Preview</h3>
            <div className="text-sm text-gray-300">
              <div className="flex justify-between mb-2">
                <span>Example $500K home:</span>
                <span className="font-medium">
                  ${Math.round(
                    (500000 * (1 - localAssumptions.downPct / 100) * 
                     (0.0712 / 12 * Math.pow(1 + 0.0712 / 12, 360)) / 
                     (Math.pow(1 + 0.0712 / 12, 360) - 1) +
                     (500000 * localAssumptions.taxPct / 100) / 12 +
                     localAssumptions.insuranceAnnual / 12) / localAssumptions.dti * 12
                  ).toLocaleString()} required income
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 space-y-3">
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Applying...' : 'Apply Changes'}
          </button>
          
          <button
            onClick={handleReset}
            className="btn-secondary w-full"
          >
            Reset to Defaults
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Changes will update all dashboard metrics and persist in URL
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssumptionsDrawer;