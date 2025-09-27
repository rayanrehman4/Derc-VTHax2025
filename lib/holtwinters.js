/**
 * Holt-Winters Time Series Forecasting
 * Supports additive seasonality with fallbacks to simpler methods
 */

/**
 * Simple exponential smoothing (fallback for very short series)
 */
function simpleExponentialSmoothing(series, alpha = 0.3, horizon = 12) {
  if (series.length === 0) return [];
  
  let level = series[0];
  const smoothed = [level];
  
  for (let i = 1; i < series.length; i++) {
    level = alpha * series[i] + (1 - alpha) * level;
    smoothed.push(level);
  }
  
  // Forecast
  const forecast = [];
  for (let i = 0; i < horizon; i++) {
    forecast.push(level);
  }
  
  return { smoothed, forecast, level };
}

/**
 * Holt's linear trend method (fallback for medium series)
 */
function holtLinear(series, alpha = 0.3, beta = 0.1, horizon = 12) {
  if (series.length < 2) return simpleExponentialSmoothing(series, alpha, horizon);
  
  let level = series[0];
  let trend = series[1] - series[0];
  const smoothed = [level];
  
  for (let i = 1; i < series.length; i++) {
    const prevLevel = level;
    level = alpha * series[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    smoothed.push(level);
  }
  
  // Forecast
  const forecast = [];
  for (let i = 1; i <= horizon; i++) {
    forecast.push(level + i * trend);
  }
  
  return { smoothed, forecast, level, trend };
}

/**
 * Full Holt-Winters with additive seasonality
 */
function holtWinters(series, options = {}) {
  const {
    seasonLength = 12,
    alpha = 0.3,
    beta = 0.1,
    gamma = 0.1,
    horizon = 12
  } = options;
  
  if (series.length < seasonLength * 2) {
    return holtLinear(series, alpha, beta, horizon);
  }
  
  // Initialize components
  let level = series.slice(0, seasonLength).reduce((a, b) => a + b, 0) / seasonLength;
  let trend = 0;
  
  // Calculate initial trend
  const firstSeason = series.slice(0, seasonLength);
  const secondSeason = series.slice(seasonLength, seasonLength * 2);
  for (let i = 0; i < seasonLength; i++) {
    trend += (secondSeason[i] - firstSeason[i]) / seasonLength;
  }
  trend /= seasonLength;
  
  // Initialize seasonal components
  const seasonal = new Array(seasonLength);
  for (let i = 0; i < seasonLength; i++) {
    seasonal[i] = series[i] - level;
  }
  
  const smoothed = [];
  const levels = [];
  const trends = [];
  const seasonals = [];
  
  // Apply Holt-Winters
  for (let i = 0; i < series.length; i++) {
    const seasonalIndex = i % seasonLength;
    
    if (i === 0) {
      smoothed.push(level + seasonal[seasonalIndex]);
      levels.push(level);
      trends.push(trend);
      seasonals.push(...seasonal);
      continue;
    }
    
    const prevLevel = level;
    const prevSeasonal = seasonal[seasonalIndex];
    
    level = alpha * (series[i] - prevSeasonal) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[seasonalIndex] = gamma * (series[i] - level) + (1 - gamma) * prevSeasonal;
    
    smoothed.push(level + seasonal[seasonalIndex]);
    levels.push(level);
    trends.push(trend);
    seasonals.push(seasonal[seasonalIndex]);
  }
  
  // Generate forecast
  const forecast = [];
  for (let i = 1; i <= horizon; i++) {
    const seasonalIndex = (series.length + i - 1) % seasonLength;
    const forecastValue = level + i * trend + seasonal[seasonalIndex];
    forecast.push(forecastValue);
  }
  
  return {
    smoothed,
    forecast,
    level,
    trend,
    seasonal,
    residuals: series.map((actual, i) => actual - smoothed[i])
  };
}

/**
 * Bootstrap confidence intervals from residuals
 */
function bootstrapCI(residuals, forecast, confidence = [0.8, 0.95], iterations = 300) {
  if (residuals.length < 3) {
    // Wide intervals for insufficient data
    const stdDev = forecast.reduce((sum, val) => sum + val, 0) / forecast.length * 0.2;
    return confidence.map(conf => {
      const z = conf === 0.8 ? 1.28 : 1.96;
      return {
        confidence: conf,
        lower: forecast.map(val => val - z * stdDev),
        upper: forecast.map(val => val + z * stdDev)
      };
    });
  }
  
  const bootstrapForecasts = [];
  
  for (let iter = 0; iter < iterations; iter++) {
    const bootstrapForecast = forecast.map(val => {
      const randomResidual = residuals[Math.floor(Math.random() * residuals.length)];
      return val + randomResidual;
    });
    bootstrapForecasts.push(bootstrapForecast);
  }
  
  // Calculate percentiles
  return confidence.map(conf => {
    const lowerPercentile = (1 - conf) / 2;
    const upperPercentile = 1 - lowerPercentile;
    
    const lower = [];
    const upper = [];
    
    for (let i = 0; i < forecast.length; i++) {
      const values = bootstrapForecasts.map(bf => bf[i]).sort((a, b) => a - b);
      const lowerIndex = Math.floor(lowerPercentile * values.length);
      const upperIndex = Math.floor(upperPercentile * values.length);
      
      lower.push(values[lowerIndex]);
      upper.push(values[upperIndex]);
    }
    
    return { confidence: conf, lower, upper };
  });
}

/**
 * Main forecasting function with confidence intervals
 */
export function forecastWithCI(series, options = {}) {
  const {
    seasonLength = 12,
    alpha = 0.3,
    beta = 0.1,
    gamma = 0.1,
    horizon = 12,
    confidence = [0.8, 0.95]
  } = options;
  
  if (!series || series.length === 0) {
    throw new Error('Series cannot be empty');
  }
  
  // Choose method based on data length
  let result;
  let method = 'flat';
  
  if (series.length >= seasonLength * 2) {
    result = holtWinters(series, { seasonLength, alpha, beta, gamma, horizon });
    method = 'holt-winters';
  } else if (series.length >= 6) {
    result = holtLinear(series, alpha, beta, horizon);
    method = 'holt-linear';
  } else if (series.length >= 2) {
    result = simpleExponentialSmoothing(series, alpha, horizon);
    method = 'exponential-smoothing';
  } else {
    // Flat forecast for single point
    const value = series[0];
    result = {
      smoothed: [value],
      forecast: new Array(horizon).fill(value),
      residuals: [0]
    };
  }
  
  // Generate confidence intervals
  const intervals = bootstrapCI(result.residuals || [0], result.forecast, confidence);
  
  return {
    method,
    smoothed: result.smoothed,
    forecast: result.forecast,
    intervals,
    diagnostics: {
      level: result.level,
      trend: result.trend,
      seasonal: result.seasonal,
      residuals: result.residuals
    }
  };
}

export { holtWinters };