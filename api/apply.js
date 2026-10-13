/**
 * Vercel serverless proxy for the HYBRID Google Apps Script endpoint.
 * Configure HYBRID_APPS_SCRIPT_URL in Vercel Project Settings > Environment Variables.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const endpoint = process.env.HYBRID_APPS_SCRIPT_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(endpoint)) {
    return res.status(503).json({ success: false, message: 'Recruitment backend is not configured yet.' });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); }
    catch (_) { throw new Error('The recruitment backend returned an unreadable response.'); }
    if (!response.ok) {
      return res.status(502).json({ success: false, message: 'Recruitment service is temporarily unavailable.' });
    }
    return res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    console.error('HYBRID recruitment proxy error:', error.message);
    return res.status(502).json({ success: false, message: 'Unable to reach the recruitment system. Please try again later.' });
  }
};
