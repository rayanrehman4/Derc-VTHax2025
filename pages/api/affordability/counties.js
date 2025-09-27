export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ message: 'State parameter is required' });
  }

  try {
    // Read county affordability data
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), 'public/data/countyAffordability.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const counties = data[state.toUpperCase()] || [];

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    
    res.status(200).json({
      state: state.toUpperCase(),
      counties,
      count: counties.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading county data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}