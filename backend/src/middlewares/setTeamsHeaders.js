export default function setTeamsHeaders(req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://teams.microsoft.com https://*.teams.microsoft.com https://*.skype.com",
  );

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.removeHeader('X-Frame-Options'); // Remove to avoid conflict with Content-Security-Policy

  next();
}
