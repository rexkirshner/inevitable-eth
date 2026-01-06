---
name: code-review-security
description: Deep OWASP-style security audit - authentication, injection, XSS, secrets, dependencies
---

# /code-review-security Command

Conduct a thorough OWASP-style security audit. This command **NEVER makes changes** - it only identifies vulnerabilities and suggests fixes. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Check all entry points** - APIs, forms, file uploads, webhooks
3. **Assume hostile input** - All user input is potentially malicious
4. **Report responsibly** - Critical vulnerabilities should be fixed immediately

## When to Use This Command

**Good times:**
- Before launching to production
- After adding authentication/authorization
- After adding payment or sensitive data handling
- During compliance preparation (SOC2, PCI, HIPAA)
- After security incident

**Bad times:**
- Internal prototype with no sensitive data
- Static sites with no user input

## OWASP Top 10 (2021) Framework

This audit covers all OWASP Top 10 categories:

1. **A01: Broken Access Control** - Authorization bypass
2. **A02: Cryptographic Failures** - Weak encryption, exposed secrets
3. **A03: Injection** - SQL, NoSQL, command, LDAP injection
4. **A04: Insecure Design** - Security architecture flaws
5. **A05: Security Misconfiguration** - Default configs, unnecessary features
6. **A06: Vulnerable Components** - Outdated dependencies
7. **A07: Authentication Failures** - Weak auth, session issues
8. **A08: Data Integrity Failures** - Insecure deserialization
9. **A09: Security Logging Failures** - Missing audit trail
10. **A10: Server-Side Request Forgery** - SSRF attacks

## Execution Steps

### Step 0: Set Expectations

```
Security Audit (OWASP Top 10)

Scope: Authentication, authorization, injection, XSS, secrets, dependencies
Framework: [detected]

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...

⚠️ Critical vulnerabilities found should be fixed immediately.
```

### Step 1: Identify Attack Surface

**Map all entry points:**

```bash
# Find API routes
find app -name "route.ts" -o -name "route.js" 2>/dev/null
find pages/api -name "*.ts" -o -name "*.js" 2>/dev/null

# Find forms
grep -rn "<form\|onSubmit" --include="*.tsx" --include="*.jsx"

# Find file upload handlers
grep -rn "multipart\|formData\|file.*upload" --include="*.ts" --include="*.tsx"

# Find webhooks
grep -rn "webhook" --include="*.ts"
```

**Create attack surface inventory:**

| Entry Point | Type | Auth Required | Input Types |
|-------------|------|---------------|-------------|
| /api/auth/login | POST | No | email, password |
| /api/users | GET/POST | Yes | query params, body |
| /api/upload | POST | Yes | multipart file |

### Step 2: A01 - Broken Access Control

**Check authorization on every endpoint:**

```typescript
// BAD: No authorization check
export async function GET(request: Request) {
  const users = await db.user.findMany();  // Anyone can list all users!
  return Response.json(users);
}

// GOOD: Authorization check
export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user?.isAdmin) {
    return new Response('Forbidden', { status: 403 });
  }
  const users = await db.user.findMany();
  return Response.json(users);
}
```

**Check for:**

- [ ] **Auth on all protected routes** - Every endpoint checks authentication
- [ ] **Role-based access** - Proper permission checking
- [ ] **Resource ownership** - Users can only access their own data
- [ ] **Direct object reference** - Can't access /user/123 if not user 123
- [ ] **Privilege escalation** - Can't promote self to admin

**Search commands:**
```bash
# Find API routes without auth checks
grep -rL "getSession\|getServerSession\|auth\|requireAuth" app/api/

# Find database queries that might leak data
grep -rn "findMany\|findAll" --include="*.ts" app/api/ | grep -v "where:"
```

### Step 3: A02 - Cryptographic Failures

**Check for exposed secrets:**

```bash
# Search for hardcoded secrets
grep -rn "password\s*=\|secret\s*=\|apiKey\s*=\|api_key\s*=" --include="*.ts" --include="*.tsx" --include="*.js"

# Check for secrets in URLs
grep -rn "api_key=\|token=\|secret=" --include="*.ts"

# Verify .env in .gitignore
grep "\.env" .gitignore
```

