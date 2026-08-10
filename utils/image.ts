import { User } from '@/types/auth';

/**
 * Resolves the avatar image source for a user.
 * If the user has a profile picture (either as relative or absolute URL), it will resolve it properly.
 * Otherwise, it falls back to the default asset placeholder image.
 */
/**
 * Helper to conditionally return ngrok bypass headers only when connecting to an ngrok tunnel.
 */
const getImageHeaders = (url?: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
  const isNgrok = apiUrl.includes('ngrok') || (url && url.includes('ngrok'));
  return isNgrok ? { 'ngrok-skip-browser-warning': 'true' } : undefined;
};

/**
 * Resolves the avatar image source for a user.
 * If the user has a profile picture (either as relative or absolute URL), it will resolve it properly.
 * Otherwise, it falls back to the default asset placeholder image.
 */
export const getAvatarSource = (user: User | null | undefined) => {
  const url = user?.profilePicture?.url || user?.avatarUrl;
  if (!url) {
    return undefined;
  }

  if (
    url.startsWith('http') ||
    url.startsWith('file') ||
    url.startsWith('content') ||
    url.startsWith('data:')
  ) {
    const headers = getImageHeaders(url);
    return headers ? { uri: url, headers } : { uri: url };
  }

  // Relative path. Resolve against base URL without /api/v1
  const baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  const relativePath = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${baseUrl}${relativePath}`;
  const headers = getImageHeaders(fullUrl);
  return headers ? { uri: fullUrl, headers } : { uri: fullUrl };
};

/**
 * Resolves a relative or absolute media URL from the backend to an absolute URL string.
 */
export const resolveMediaUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  if (
    url.startsWith('http') ||
    url.startsWith('file') ||
    url.startsWith('content') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  const relativePath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${relativePath}`;
};

/**
 * Helper to get a full Image / expo-image source object with optional ngrok warning bypass headers.
 */
export const getMediaImageSource = (url: string | null | undefined, fallback?: any) => {
  const resolvedUrl = resolveMediaUrl(url);
  if (!resolvedUrl) return fallback || undefined;
  const headers = getImageHeaders(resolvedUrl);
  return headers ? { uri: resolvedUrl, headers } : { uri: resolvedUrl };
};


