import Layout from '../components/Layout';
import { useState } from 'react';

const assumptions = [
  {
    category: 'Income Calculation',
    items: [
      'Housing costs should not exceed 28% of gross monthly income (28% rule)',
      'Property taxes estimated at 1.2% of home value annually',
      'Homeowners insurance estimated at 0.5% of home value annually',
      'PMI required for down payments less than 20%'
    ]
  },
  {
    category: 'Mortgage Terms',
    items: [
      '30-year fixed-rate mortgage',
      '20% down payment (adjustable in Pro version)',
      'Current national average mortgage rates updated weekly',
      'No additional fees or points included in base calculation'
    ]
  },
  {
    category: 'Data Sources',
    items: [
      'MLS data from certified real estate boards',
      'Federal Housing Finance Agency (FHFA) price indices',
      'Bureau of Labor Statistics for income data',
      'Mortgage rates from Freddie Mac Primary Mortgage Market Survey'
    ]
  },
  {
    category: 'Market Coverage',
    items: [
      '200+ metropolitan statistical areas (MSAs)',
      'Data updated weekly for major markets',
      'Historical data available back to 2010',
      'State-level aggregations for broader trends'
    ]
  }
];

const glossary = [
  {
    term: 'Affordability Score',
    definition: 'Ratio of median household income to required income. Score of 1.0 means median income exactly meets housing requirements.'
  },
  {
    term: 'Required Income',
    definition: 'Minimum gross annual income needed to qualify for a mortgage on a median-priced home, assuming 28% debt-to-income ratio.'
  },
  {
    term: 'Median Home Price',
    definition: 'Middle value of all home sales in a given market during the measurement period.'
  },
  {
    term: 'Price-to-Income Ratio',
    definition: 'Median home price divided by median household income. Higher ratios indicate less affordable markets.'
  },
  {
    term: 'Housing Cost Burden',
    definition: 'Percentage of income spent on housing. Ratios above 30% are considered cost-burdened.'
  },
  {
    term: 'Metropolitan Statistical Area (MSA)',
    definition: 'Geographic area consisting of a city and surrounding communities linked by social and economic factors.'
  },
  {
    term: 'Debt-to-Income Ratio (DTI)',
    definition: 'Percentage of gross monthly income that goes toward paying debts. 28% is standard for housing costs.'
  },
  {
    term: 'Private Mortgage Insurance (PMI)',
    definition: 'Insurance required when down payment is less than 20% of home value.'
  }
];

const calculationSteps = [
  {
    step: 1,
    title: 'Gather Market Data',
    description: 'Collect median home prices, mortgage rates, and local tax rates for each market.'
  },
  {
    step: 2,
    title: 'Calculate Monthly Payment',
    description: 'Determine principal, interest, taxes, and insurance (PITI) for median-priced home.'
  },
  {
    step: 3,
    title: 'Apply 28% Rule',
    description: 'Divide monthly housing payment by 0.28 to find required gross monthly income.'
  },
  {
    step: 4,
    title: 'Annualize Income',
    description: 'Multiply monthly requirement by 12 to get annual income requirement.'
  },
  {
    step: 5,
    title: 'Calculate Affordability',
    description: 'Compare required income to median household income to generate affordability score.'
  }
];

export default function Methodology() {
  const [expandedAssumption, setExpandedAssumption] = useState(null);

  return (
    <Layout 
      title="Methodology - Affordly" 
      description="Learn how Affordly calculates housing affordability metrics, our data sources, and methodology"
      canonical="https://affordly.com/methodology"
    >
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our <span className="gradient-text">Methodology</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transparent, data-driven approach to calculating housing affordability across America.
          </p>
        </div>
      </section>

      {/* Calculation Overview */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How We Calculate Required Income</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our calculations follow industry-standard practices used by lenders and housing economists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {calculationSteps.map((step, index) => (
              <div 
                key={step.step}
                className="text-center"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                
                {index < calculationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-8">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Formula */}
          <div className="mt-16">
            <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-center">
              <h3 className="text-xl font-bold text-white mb-6">Core Formula</h3>
              <div className="bg-gray-950/50 rounded-lg p-6 font-mono">
                <div className="text-green-400 text-lg mb-4">
                  Required Annual Income = (Monthly PITI ÷ 0.28) × 12
                </div>
                <div className="text-gray-400 text-sm">
                  Where PITI = Principal + Interest + Taxes + Insurance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Key Assumptions</h2>
            <p className="text-xl text-gray-400">
              Standard industry assumptions used in our calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assumptions.map((category, index) => (
              <div 
                key={category.category}
                className="card"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.6s ease-out forwards'
                }}
              >
                <button
                  onClick={() => setExpandedAssumption(
                    expandedAssumption === index ? null : index
                  )}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedAssumption === index ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedAssumption === index && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Limitations & Considerations</h2>
          </div>

          <div className="card bg-yellow-500/10 border-yellow-500/30">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Important Notes</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Calculations are estimates based on median values and standard assumptions</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Individual circumstances may vary significantly from median calculations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Local variations in taxes, HOA fees, and other costs are not fully captured</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Not a substitute for professional financial or real estate advice</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}