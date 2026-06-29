const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong. Please try again.');
  }

  return payload;
}

export function getPortfolio() {
  return request('/api/portfolio');
}

export function sendContactMessage(message) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(message),
  });
}
