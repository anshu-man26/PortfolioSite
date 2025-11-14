const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Browser calls: /api/portfolio
  // Redirect: /api/* -> /.netlify/functions/api-proxy/:splat
  // So :splat captures everything after /api/, which is "portfolio" (or "api/portfolio"?)
  // event.path will be: /.netlify/functions/api-proxy/portfolio OR /.netlify/functions/api-proxy/api/portfolio
  
  const requestPath = event.path;
  console.log('Raw event.path:', requestPath);
  
  // Extract everything after /.netlify/functions/api-proxy/
  let endpoint = requestPath.replace('/.netlify/functions/api-proxy/', '').replace('/.netlify/functions/api-proxy', '');
  
  // If endpoint starts with 'api/', remove it (happens due to double capture)
  if (endpoint.startsWith('api/')) {
    endpoint = endpoint.substring(4); // Remove 'api/'
  }
  
  // Build the backend URL
  const backendUrl = `http://13.53.173.237:5000/api/${endpoint}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
  console.log('Proxying:', event.httpMethod, backendUrl);
  
  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    // Add body for non-GET requests
    if (event.body && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
      fetchOptions.body = event.body;
    }
    
    const response = await fetch(backendUrl, fetchOptions);
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: data
    };
  } catch (error) {
    console.error('Proxy error:', error.message);
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Backend proxy error', 
        message: error.message,
        requestedUrl: backendUrl 
      })
    };
  }
};
