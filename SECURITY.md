# Security Best Practices

This project handles e-commerce orders, so every configuration change must reinforce privacy, integrity, and availability. The recommendations here cover the web client, third-party integrations, and Firestore security rules.

## 1. Transport & Delivery
- Serve the SPA and API endpoints through HTTPS only (Netlify and cPanel both provide TLS).  
- Redirect all `http://` requests to `https://www.sariaperfume.com` at the edge or load balancer.
- Use `Strict-Transport-Security` headers with at least a one-year max-age and include subdomains once the entire brand is TLS-compliant.
- Enable HTTP/2 where possible to improve perf/security.

## 2. Web Application Hardening
- Add a Content Security Policy (CSP) that limits script/style sources to approved domains (`self`, CDN, Formspree, analytics providers) and disallows inline scripts where possible. Evaluate using `helmet` headers during SSR or via proxy.
- Enable `Referrer-Policy` (`strict-origin-when-cross-origin`) and `Permissions-Policy` to restrict camera/microphone access.
- Keep dependencies up to date (run `npm audit` regularly) and prune unused packages to shrink the attack surface.
- Protect stateful endpoints (e.g., checkout) by validating inputs client-side and server-side. All order submissions now post to Formspree before hitting Firestore.
- Keep API keys and Firebase credentials out of VCS; rotate them if the project moves to production.
- Use `App Check` (Firebase) or another attestation service whenever possible to reject unauthorized clients.

## 3. Form Security
- All user-driven forms (orders, contact, distributor, newsletter) now POST JSON to dedicated Formspree endpoints to centralize email delivery and reduce server-side surface area.
- Validate email addresses and required fields before submission.
- Display user-friendly success/failure feedback without revealing backend implementation details.

## 4. Firestore Security Rules
Encourage the following rules so only authorized parties can mutate Firestore data. Adjust the token checks to reflect your auth setup.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }

    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if request.resource.data.totalAmount is number
        && request.resource.data.items is list
        && request.resource.data.items.size() > 0
        && request.resource.data.full_name is string
        && request.resource.data.email is string;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

This ensures the public client can still push `orders` (since `createOrder` runs client-side) while preventing anonymous users from touching `products`. For stricter control, route order creation through a Cloud Function that verifies App Check tokens and writes on behalf of the client.

## 5. Deployment & Hosting
- Publish `sitemap.xml` and `robots.txt` so crawlers pick up the correct URLs on both Netlify (demo) and `www.sariaperfume.com` (cPanel).  
- Use Netlify’s built-in WAF features if needed and deny access to `/admin` paths unless behind authentication.
- Monitor build logs for new warnings (chunk sizes, outdated browserslist) and remediate promptly.

## 6. Monitoring & Incident Response
- Log failed requests to Formspree so you can reprocess missed emails.  
- Track Firebase usage and security rule denials via the Firebase console.  
- Have a rollback plan (e.g., revert to a previous deploy) in case a compromised deployment is identified.
