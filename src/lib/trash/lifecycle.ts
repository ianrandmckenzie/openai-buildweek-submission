export const TRASH_RETENTION_DAYS = 30;
export function purgeAt(deletedAt: number): number { return deletedAt + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000; }
export function daysRemaining(deletedAt: number, now = Date.now()): number { return Math.max(0, Math.ceil((purgeAt(deletedAt) - now) / (24 * 60 * 60 * 1000))); }
export function isExpired(deletedAt: number, now = Date.now()): boolean { return now >= purgeAt(deletedAt); }
