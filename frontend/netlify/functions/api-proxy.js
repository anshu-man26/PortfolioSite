const fetch = require('node-fetch');

exports.handler = async (event) => {
  // The function receives the full path: /api/portfolio
  // We need to proxy it directly to: http://13.53.173.237:5000/api/portfolio
  
  const requestPath = event.path;
  console.log('Raw event.path:', requestPath);
  
  // Simply use the path as-is
  const backendUrl = `http://13.53.173.237:5000${requestPath}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
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
