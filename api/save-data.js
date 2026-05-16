import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await put('data.json', JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,   // <-- ini kuncinya: selalu menimpa file yang sama
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}