// Eporner API Module
const EPORNER_API_BASE = 'https://www.eporner.com/api/v2';

// Use a CORS proxy for eporner API calls since the API doesn't support CORS
// For production, consider deploying your own proxy or using a backend service
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

async function epornerFetch(endpoint, params = {}) {
  const url = new URL(`${EPORNER_API_BASE}${endpoint}`);

  // Add common parameters
  url.searchParams.set('format', 'json');

  // Add custom parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Search for videos
async function searchVideos(query, page = 1, perPage = 30) {
  return epornerFetch('/video/search/', {
    query,
    page,
    per_page: perPage
  });
}

// Get video details by ID
async function getVideoById(id) {
  return epornerFetch('/video/id/', {
    id,
    thumbsize: 'big'
  });
}

// Get trending videos
async function getTrendingVideos(page = 1, perPage = 30) {
  return epornerFetch('/video/search/', {
    query: 'trending',
    page,
    per_page: perPage
  });
}

// Get videos by category
async function getVideosByCategory(category, page = 1, perPage = 30) {
  return epornerFetch('/video/search/', {
    query: category.toLowerCase(),
    page,
    per_page: perPage
  });
}

export { searchVideos, getVideoById, getTrendingVideos, getVideosByCategory };
