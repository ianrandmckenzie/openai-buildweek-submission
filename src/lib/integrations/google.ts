export interface GoogleOAuthBridge { authorize(url: string): Promise<void>; }
export function createGoogleOAuthBridge(openExternal?: (url: string) => Promise<void>): GoogleOAuthBridge {
  return { async authorize(url) { if (!/^https:\/\//i.test(url)) throw new Error('Google OAuth URL must use HTTPS'); if (openExternal) return openExternal(url); if (typeof window !== 'undefined') { window.location.assign(url); return; } throw new Error('OAuth browser bridge is unavailable'); } };
}

export interface GoogleCalendarConfig { clientId: string; redirectUri: string; scopes?: string[]; }
export function googleAuthorizationUrl(config: GoogleCalendarConfig, state: string): string { const url = new URL('https://accounts.google.com/o/oauth2/v2/auth'); url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: 'code', access_type: 'offline', scope: (config.scopes ?? ['https://www.googleapis.com/auth/calendar.readonly']).join(' '), state }).toString(); return url.toString(); }
