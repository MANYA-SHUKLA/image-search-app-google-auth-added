import express from 'express';
import axios from 'axios';
import Search from '../models/Search.js';

const router = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
};

// POST /api/search
router.post('/search', isAuthenticated, async (req, res) => {
  try {
    const { term } = req.body;
    
    if (!term || term.trim() === '') {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const searchTerm = term.trim();

    // Save search to database
    const searchRecord = await Search.create({
      userId: req.user._id,
      term: searchTerm,
      timestamp: new Date(),
    });

    // Fetch images from Openverse (no API key required)
    const openverseResponse = await axios.get('https://api.openverse.engineering/v1/images/', {
      params: {
        q: searchTerm,
        page_size: 20,
        license_type: 'commercial,modification', // Use images that allow commercial use and modification
      },
      headers: {
        'User-Agent': 'ImageSearchApp/1.0', // Required by Openverse
      },
    });

    const images = (openverseResponse.data.results || []).map((image) => ({
      id: image.id || image.identifier || String(Math.random()),
      url: image.url || image.detail_url || image.foreign_landing_url || '',
      thumb: image.thumbnail || image.url || image.detail_url || '',
      description: image.title || image.description || image.alt_text || '',
      author: image.creator || image.creator_name || 'Unknown',
      authorUrl: image.creator_url || image.foreign_landing_url || '#',
    })).filter(img => img.url); // Filter out images without URLs

    res.json({
      term: searchTerm,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error('Search error:', error);
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    res.status(500).json({ error: 'Failed to search images' });
  }
});

// GET /api/top-searches
router.get('/top-searches', async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          term: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(topSearches);
  } catch (error) {
    console.error('Top searches error:', error);
    res.status(500).json({ error: 'Failed to fetch top searches' });
  }
});

// GET /api/history
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('term timestamp')
      .lean();

    res.json(history);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

export default router;

