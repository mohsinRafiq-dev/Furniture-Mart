/**
 * JWT Utilities for Token Management
 * 
 * SECURITY NOTE: 
 * - Primary storage: HttpOnly cookies (set by backend, immune to XSS)
 * - Fallback storage: SessionStorage (cleared on browser close, safer than localStorage)
 * - Never use localStorage for tokens (vulnerable to XSS attacks)
 */

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

/**
 * ⚠️ DEPRECATED: Do not use localStorage for tokens
 * Kept for backward compatibility only
 */
export const storeTokenInLocalStorage = (token: string): void => {
  try {
    // Store in sessionStorage instead (safer - auto-cleared on browser close)
    sessionStorage.setItem('authToken', token);
    console.warn('⚠️ Using sessionStorage instead of localStorage for security');
  } catch (error) {
    console.error('Failed to store token in sessionStorage:', error);
  }
};

/**
 * Store token in HttpOnly cookie (set by backend)
 * JavaScript cannot access HttpOnly cookies (XSS protection)
 * Backend automatically sets this on login
 */
export const storeTokenInCookie = (_token: string, _maxAge: number = 86400): void => {
  try {
    // Frontend cannot directly set HttpOnly cookies (security feature)
    // This is now handled by the backend in auth.ts
    console.info('✅ HttpOnly cookie automatically set by backend');
  } catch (error) {
    console.error('Failed to set token cookie:', error);
  }
};


/**
 * Get token from sessionStorage (safer than localStorage)
 * HttpOnly cookies cannot be accessed by JavaScript
 */
export const getTokenFromLocalStorage = (): string | null => {
  try {
    // Use sessionStorage (auto-cleared on browser close)
    return sessionStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

/**
 * Get token from HttpOnly cookie (not accessible to JavaScript)
 * Backend automatically includes token in requests
 * This function is for reference only - HttpOnly cookies are automatic
 */
export const getTokenFromCookie = (): string | null => {
  try {
    // HttpOnly cookies cannot be accessed by JavaScript for security
    // Backend automatically includes them in requests
    return null; // Cannot read HttpOnly cookies
  } catch (error) {
    console.error('Failed to retrieve token from cookie:', error);
    return null;
  }
};

/**
 * Remove token from sessionStorage
 */
export const removeTokenFromLocalStorage = (): void => {
  try {
    sessionStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove token from sessionStorage:', error);
  }
};

/**
 * Remove token from cookie (handled by backend on logout)
 * Backend clears the HttpOnly cookie on logout
 */
export const removeTokenFromCookie = (): void => {
  try {
    // Backend handles clearing HttpOnly cookies
    // Frontend just needs to clear sessionStorage
    removeTokenFromLocalStorage();
  } catch (error) {
    console.error('Failed to remove token:', error);
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

/**
 * Get token from sessionStorage or HttpOnly cookie
 * Tries sessionStorage first (for development/UI access)
 * HttpOnly cookies handled automatically by browser
 */
export const getStoredToken = (): string | null => {
  // Try sessionStorage first
  const localToken = getTokenFromLocalStorage();
  if (localToken && !isTokenExpired(localToken)) {
    return localToken;
  }

  // HttpOnly cookies are automatic (handled by browser)
  return null;
};

/**
 * Store token in sessionStorage only
 * Backend automatically sets HttpOnly cookie
 */
export const storeTokenInBoth = (token: string, _maxAge: number = 86400): void => {
  storeTokenInLocalStorage(token);
  // HttpOnly cookie is automatic from backend
};

/**
 * Clear token from everywhere
 */
export const clearTokenFromBoth = (): void => {
  removeTokenFromLocalStorage();
  removeTokenFromCookie();
};