**Check for weak cryptography:**

```bash
# MD5/SHA1 usage (weak)
grep -rn "md5\|sha1\|MD5\|SHA1" --include="*.ts" --include="*.js"

# Check password hashing
grep -rn "bcrypt\|argon2\|scrypt\|pbkdf2" --include="*.ts"
```

**Verify:**
- [ ] **No hardcoded secrets** - All secrets in environment variables
- [ ] **.env in .gitignore** - Not committed to repo
- [ ] **Strong password hashing** - bcrypt, Argon2, scrypt (not MD5/SHA1)
- [ ] **HTTPS enforced** - No HTTP in production
- [ ] **Sensitive data encrypted** - At rest and in transit

### Step 4: A03 - Injection

**Check for SQL injection:**

```bash
# String concatenation in queries (DANGEROUS)
grep -rn "SELECT.*\+\|INSERT.*\+\|UPDATE.*\+\|DELETE.*\+" --include="*.ts"
grep -rn "\$\{.*\}.*SELECT\|\$\{.*\}.*INSERT" --include="*.ts"

# Raw queries that might be vulnerable
grep -rn "\$queryRaw\|\$executeRaw\|\.query\(" --include="*.ts"
```

**Check for command injection:**

```bash
# Dangerous exec/spawn usage
grep -rn "exec\|spawn\|execSync" --include="*.ts"
grep -rn "child_process" --include="*.ts"
```

**Example vulnerabilities:**

```typescript
// BAD: SQL injection
const result = await prisma.$queryRaw`SELECT * FROM users WHERE name = '${userInput}'`;

// GOOD: Parameterized
const result = await prisma.$queryRaw`SELECT * FROM users WHERE name = ${userInput}`;

// BAD: Command injection
exec(`convert ${userFilename} output.png`);  // userFilename could be "; rm -rf /"

// GOOD: Never interpolate user input into commands
exec(`convert -- ${escapeShellArg(userFilename)} output.png`);
```

### Step 5: A04 - XSS (Cross-Site Scripting)

**Check for XSS vulnerabilities:**

```bash
# React dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx"

# Vue v-html
grep -rn "v-html" --include="*.vue"

# Svelte {@html}
grep -rn "{@html" --include="*.svelte"

# Direct innerHTML usage
grep -rn "innerHTML\s*=" --include="*.ts" --include="*.tsx"

# eval() usage
grep -rn "eval\(" --include="*.ts" --include="*.tsx"
```

**Verify (framework-specific raw HTML):**
- [ ] **React: No dangerouslySetInnerHTML with user input** - Sanitize first
- [ ] **Svelte: No {@html} with user input** - Sanitize with DOMPurify
- [ ] **Vue: No v-html with user input** - Sanitize first
- [ ] **No innerHTML with user input** - Use textContent
- [ ] **No eval() with user input** - Never use eval
- [ ] **CSP headers configured** - Restrict script sources
- [ ] **Output encoding** - HTML encode user content

### Step 6: A05 - Security Misconfiguration

**Check headers and configuration:**

```bash
# Check for security headers configuration
grep -rn "Content-Security-Policy\|X-Frame-Options\|X-Content-Type-Options" --include="*.ts"

# Check CORS configuration
grep -rn "Access-Control\|cors\|CORS" --include="*.ts"

# Check for debug mode
grep -rn "NODE_ENV\|debug.*true\|DEBUG" --include="*.ts"
```

**Required security headers:**

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | default-src 'self' | Prevent XSS |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Referrer-Policy | strict-origin | Limit referrer info |

**Verify:**
- [ ] **Security headers set** - All recommended headers
- [ ] **CORS properly configured** - Not wildcard * in production
- [ ] **Debug mode off** - NODE_ENV=production
- [ ] **Error messages generic** - No stack traces to users

### Step 7: A06 - Vulnerable Components

**Check dependencies:**

```bash
# Run npm audit
npm audit 2>/dev/null || pnpm audit 2>/dev/null || yarn audit 2>/dev/null

# Check for outdated packages
npm outdated 2>/dev/null | head -20

# Check for known vulnerable packages
grep -E "lodash.*3\.|jquery.*1\.|express.*3\." package.json
```

