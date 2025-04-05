const fs = require('fs');
const path = require('path');

let key, cert;

try {
  key = fs.readFileSync(path.resolve(__dirname, '..', 'cert', 'key.pem'));
  cert = fs.readFileSync(path.resolve(__dirname, '..', 'cert', 'cert.pem'));
} catch (error) {
  console.warn('Warning: unable to load key.pem/cert.pem', error);
}

exports.devServer = {
  historyApiFallback: true,
  open: false,
  port: 8080,
  server: { type: 'https', options: { key, cert } },
  headers: {
    'Content-Security-Policy':
      "frame-ancestors 'self' https://teams.microsoft.com https://*.teams.microsoft.com https://*.skype.com",
    'Access-Control-Allow-Origin': 'https://teams.microsoft.com',
    'Access-Control-Allow-Credentials': 'true',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  },
  hot: true,
  client: {
    webSocketURL: { hostname: 'localhost', port: 8080, protocol: 'wss' },
    overlay: true, // Show build errors in the browser
  },
  static: {
    directory: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
};
