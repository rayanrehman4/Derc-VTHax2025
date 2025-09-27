import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ cities = [], timeRange = '5Y' }) => {
  const chartRef = useRef();

  const getFilteredData = (history) => {
    if (!history || history.length === 0) return [];
    
    const currentYear = new Date().getFullYear();
    let yearsBack;
    
    switch (timeRange) {
      case '1Y':
        yearsBack = 1;
        break;
      case '5Y':
        yearsBack = 5;
        break;
      case '10Y':
      default:
        yearsBack = 10;
        break;
    }
    
    return history.filter(point => point.year >= currentYear - yearsBack);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const colors = [
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#f97316', // orange-500
  ];

  const datasets = cities.map((city, index) => {
    const data = getFilteredData(city.history);
    
    return {
      label: city.name,
      data: data.map(point => point.required_income),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    };
  });

  const labels = cities.length > 0 ? 
    getFilteredData(cities[0].history).map(point => point.year.toString()) : [];

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f9fafb',
          font: {
            size: 14,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return formatCurrency(value);
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
      },
    },
    hover: {
      animationDuration: 300,
    },
  };

  if (cities.length === 0) {
    return (
      <div className="chart-container h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No cities selected</div>
          <div className="text-gray-500 text-sm">Select cities to view their affordability trends</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container h-96">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default LineChart;