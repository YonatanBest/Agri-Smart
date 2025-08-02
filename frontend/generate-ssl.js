const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sslDir = path.join(__dirname, 'ssl');
const keyPath = path.join(sslDir, 'localhost-key.pem');
const certPath = path.join(sslDir, 'localhost.pem');

// Create SSL directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
}

console.log('Generating SSL certificates for localhost...');

try {
    // Generate private key
    execSync('openssl genrsa -out ssl/localhost-key.pem 2048', { stdio: 'inherit' });
    console.log('✓ Private key generated');

    // Generate certificate
    const opensslConfig = `
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
OU = Organizational Unit
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
`;

    const configPath = path.join(sslDir, 'openssl.conf');
    fs.writeFileSync(configPath, opensslConfig);

    execSync('openssl req -new -x509 -key ssl/localhost-key.pem -out ssl/localhost.pem -days 365 -config ssl/openssl.conf', { stdio: 'inherit' });
    console.log('✓ Certificate generated');

    // Clean up config file
    fs.unlinkSync(configPath);

    console.log('\n✓ SSL certificates generated successfully!');
    console.log(`Key: ${keyPath}`);
    console.log(`Cert: ${certPath}`);
    console.log('\nYou can now run: npm run dev:https');
    console.log('Your app will be available at: https://localhost:3000');

} catch (error) {
    console.error('Error generating SSL certificates:', error.message);
    console.log('\nAlternative: You can manually generate certificates using:');
    console.log('openssl genrsa -out ssl/localhost-key.pem 2048');
    console.log('openssl req -new -x509 -key ssl/localhost-key.pem -out ssl/localhost.pem -days 365');
} 