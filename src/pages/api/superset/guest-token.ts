import type { APIRoute } from 'astro';

const SUPERSET_URL = process.env.SUPERSET_INTERNAL_URL || 'http://superset:8088';

const ADMIN_USERNAME = process.env.SUPERSET_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD || 'tester';

const DASHBOARD_EMBED_ID =
  process.env.SUPERSET_DASHBOARD_EMBED_ID || 'feb18f6d-8bd4-4bd8-b78b-67f4b7e48ddf';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const loginRes = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      provider: 'db',
    }),
  });

  if (!loginRes.ok) {
    const text = await loginRes.text();
    throw new Error(`Login failed: ${loginRes.status} ${text}`);
  }

  const { access_token } = await loginRes.json();

  cachedToken = access_token;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 minutes

  return access_token;
}

export const GET: APIRoute = async () => {
  try {
    const accessToken = await getAccessToken();

    const guestRes = await fetch(`${SUPERSET_URL}/api/v1/security/guest_token/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: 'public_guest',
          first_name: 'Public',
          last_name: 'User',
        },
        resources: [
          {
            type: 'dashboard',
            id: DASHBOARD_EMBED_ID,
          },
        ],
        rls: [], // no row-level security
      }),
    });

    if (!guestRes.ok) {
      const text = await guestRes.text();
      return new Response(
        JSON.stringify({ error: `Guest token request failed: ${guestRes.status} ${text}` }),
        { status: 500 }
      );
    }

    const { token } = await guestRes.json();

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Guest token error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500 }
    );
  }
};
