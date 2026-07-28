const isDevelopment = process.env.NODE_ENV === "development";

const STATIC_CSP_DIRECTIVES = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
] as const;

export function buildContentSecurityPolicy(nonce: string): string {
  const scriptSource = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    isDevelopment ? "'unsafe-eval'" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const styleSource = ["style-src 'self'", `'nonce-${nonce}'`].join(" ");

  return [...STATIC_CSP_DIRECTIVES, scriptSource, styleSource].join("; ");
}
