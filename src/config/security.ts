const isDevelopment = process.env.NODE_ENV === "development";

const STATIC_CSP_DIRECTIVES = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://img.clerk.com",
  "font-src 'self'",
  "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
] as const;

export const clerkContentSecurityPolicy = {
  directives: {
    "base-uri": ["'self'"],
    "font-src": ["'self'"],
    "frame-ancestors": ["'none'"],
    "img-src": ["data:", "blob:"],
    "object-src": ["'none'"],
  },
  strict: true,
};

export function buildContentSecurityPolicy(nonce: string): string {
  const scriptSource = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    isDevelopment ? "'unsafe-eval'" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const styleSource = ["style-src 'self'", `'nonce-${nonce}'`].join(" ");

  return [...STATIC_CSP_DIRECTIVES, scriptSource, styleSource].join("; ");
}
