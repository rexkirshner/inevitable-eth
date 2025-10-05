# Security Review Checklist

Comprehensive security audit for web applications and APIs.

**When to use:** During `/code-review` for all projects, especially those handling user data.

## Quick Check (5 minutes)

Essential security items:

- [ ] **Input validation** - All user input validated and sanitized
- [ ] **SQL injection protection** - Parameterized queries or ORM
- [ ] **XSS protection** - Output encoding, CSP headers
- [ ] **Authentication** - Secure auth implementation
- [ ] **Secrets** - No hardcoded passwords, API keys, or tokens in code

## Input Validation

- [ ] **Server-side validation** - Never trust client-side validation alone
- [ ] **Whitelist approach** - Allow known-good input, not block known-bad
- [ ] **Type checking** - Validate data types match expected
- [ ] **Length limits** - Enforce maximum input lengths
- [ ] **Format validation** - Email, URL, phone number formats
- [ ] **File upload validation** - Type, size, content validation
- [ ] **SQL injection** - Parameterized queries, no string concatenation

## SQL Injection Prevention

### Critical Checks

- [ ] **Parameterized queries** - Use prepared statements
- [ ] **ORM/Query builders** - Use parameterized methods
- [ ] **No string concatenation** - Never build queries with user input
- [ ] **Stored procedures** - Parameterized if used
- [ ] **Least privilege** - Database user has minimal permissions

**Bad (Vulnerable):**
```javascript
// NEVER DO THIS
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Good (Safe):**
```javascript
// Parameterized query
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);
```

## Cross-Site Scripting (XSS)

### Output Encoding

- [ ] **HTML encoding** - Encode user data in HTML context
- [ ] **JavaScript encoding** - Encode data in JS context
- [ ] **URL encoding** - Encode data in URLs
- [ ] **CSS encoding** - Encode data in CSS
- [ ] **Attribute encoding** - Encode data in HTML attributes

### Content Security Policy

- [ ] **CSP headers** - Restrict resource sources
- [ ] **No inline scripts** - Avoid inline JavaScript
- [ ] **No eval()** - Never use eval with user input
- [ ] **Trusted sources** - Whitelist allowed script sources

**Example CSP Header:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'
```

### Framework Protection

- [ ] **React** - Use JSX (auto-escapes), avoid dangerouslySetInnerHTML
- [ ] **Vue** - Use templates (auto-escapes), avoid v-html with user input
- [ ] **Angular** - Use templates (auto-escapes), sanitize before innerHTML

## Authentication & Authorization

### Authentication

- [ ] **Strong passwords** - Enforce minimum length, complexity
- [ ] **Password hashing** - bcrypt, Argon2, scrypt (NEVER plain text or MD5)
- [ ] **Password reset** - Secure token-based reset flow
- [ ] **MFA support** - Multi-factor authentication available
- [ ] **Account lockout** - Lock after N failed attempts
- [ ] **Session management** - Secure session handling
- [ ] **Remember me** - Secure implementation if offered

### Authorization

- [ ] **Role-based access** - Proper permission checking
- [ ] **Resource-level auth** - Check user owns resource
- [ ] **API authorization** - Every endpoint checks permissions
- [ ] **Least privilege** - Users have minimum necessary permissions
- [ ] **No client-side auth** - Server always validates permissions

### Session Security

- [ ] **Secure cookies** - HttpOnly, Secure, SameSite flags
- [ ] **Session expiration** - Timeout after inactivity
- [ ] **Session regeneration** - New session ID after login
- [ ] **Logout functionality** - Properly destroys session
- [ ] **CSRF tokens** - For state-changing operations

## Cross-Site Request Forgery (CSRF)

- [ ] **CSRF tokens** - Unique token per session/request
- [ ] **SameSite cookies** - SameSite=Strict or Lax
- [ ] **Verify origin** - Check Origin/Referer headers
- [ ] **State-changing ops** - Require token for POST/PUT/DELETE
- [ ] **Framework protection** - Use built-in CSRF protection

## API Security

