export const APP_PORT = 5180;
export const PROXY_PORT = 8787;
export const FAKE_PORT = 8790;

export const APP_URL = `http://localhost:${APP_PORT}`;
export const PROXY_URL = `http://localhost:${PROXY_PORT}`;
export const FAKE_URL = `http://localhost:${FAKE_PORT}`;

/** Protocol timings are multiplied by this factor in the app under test (10 s -> 1 s, 60 s -> 6 s). */
export const TIME_SCALE = 0.1;
export const PAGE_ID = '4242';
