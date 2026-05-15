import { del } from '@vercel/blob';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'url blob diperlukan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}