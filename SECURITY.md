# 🔐 Frontend Security Guidelines

## Token Storage Security

### Current Implementation

- ✅ **Primary:** HttpOnly cookies (set by backend)
- ✅ **Fallback:** SessionStorage (auto-cleared on browser close)
- ❌ **Removed:** localStorage (vulnerable to XSS)

### Why This Matters

| Storage         | XSS Vulnerable | Can Access   | Auto-Clear             | Best For           |
| --------------- | -------------- | ------------ | ---------------------- | ------------------ |
| localStorage    | ⚠️ YES         | JavaScript   | ❌ NO                  | ❌ NOT tokens      |
| sessionStorage  | ⚠️ YES         | JavaScript   | ✅ YES (browser close) | ✅ Safe fallback   |
| HttpOnly Cookie | ✅ NO          | Backend only | ✅ YES (expiry)        | ✅ BEST for tokens |

### How It Works

**Login Flow:**

```
1. User submits credentials
2. Backend validates & generates JWT
3. Backend sets HttpOnly cookie (secure, HTTP-only, SameSite)
4. Frontend stores in sessionStorage (for UI use)
5. Backend includes cookie automatically in all requests
```

**Logout Flow:**

```
1. User clicks logout
2. Backend clears HttpOnly cookie
3. Frontend clears sessionStorage
4. User is fully logged out
```

---

## XSS Attack Prevention

### What is XSS?

Attacker injects malicious JavaScript into your app to steal tokens from localStorage.

### How We Prevent It

1. **HttpOnly Cookies** - JavaScript cannot access them
2. **Input Validation** - Sanitize all user inputs
3. **Content Security Policy** - Restrict script sources
4. **React Sanitization** - React escapes HTML by default

### Best Practices in Code

✅ **DO THIS:**

```tsx
// React automatically escapes values
<div>{userInput}</div> // Safe!
```

❌ **DON'T DO THIS:**

```tsx
// Never use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // UNSAFE!
```

---

## API Communication Security

### Current Setup

- ✅ Credentials included automatically (HttpOnly cookies)
- ✅ CORS configured properly
- ✅ HTTPS ready for production
- ✅ Headers validated on backend

### Making Secure API Calls

```typescript
// ✅ CORRECT - Credentials included automatically
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Include HttpOnly cookies
  body: JSON.stringify({ email, password }),
});

// ❌ WRONG - Missing credentials
const response = await fetch("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

---

## Component Security

### Protected Routes

- ✅ Auth middleware checks token validity
- ✅ Route protection on frontend
- ✅ 401/403 errors trigger re-login

### Error Handling

- ✅ Don't expose sensitive info in error messages
- ✅ Generic error messages to users
- ✅ Log detailed errors for debugging only

```typescript
// ✅ GOOD
if (error.status === 401) {
  showError("Authentication failed. Please log in again.");
}

// ❌ BAD
if (error.status === 401) {
  showError(`Invalid JWT token: ${error.message}`);
}
```

---

## Production Checklist

### Before Deployment

- [ ] Remove console.log statements with sensitive data
- [ ] Enable HTTPS/TLS
- [ ] Set secure CORS origin to your domain
- [ ] Update API URLs to production
- [ ] Enable security headers (done by backend)
- [ ] Test token expiration workflow
- [ ] Verify HttpOnly cookies work correctly
- [ ] Check for hardcoded credentials
- [ ] Run security audit tools
- [ ] Test XSS prevention (try injection in forms)

### Environment Variables (`.env.local`)

```
VITE_API_URL=https://api.your-domain.com
VITE_CORS_ORIGIN=https://your-domain.com
```

### Never Expose In Code

- ❌ API keys
- ❌ Passwords
- ❌ Private keys
- ❌ Database URLs
- ❌ JWT secrets

---

## Monitoring & Debugging

### Check Token Status

```javascript
// Check if sessionStorage has token
sessionStorage.getItem("authToken");

// Check if HttpOnly cookie exists (backend will include)
// Cannot access directly, but watch Network tab in DevTools
```

### Network Tab Inspection

1. Open DevTools → Network
2. Make login request
3. Look for `Set-Cookie` header in response
4. Should see: `refreshToken=...; HttpOnly; Secure; SameSite=Strict`
5. Verify `authToken` is NOT visible (HttpOnly protection works!)

### Audit Logs

- Review backend audit logs for suspicious login attempts
- Check for unusual IP addresses or user agents
- Monitor account lockout events

---

## Common Security Issues & Fixes

### Issue: Tokens in Local Storage

**Problem:** Visible to XSS attacks
**Solution:** Use HttpOnly cookies + sessionStorage

### Issue: API Requests Missing Auth

**Problem:** Credentials not sent
**Solution:** Add `credentials: 'include'` to fetch

### Issue: Sensitive Data in Logs

**Problem:** Passwords/tokens logged
**Solution:** Filter sensitive data before logging

### Issue: CORS Errors

**Problem:** Cannot make requests to API
**Solution:** Backend CORS configured, verify origin matches

---

## Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN: HTTPOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## Questions?

See `/backend/SECURITY.md` for server-side security details.

**Last Updated:** November 24, 2025