- [ ] **Rate limiting** - Prevent brute force, DoS
- [ ] **API authentication** - Bearer tokens, API keys, OAuth
- [ ] **HTTPS only** - All API calls over secure connection
- [ ] **Input validation** - Validate all request parameters
- [ ] **Error messages** - Don't leak sensitive info in errors
- [ ] **CORS** - Properly configured, not wildcard * in production
- [ ] **API versioning** - Version endpoints for backward compatibility

## Data Protection

### Sensitive Data

- [ ] **Encryption at rest** - Database encryption for sensitive data
- [ ] **Encryption in transit** - HTTPS/TLS for all communication
- [ ] **No sensitive data in URLs** - Session IDs, passwords, PII
- [ ] **No sensitive data in logs** - Redact passwords, tokens
- [ ] **PII handling** - Proper handling of personally identifiable information

### Secrets Management

- [ ] **No hardcoded secrets** - No passwords, API keys in code
- [ ] **Environment variables** - Use .env files (not committed)
- [ ] **Secret management** - Use vault/secret manager in production
- [ ] **.env in .gitignore** - Never commit .env files
- [ ] **Rotate secrets** - Regular rotation of API keys, passwords

**Example .env usage:**
```javascript
// Good
const apiKey = process.env.API_KEY;

// Bad - NEVER DO THIS
const apiKey = 'sk_live_abc123xyz';
```

## File Upload Security

- [ ] **File type validation** - Check MIME type and extension
- [ ] **File size limits** - Prevent DoS via large files
- [ ] **Scan for malware** - Virus scanning if possible
- [ ] **Storage location** - Outside web root
- [ ] **Filename sanitization** - Remove path traversal characters
- [ ] **Content validation** - Validate file content matches type
- [ ] **Serve with headers** - X-Content-Type-Options: nosniff

## Dependencies

- [ ] **Audit dependencies** - npm audit, Snyk, Dependabot
- [ ] **Keep updated** - Regular updates for security patches
- [ ] **Minimize dependencies** - Fewer deps = smaller attack surface
- [ ] **Lock file** - package-lock.json, yarn.lock committed
- [ ] **Known vulnerabilities** - Check CVE databases

## Headers & Configuration

### Security Headers

- [ ] **Strict-Transport-Security** - Force HTTPS
- [ ] **X-Content-Type-Options** - nosniff prevents MIME sniffing
- [ ] **X-Frame-Options** - DENY or SAMEORIGIN prevents clickjacking
- [ ] **X-XSS-Protection** - 1; mode=block (legacy browsers)
- [ ] **Content-Security-Policy** - Restrict resource sources
- [ ] **Referrer-Policy** - Control referrer information

**Example headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

### HTTPS/TLS

- [ ] **HTTPS everywhere** - All traffic over HTTPS
- [ ] **TLS 1.2+** - No SSL, TLS 1.0, or TLS 1.1
- [ ] **Valid certificate** - Not expired, trusted CA
- [ ] **Redirect HTTP** - Auto-redirect to HTTPS
- [ ] **HSTS header** - Force HTTPS on subsequent visits

## Error Handling

- [ ] **Generic error messages** - Don't expose stack traces to users
- [ ] **Log errors securely** - Full errors logged server-side only
- [ ] **No sensitive info** - Error messages don't leak DB structure, paths
- [ ] **Proper HTTP codes** - Use appropriate status codes
- [ ] **Error monitoring** - Sentry, Rollbar, etc. for production errors

## Common Vulnerabilities

### Critical

**SQL Injection:**
```markdown
**Issue:** User input directly in database query
**Location:** app/api/search/route.ts:23
**Severity:** Critical
**Impact:** Attacker can access/modify all database data
**Fix:** Use parameterized queries: db.query('SELECT * FROM users WHERE id = ?', [userId])
```

**Hardcoded secrets:**
```markdown
**Issue:** API key hardcoded in source code
**Location:** lib/api-client.ts:5
**Severity:** Critical
**Impact:** Secret exposed in git history, public if repo leaked
**Fix:** Move to environment variable: process.env.API_KEY
```

