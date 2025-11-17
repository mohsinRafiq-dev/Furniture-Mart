/**
 * JWT Utilities for Token Management
 * Handles both localStorage and cookie-based JWT storage
 */

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

// Store token in localStorage
export const storeTokenInLocalStorage = (token: string): void => {
  try {
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to store token in localStorage:', error);
  }
};

// Store token in httpOnly cookie (simulated - in real app, backend handles this)
export const storeTokenInCookie = (token: string, maxAge: number = 86400): void => {
  try {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + maxAge * 1000);
    
    // Note: httpOnly cookies can only be set by server
    // This sets a regular cookie for demo purposes
    document.cookie = `authToken=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
    document.cookie = `authTokenExpiry=${expiryDate.getTime()}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
  } catch (error) {
    console.error('Failed to store token in cookie:', error);
  }
};

// Get token from localStorage
export const getTokenFromLocalStorage = (): string | null => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to retrieve token from localStorage:', error);
    return null;
  }
};

// Get token from cookie
export const getTokenFromCookie = (): string | null => {
  try {
    const name = 'authToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve token from cookie:', error);
    return null;
  }
};

// Remove token from localStorage
export const removeTokenFromLocalStorage = (): void => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove token from localStorage:', error);
  }
};

// Remove token from cookie
export const removeTokenFromCookie = (): void => {
  try {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'authTokenExpiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  } catch (error) {
    console.error('Failed to remove token from cookie:', error);
  }
};

// Generate mock JWT token (for demo purposes only)
export const generateMockJWT = (payload: Partial<JWTPayload>): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 86400; // 24 hours

  const fullPayload: JWTPayload = {
    sub: payload.sub || '1',
    email: payload.email || 'admin@ashraf.com',
    name: payload.name || 'Admin User',
    role: payload.role || 'admin',
    iat,
    exp,
  };

  // Simple base64 encoding (not cryptographically secure - for demo only)
  const headerEncoded = btoa(JSON.stringify(header));
  const payloadEncoded = btoa(JSON.stringify(fullPayload));
  
  // Fake signature
  const signature = btoa('fake_signature');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

// Decode JWT payload (for demo purposes only)
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Failed to check token expiry:', error);
    return true;
  }
};

// Get token from either localStorage or cookie
export const getStoredToken = (): string | null => {
  // Try localStorage first
  const localToken = getTokenFromLocalStorage();
  if (localToken && !isTokenExpired(localToken)) {
    return localToken;
  }

  // Fall back to cookie
  const cookieToken = getTokenFromCookie();
  if (cookieToken && !isTokenExpired(cookieToken)) {
    return cookieToken;
  }

  return null;
};

// Store token in both locations for maximum compatibility
export const storeTokenInBoth = (token: string, maxAge: number = 86400): void => {
  storeTokenInLocalStorage(token);
  storeTokenInCookie(token, maxAge);
};

// Clear token from both locations
export const clearTokenFromBoth = (): void => {
  removeTokenFromLocalStorage();
  removeTokenFromCookie();
};
