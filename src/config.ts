const env = import.meta.env;

// Test-only knobs: VITE_TIME_SCALE shrinks protocol timings, VITE_STUN_URLS='' disables STUN.
const timeScale = Number(env.VITE_TIME_SCALE) > 0 ? Number(env.VITE_TIME_SCALE) : 1;
const t = (ms: number) => Math.round(ms * timeScale);
const stunUrls = ((env.VITE_STUN_URLS as string | undefined) ?? 'stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const iceServers: RTCIceServer[] = stunUrls.length ? [{ urls: stunUrls }] : [];
if (env.VITE_TURN_URL) {
  iceServers.push({
    urls: env.VITE_TURN_URL,
    username: env.VITE_TURN_USERNAME,
    credential: env.VITE_TURN_CREDENTIAL,
  });
}

export const config = {
  confluenceBaseUrl: (env.VITE_CONFLUENCE_BASE_URL as string | undefined) ?? '',
  pageId: (env.VITE_CONFLUENCE_PAGE_ID as string | undefined) ?? '',
  iceServers,
  meteredDomain: (env.VITE_METERED_DOMAIN as string | undefined) ?? '',
  meteredApiKey: (env.VITE_METERED_API_KEY as string | undefined) ?? '',
  seedRotationMs: 60 * 60 * 1000,
  seedGraceMs: 10 * 60 * 1000,
  // Peers re-announce every rotation; silence beyond this means they left.
  announceTtlMs: 70 * 60 * 1000,
  // Absolute minimum gap between Confluence requests, only when justified.
  fastPollMs: t(10 * 1000),
  idlePollMs: t(60 * 1000),
  dailyFastRequestBudget: 100,
  // Must exceed idlePollMs so a newcomer catches offers from idle peers.
  startupFastPollMs: t(2 * 60 * 1000),
  fastHoldMs: t(80 * 1000),
  answerTimeoutMs: t(150 * 1000),
  signalBatchDelayMs: t(1500),
  signalTtlMs: 5 * 60 * 1000,
  maxPollBackoffMs: t(5 * 60 * 1000),
  maxPeers: 20,
  // Each frame re-sends the sender's own messages of this window so late joiners catch up.
  historyWindowMs: 10 * 60 * 60 * 1000,
  historyMaxBytes: 128 * 1024,
} as const;
