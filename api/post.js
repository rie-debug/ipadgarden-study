export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, server } = req.body;

  if (!content || !server) {
    return res.status(400).json({ error: 'Missing content or server' });
  }

  const webhooks = {
    test: {
      url: process.env.WEBHOOK_TEST,
      mention: '<@&1307527257639878656>'
    },
    prod: {
      url: process.env.WEBHOOK_PROD,
      mention: '<@&1284851735688511488>'
    }
  };

  const wh = webhooks[server];
  if (!wh || !wh.url) {
    return res.status(400).json({ error: 'Invalid server' });
  }

  try {
    const response = await fetch(wh.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: wh.mention + '\n' + content })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const text = await response.text();
      return res.status(500).json({ error: 'Discord error: ' + text });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