**Verify:**
- [ ] **No critical vulnerabilities** - npm audit shows no critical
- [ ] **Dependencies updated** - Within reasonable timeframe
- [ ] **Lock file committed** - package-lock.json in repo
- [ ] **Minimal dependencies** - Remove unused packages

### Step 8: A07 - Authentication Failures

**Check authentication implementation:**

```bash
# Find auth-related code
grep -rn "login\|signin\|authenticate\|password" --include="*.ts" app/api/

# Check session configuration
grep -rn "session\|cookie\|jwt\|token" --include="*.ts"

# Check for rate limiting
grep -rn "rateLimit\|rate-limit\|throttle" --include="*.ts"
```

**Verify:**
- [ ] **Strong password requirements** - Minimum length, complexity
- [ ] **Account lockout** - After N failed attempts
- [ ] **Rate limiting on auth** - Prevent brute force
- [ ] **Secure session cookies** - HttpOnly, Secure, SameSite
- [ ] **Session expiration** - Timeout after inactivity
- [ ] **Password reset secure** - Expiring tokens, not guessable

### Step 9: A08-A10 - Additional Checks

**A08 - Data Integrity:**
```bash
# Check for insecure deserialization
grep -rn "JSON.parse\|deserialize\|unserialize" --include="*.ts"
```

**A09 - Security Logging:**
```bash
# Check for security logging
grep -rn "log.*auth\|log.*login\|log.*fail\|audit" --include="*.ts"
```

**A10 - SSRF:**
```bash
# Check for user-controlled URLs
grep -rn "fetch\|axios\|request\|got" --include="*.ts" | grep -v "node_modules"
```

### Step 10: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "security" "docs/audits"

# Option 2: Manual check - list existing security audits
ls docs/audits/security-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/security-audit-NN.md`:

```markdown
# Security Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Security |
| Framework | [OWASP Top 10 2021] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Risk Level:** [Critical/High/Medium/Low]

**Critical Vulnerabilities:** [N]
**High Priority:** [N]
**Medium Priority:** [N]
**Low Priority:** [N]

**Top 3 Security Risks:**
1. [Most critical vulnerability]
2. [Second most critical]
3. [Third most critical]

---

## Attack Surface

| Entry Point | Type | Auth | Risk Level |
|-------------|------|------|------------|
| /api/auth/login | POST | No | High |
| /api/users/[id] | CRUD | Yes | Medium |
| /api/upload | POST | Yes | High |

**Total API Routes:** [N]
**Authenticated Routes:** [N]
**Public Routes:** [N]

---

## OWASP Top 10 Analysis

### A01: Broken Access Control

**Status:** [Pass/Fail/Partial]

**Findings:**
- [List of access control issues]

### A02: Cryptographic Failures

**Status:** [Pass/Fail/Partial]

**Findings:**
- [List of crypto issues]

### A03: Injection

**Status:** [Pass/Fail/Partial]

**Findings:**
- [List of injection vulnerabilities]

[Continue for A04-A10...]

---

## Detailed Findings

### Critical

