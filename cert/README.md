# Trusting self-signed cert

## Generate the certificate:

```
npm run cert:generate
```

Resulting `cert.pem` is the public key, and `key.pem` is the secret private key.

**WARNING** Do not share `key.pem`. Do not check it into Git.

## Steps to trust the certificate

1. Open Keychain Access
2. Import the Certificate
   - In Keychain Access, select _System_ and _Certificates_
   - Drag and drop your `cert.pem` into the _System_ keychain.
   - Enter administrator password when prompted.
3. Trust the Certificate
   - Right-click the imported certificate and select _Get Info_.
   - Expand the _Trust_ section.
   - Set _When using this certificate_ to _Always Trust_.
   - Close the window.
   - Enter administrator password when prompted.
4. Restart Chrome
   - Close and reopen Chrome for the changes to take effect.
