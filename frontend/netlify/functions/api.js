const fetch = require('node-fetch');

exports.handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const url = `http://13.53.173.237:5000${path}`;
  
  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: error.message })
    };
  }
};
