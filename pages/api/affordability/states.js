export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read state affordability data
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), 'public/data/stateAffordability.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    
    res.status(200).json({
      states: data.states,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading state data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}