#### SEC-C1: [Vulnerability Title]
- **OWASP:** A03:2021 Injection
- **CWE:** CWE-89 SQL Injection
- **Location:** `app/api/search/route.ts:23`
- **Description:** [What's vulnerable]
- **Impact:** [What attacker could do]
- **Proof of Concept:**
```typescript
// Vulnerable code
const result = await db.$queryRaw(`SELECT * FROM users WHERE name = '${input}'`);
// Attacker input: ' OR '1'='1
```
- **Remediation:**
```typescript
// Fixed code
const result = await db.$queryRaw`SELECT * FROM users WHERE name = ${input}`;
```
- **Priority:** Fix immediately

### High Priority

[Same format]

### Medium Priority

[Same format]

### Low Priority

[Same format]

---

## Security Headers

| Header | Status | Current Value | Recommended |
|--------|--------|---------------|-------------|
| Content-Security-Policy | Missing | - | default-src 'self' |
| X-Frame-Options | Present | DENY | Good |
| Strict-Transport-Security | Missing | - | max-age=31536000 |

---

## Dependency Vulnerabilities

```
npm audit results:

[N] critical
[N] high
[N] moderate
[N] low
```

**Critical Dependencies:**
| Package | Vulnerability | Severity | Fix |
|---------|---------------|----------|-----|
| lodash | Prototype Pollution | High | Upgrade to 4.17.21 |

---

## Secrets Scan

- [ ] No hardcoded secrets found
- [ ] .env in .gitignore
- [ ] No secrets in git history (check with git-secrets)

**Potential Secrets Found:**
| File | Line | Issue |
|------|------|-------|
| lib/api.ts | 15 | Possible API key |

---

## Prioritized Remediation

### Immediate (Block Deployment)

1. **[SEC-C1]** Fix SQL injection in /api/search
   - Effort: 30 minutes
   - Risk if not fixed: Critical

### This Sprint

1. **[SEC-H1]** Add rate limiting to /api/auth
   - Effort: 2 hours
   - Risk if not fixed: High

### This Month

1. **[SEC-M1]** Configure security headers
   - Effort: 1 hour
   - Risk if not fixed: Medium

---

## Compliance Notes

**Relevant Standards:**
- [ ] OWASP Top 10 2021
- [ ] PCI DSS (if handling payments)
- [ ] HIPAA (if handling health data)
- [ ] SOC 2 (if enterprise SaaS)

---

## Metrics

- **Entry Points Analyzed:** [N]
- **Authentication Flows:** [N]
- **Database Queries Reviewed:** [N]
- **Dependencies Scanned:** [N]
- **Total Vulnerabilities:** [N]

---

## Next Steps

1. Fix critical vulnerabilities immediately
2. Run npm audit fix for dependency updates
3. Implement security headers
4. Set up security monitoring
5. Schedule re-audit after fixes

---

**Generated by:** Claude Code
**Audit Type:** Security (OWASP Top 10)
**Version:** 4.0.1
```

### Step 11: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Security" "security-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Security | [security-audit-NN.md](./security-audit-NN.md) | [Grade] | [N critical, N high issues] |
```

### Step 12: Report Completion

```
Security Audit Complete

Report saved to: docs/audits/security-audit-NN.md

Summary:
- Grade: C
- Risk Level: High
- Critical: 2 (SQL injection, missing auth)
- High: 4
- Medium: 6
- Low: 3

Critical Issues (Fix Immediately):
1. SQL injection in /api/search - Use parameterized queries
2. Missing authentication on /api/admin - Add auth middleware

High Priority:
- No rate limiting on login endpoint
- Security headers not configured
- 3 critical npm vulnerabilities

Next Steps:
1. Review full report at docs/audits/security-audit-NN.md
2. Fix critical vulnerabilities IMMEDIATELY
3. Run npm audit fix
4. Configure security headers
5. Re-run audit after fixes

⚠️ Critical vulnerabilities were found. Do not deploy until fixed.

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | No critical/high issues, all OWASP categories pass, headers configured |
| B | No critical, few high priority, most categories pass |
| C | 1-2 critical, several high priority, some categories fail |
| D | Multiple critical, many high priority, security misconfigured |
| F | Severe vulnerabilities, active exploitation risk, block deployment |

## Common Vulnerability Patterns

### SQL Injection
```typescript
// VULNERABLE
`SELECT * FROM users WHERE id = ${userId}`

// SAFE
db.query('SELECT * FROM users WHERE id = $1', [userId])
```

### XSS
```tsx
// VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// SAFE
<div>{userComment}</div>
// Or sanitize with DOMPurify
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />
```

### Broken Access Control
```typescript
// VULNERABLE - No ownership check
export async function GET({ params }) {
  return db.user.findUnique({ where: { id: params.id } });
}

// SAFE - Verify ownership
export async function GET({ params }) {
  const session = await getSession();
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (user.id !== session.user.id && !session.user.isAdmin) {
    return new Response('Forbidden', { status: 403 });
  }
  return Response.json(user);
}
```

## References

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Version:** 4.0.1
