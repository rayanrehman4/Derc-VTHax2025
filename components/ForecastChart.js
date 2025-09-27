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

const ForecastChart = ({ 
  data, 
  metric = 'required_income',
  isLoading = false 
}) => {
  const chartRef = useRef();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatValue = (value) => {
    return metric === 'price' || metric === 'required_income' 
      ? formatCurrency(value)
      : value.toLocaleString();
  };

  if (isLoading || !data) {
    return (
      <div className="chart-container h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer w-full h-full rounded" />
        </div>
      </div>
    );
  }

  const { history = [], forecast = [], intervals = {} } = data;
  
  // Combine history and forecast dates
  const historyDates = history.map(point => {
    const date = new Date(point.date);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'yy' });
  });
  
  const forecastDates = forecast.map(point => {
    const date = new Date(point.date);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'yy' });
  });
  
  const allDates = [...historyDates, ...forecastDates];
  
  // Prepare datasets
  const datasets = [];
  
  // Historical data (solid line)
  const historyValues = history.map(point => point[metric]);
  const historyData = [...historyValues, ...new Array(forecast.length).fill(null)];
  
  datasets.push({
    label: 'Historical',
    data: historyData,
    borderColor: '#22c55e',
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 4,
    pointBackgroundColor: '#22c55e',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 1,
    tension: 0.4,
  });
  
  // Forecast data (dashed line)
  const forecastValues = forecast.map(point => point[metric]);
  const forecastData = [...new Array(history.length).fill(null), ...forecastValues];
  
  datasets.push({
    label: 'Forecast',
    data: forecastData,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderDash: [5, 5],
    pointRadius: 2,
    pointHoverRadius: 4,
    pointBackgroundColor: '#3b82f6',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 1,
    tension: 0.4,
  });
  
  // 95% Confidence Interval (outer band)
  if (intervals.lo95 && intervals.hi95) {
    const ci95Lower = [...new Array(history.length).fill(null), ...intervals.lo95];
    const ci95Upper = [...new Array(history.length).fill(null), ...intervals.hi95];
    
    datasets.push({
      label: '95% Confidence',
      data: ci95Upper,
      borderColor: 'transparent',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: '+1',
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.4,
    });
    
    datasets.push({
      label: '95% CI Lower',
      data: ci95Lower,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.4,
      showLine: false,
    });
  }
  
  // 80% Confidence Interval (inner band)
  if (intervals.lo80 && intervals.hi80) {
    const ci80Lower = [...new Array(history.length).fill(null), ...intervals.lo80];
    const ci80Upper = [...new Array(history.length).fill(null), ...intervals.hi80];
    
    datasets.push({
      label: '80% Confidence',
      data: ci80Upper,
      borderColor: 'transparent',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: '+1',
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.4,
    });
    
    datasets.push({
      label: '80% CI Lower',
      data: ci80Lower,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.4,
      showLine: false,
    });
  }

  const chartData = {
    labels: allDates,
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
          font: { size: 12 },
          usePointStyle: true,
          padding: 15,
          filter: (legendItem) => {
            // Hide CI lower bounds from legend
            return !legendItem.text.includes('CI Lower');
          },
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
            if (context.dataset.label.includes('CI')) return null;
            return `${context.dataset.label}: ${formatValue(context.parsed.y)}`;
          },
        },
        filter: function(tooltipItem) {
          return !tooltipItem.dataset.label.includes('CI');
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
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return formatValue(value);
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
      },
    },
  };

  return (
    <div className="chart-container h-96">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ForecastChart;