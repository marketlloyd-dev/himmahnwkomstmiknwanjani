import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return new Response(
        JSON.stringify({ error: 'filename dan contentType diperlukan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Dapatkan URL unggahan langsung (presigned) dan URL publik
    const { url, downloadUrl } = await put(filename, {
      contentType,
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return new Response(
      JSON.stringify({ uploadUrl: url, blobUrl: downloadUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}