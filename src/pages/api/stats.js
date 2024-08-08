// pages/api/stats.js, fake data for now
export default function handler(req, res) {
    const data = [
      { timestamp: Date.now() - 86400000 * 6, duration: 120 },
      { timestamp: Date.now() - 86400000 * 5, duration: 90 },
      { timestamp: Date.now() - 86400000 * 4, duration: 60 },
      { timestamp: Date.now() - 86400000 * 3, duration: 100 },
      { timestamp: Date.now() - 86400000 * 2, duration: 110 },
      { timestamp: Date.now() - 86400000, duration: 70 },
      { timestamp: Date.now(), duration: 80 },
    ];
  
    res.status(200).json(data);
  }
  