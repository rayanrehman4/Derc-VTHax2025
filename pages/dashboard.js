import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { AssumptionsProvider } from '../context/AssumptionsContext';
import TickerCard from '../components/TickerCard';
import LineChart from '../components/LineChart';
import Leaderboard from '../components/Leaderboard';
import MacroIndicators from '../components/MacroIndicators';
import Watchlist from '../components/Watchlist';
import SearchBar from '../components/SearchBar';
import CityMultiSelect from '../components/CityMultiSelect';
import TimeRangeTabs from '../components/TimeRangeTabs';
import CountyModal from '../components/CountyModal';
import AssumptionsDrawer from '../components/AssumptionsDrawer';

// Dynamic import for Heatmap to disable SSR
const Heatmap = dynamic(
  () => import('../components/Heatmap'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4 h-96 flex items-center justify-center">
        <div className="loading-shimmer w-full h-full rounded" />
      </div>
    )
  }
);

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [stateData, setStateData] = useState({});
  const [macroData, setMacroData] = useState({});
  const [selectedCities, setSelectedCities] = useState([]);
  const [timeRange, setTimeRange] = useState('5Y');
  const [leaderboardSort, setLeaderboardSort] = useState('affordability');
  const [isLoading, setIsLoading] = useState(true);
  const [countyModalOpen, setCountyModalOpen] = useState(false);
  const [selectedCityForModal, setSelectedCityForModal] = useState(null);
  const [assumptionsDrawerOpen, setAssumptionsDrawerOpen] = useState(false);

  useEffect(() => {
    // Load data
    const loadData = async () => {
      try {
        const [housingRes, stateRes, macroRes] = await Promise.all([
          fetch('/data/housing.json'),
          fetch('/data/stateAffordability.json'),
          fetch('/data/macro.json')
        ]);

        const housingData = await housingRes.json();
        const stateAffordability = await stateRes.json();
        const macroIndicators = await macroRes.json();

        setCities(housingData.cities);
        setStateData(stateAffordability);
        setMacroData(macroIndicators);
        
        // Pre-select top 3 most affordable cities for demo
        const sortedCities = [...housingData.cities].sort((a, b) => b.affordability_score - a.affordability_score);
        setSelectedCities(sortedCities.slice(0, 3));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCitySearch = (city) => {
    if (!selectedCities.find(c => c.id === city.id) && selectedCities.length < 6) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleStateClick = (stateCode, stateData) => {
    console.log('State clicked:', stateCode, stateData);
  };

  const handleCountyClick = (county) => {
    console.log('County clicked:', county);
    // Mock: add county's primary city to comparison
    // In real implementation, would map county to cities
  };

  const handleCityCardClick = (city) => {
    setSelectedCityForModal(city);
    setCountyModalOpen(true);
  };

  const handleAddCountyToCompare = (county) => {
    console.log('Adding county to compare:', county);
    // Mock implementation - in real app would map county to city
    setCountyModalOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard - Affordly" description="Interactive housing affordability dashboard">
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="loading-shimmer h-12 w-64 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="loading-shimmer h-96 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="loading-shimmer h-48 rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="loading-shimmer h-96 rounded" />
                <div className="loading-shimmer h-64 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <AssumptionsProvider>
      <Layout 
        title="Dashboard - Affordly" 
        description="Interactive housing affordability dashboard with real-time data, trends, and market insights"
        canonical="https://affordly.com/dashboard"
      >
        <div className="min-h-screen bg-gray-950 pt-8">
          <div className="max-w-7xl mx-auto container-padding">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Housing Affordability Dashboard</h1>
                <p className="text-gray-400">Track income requirements to buy homes across America</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button
                  onClick={() => setAssumptionsDrawerOpen(true)}
                  className="btn-secondary text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Assumptions
                </button>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="max-w-2xl">
                <SearchBar 
                  cities={cities} 
                  onCitySelect={handleCitySearch}
                  placeholder="Search and add cities to compare..."
                />
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content - Left Side */}
              <div className="xl:col-span-3 space-y-6">
                {/* Chart Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CityMultiSelect
                    cities={cities}
                    selectedCities={selectedCities}
                    onSelectionChange={setSelectedCities}
                    maxSelection={6}
                  />
                  <TimeRangeTabs
                    activeRange={timeRange}
                    onRangeChange={setTimeRange}
                  />
                </div>

                {/* Line Chart */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Required Income Trends</h2>
                    <div className="text-sm text-gray-400">
                      {selectedCities.length} cities selected
                    </div>
                  </div>
                  <LineChart cities={selectedCities} timeRange={timeRange} />
                </div>

                {/* Ticker Cards Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">City Overview</h2>
                    <div className="text-sm text-gray-400">
                      Click cards to view best counties
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {cities.slice(0, 6).map((city) => (
                      <TickerCard
                        key={city.id}
                        city={city}
                        onCardClick={handleCityCardClick}
                        onClick={(city) => {
                          const isSelected = selectedCities.find(c => c.id === city.id);
                          if (isSelected) {
                            setSelectedCities(selectedCities.filter(c => c.id !== city.id));
                          } else if (selectedCities.length < 6) {
                            setSelectedCities([...selectedCities, city]);
                          }
                        }}
                        isSelected={!!selectedCities.find(c => c.id === city.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Heatmap */}
                <div>
                  <Heatmap
                    stateData={stateData}
                    onStateClick={handleStateClick}
                    onCountyClick={handleCountyClick}
                  />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Macro Indicators */}
                <MacroIndicators data={macroData} />

                {/* Leaderboard */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                    <select
                      value={leaderboardSort}
                      onChange={(e) => setLeaderboardSort(e.target.value)}
                      className="text-sm bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-300"
                    >
                      <option value="affordability">Most Affordable</option>
                      <option value="required_income">Lowest Income</option>
                      <option value="change_1y">Best Improvement</option>
                    </select>
                  </div>
                  <Leaderboard
                    cities={cities}
                    sortBy={leaderboardSort}
                    limit={10}
                  />
                </div>

                {/* Watchlist */}
                <Watchlist
                  cities={cities}
                  onCityAdd={(city) => {
                    if (!selectedCities.find(c => c.id === city.id) && selectedCities.length < 6) {
                      setSelectedCities([...selectedCities, city]);
                    }
                  }}
                  onCityRemove={(cityId) => {
                    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
                  }}
                />
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {formatCurrency(macroData.median_us_price || 0)}
                </div>
                <div className="text-gray-400">US Median Price</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {macroData.mortgage_rate || '--'}%
                </div>
                <div className="text-gray-400">30Y Mortgage Rate</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {macroData.inventory_months || '--'}
                </div>
                <div className="text-gray-400">Months Inventory</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {macroData.price_to_income_ratio || '--'}x
                </div>
                <div className="text-gray-400">Price-to-Income</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals and Drawers */}
        <CountyModal
          isOpen={countyModalOpen}
          onClose={() => setCountyModalOpen(false)}
          city={selectedCityForModal}
          onAddToCompare={handleAddCountyToCompare}
        />

        <AssumptionsDrawer
          isOpen={assumptionsDrawerOpen}
          onClose={() => setAssumptionsDrawerOpen(false)}
        />
      </Layout>
    </AssumptionsProvider>
  );
}