const fetch = require('node-fetch');

exports.handler = async (event) => {
  // The path will be like: /.netlify/functions/api/portfolio
  // We need to extract 'portfolio' and call http://13.53.173.237:5000/api/portfolio
  
  const requestPath = event.path;
  const apiEndpoint = requestPath.replace('/.netlify/functions/api/', '').replace('/.netlify/functions/api', '');
  
  // Build the backend URL with /api prefix
  const backendUrl = `http://13.53.173.237:5000/api/${apiEndpoint}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
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
