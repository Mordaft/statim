export const METERED_DOMAIN = 'subdomain.metered.live';

/**
 * Normalizes user input for the Metered domain.
 * Accepts "my-app" (converting to "my-app.metered.live") or full domain "my-app.metered.live".
 */
export function normalizeMeteredDomain(input?: string): string {
  const trimmed = (input ?? '').trim().toLowerCase();
  if (!trimmed) return METERED_DOMAIN;
  return trimmed.includes('.') ? trimmed : `${trimmed}.metered.live`;
}

/**
 * Fetches ICE servers from Metered, supporting both credential-scoped apiKey and account secretKey.
 * Per requirements, filters the result so only TURNS (TURN over TLS) servers are returned.
 * Neither the key nor the subdomain is persisted anywhere.
 */
export async function fetchMeteredIceServers(
  key: string,
  rawDomain?: string,
): Promise<RTCIceServer[]> {
  const trimmedKey = key.trim();
  if (!trimmedKey) return [];

  const domain = normalizeMeteredDomain(rawDomain);

  // Try fetching directly with credential apiKey
  let res = await fetch(`https://${domain}/api/v1/turn/credentials?apiKey=${encodeURIComponent(trimmedKey)}`);

  // If unauthorized / invalid, check if it's an account secretKey and resolve the active credential apiKey
  if (!res.ok) {
    try {
      const v2Res = await fetch(`https://${domain}/api/v2/turn/credentials?secretKey=${encodeURIComponent(trimmedKey)}`);
      if (v2Res.ok) {
        const json = await v2Res.json();
        const first = json?.data?.[0];
        if (first?.apiKey) {
          res = await fetch(`https://${domain}/api/v1/turn/credentials?apiKey=${encodeURIComponent(first.apiKey)}`);
        } else if (first?.username && first?.password) {
          return [
            {
              urls: `turns:${domain}:443?transport=tcp`,
              username: first.username,
              credential: first.password,
            },
          ];
        }
      }
    } catch {
      // Fall through to error handling below
    }
  }

  if (!res.ok) {
    throw new Error('Clave de Metered no válida o error de conexión');
  }

  const rawServers: RTCIceServer[] = await res.json();

  // Keep ONLY TURNS (TURN over TLS) servers
  const turnsOnly: RTCIceServer[] = [];
  for (const server of rawServers) {
    const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
    const turnsUrls = urls.filter((u) => u.startsWith('turns:'));
    if (turnsUrls.length > 0) {
      turnsOnly.push({
        ...server,
        urls: turnsUrls.length === 1 ? turnsUrls[0] : turnsUrls,
      });
    }
  }

  // Fallback to direct turns URL if the API list didn't include a turns: scheme
  if (!turnsOnly.length && rawServers.length > 0) {
    const firstWithCreds = rawServers.find((s) => s.username && s.credential);
    if (firstWithCreds) {
      return [
        {
          urls: `turns:${domain}:443?transport=tcp`,
          username: firstWithCreds.username,
          credential: firstWithCreds.credential,
        },
      ];
    }
  }

  return turnsOnly;
}