**No authentication:**
```markdown
**Issue:** Admin endpoint accessible without authentication
**Location:** app/api/admin/route.ts
**Severity:** Critical
**Impact:** Anyone can access admin functions
**Fix:** Add authentication middleware to verify admin role
```

### High Priority

**Missing input validation:**
```markdown
**Issue:** Email parameter not validated
**Location:** app/api/signup/route.ts:15
**Severity:** High
**Impact:** Invalid data in database, potential injection
**Fix:** Validate email format with regex or validator library
```

**XSS vulnerability:**
```markdown
**Issue:** User input rendered without escaping
**Location:** components/Comment.tsx:23
**Severity:** High
**Impact:** Attacker can inject malicious scripts
**Fix:** Use {comment.text} not dangerouslySetInnerHTML
```

**Weak password policy:**
```markdown
**Issue:** No minimum password length requirement
**Location:** app/api/auth/signup/route.ts
**Severity:** High
**Impact:** Users can set weak passwords, easy to brute force
**Fix:** Enforce minimum 12 characters, complexity requirements
```

## Testing Tools

### Static Analysis
- **Snyk** - Dependency vulnerability scanning
- **npm audit** - Built-in npm security audit
- **ESLint security plugins** - eslint-plugin-security
- **SonarQube** - Code quality and security

### Dynamic Analysis
- **OWASP ZAP** - Web app security scanner
- **Burp Suite** - Web security testing
- **Nikto** - Web server scanner

### Manual Testing
- **SQL injection** - Try `' OR '1'='1` in inputs
- **XSS** - Try `<script>alert('xss')</script>` in inputs
- **Path traversal** - Try `../../../etc/passwd` in file paths
- **CSRF** - Test state-changing requests without tokens

## OWASP Top 10 (2021)

1. **Broken Access Control** - Improper authorization
2. **Cryptographic Failures** - Weak encryption, exposed secrets
3. **Injection** - SQL, NoSQL, command injection
4. **Insecure Design** - Flawed security architecture
5. **Security Misconfiguration** - Default configs, unnecessary features
6. **Vulnerable Components** - Outdated dependencies
7. **Authentication Failures** - Weak auth, session management
8. **Data Integrity Failures** - Insecure deserialization, CI/CD
9. **Security Logging Failures** - Insufficient logging/monitoring
10. **Server-Side Request Forgery** - SSRF attacks

## Documentation Format

```markdown
### Security Issues

**S1: SQL injection vulnerability**
- **Severity:** Critical
- **Location:** app/api/search/route.ts:23
- **Issue:** User input directly in database query
- **Impact:** Attacker can read/modify all database data
- **OWASP:** A03:2021 Injection
- **Suggestion:** Use parameterized queries with placeholder: db.query('SELECT * FROM items WHERE name = ?', [searchTerm])

**S2: Hardcoded API key**
- **Severity:** Critical
- **Location:** lib/stripe.ts:3
- **Issue:** Stripe secret key hardcoded in source
- **Impact:** Secret exposed in git history
- **OWASP:** A02:2021 Cryptographic Failures
- **Suggestion:** Move to environment variable: process.env.STRIPE_SECRET_KEY
```

## Quick Wins

1. **Add .env to .gitignore** - 10 seconds
2. **Enable HTTPS redirect** - Server config change
3. **Add security headers** - Middleware/server config
4. **Run npm audit** - Fix critical vulnerabilities
5. **Parameterize SQL queries** - Replace string concatenation

## Priority Guidelines

**Critical (Block Launch):**
- SQL injection vulnerabilities
- Hardcoded secrets in code
- No authentication on protected routes
- Exposed admin endpoints

**High (Fix Before Launch):**
- Missing input validation
- XSS vulnerabilities
- Weak password policy
- No HTTPS/TLS
- Critical dependency vulnerabilities

**Medium (Fix Post-Launch):**
- Missing security headers
- Suboptimal CORS config
- No rate limiting
- Weak session management

**Low (Nice to Have):**
- Additional monitoring
- Enhanced logging
- Security audit trail
- Penetration testing

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Web Security Academy](https://portswigger.net/web-security)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
