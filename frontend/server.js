const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be below `next()`
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// SSL certificate paths
const sslDir = path.join(__dirname, 'ssl');
const keyPath = path.join(sslDir, 'localhost-key.pem');
const certPath = path.join(sslDir, 'localhost.pem');

// Check if SSL certificates exist
const sslExists = fs.existsSync(keyPath) && fs.existsSync(certPath);

if (sslExists) {
    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };

    app.prepare().then(() => {
        createServer(httpsOptions, async (req, res) => {
            try {
                // Be sure to pass `true` as the second argument to `url.parse`.
                // This tells it to parse the query portion of the URL.
                const parsedUrl = parse(req.url, true);
                const { pathname, query } = parsedUrl;

                await handle(req, res, parsedUrl);
            } catch (err) {
                console.error('Error occurred handling', req.url, err);
                res.statusCode = 500;
                res.end('internal server error');
            }
        })
            .once('error', (err) => {
                console.error(err);
                process.exit(1);
            })
            .listen(port, () => {
                console.log(`> Ready on https://${hostname}:${port}`);
            });
    });
} else {
    console.log('SSL certificates not found. Please run: npm run generate-ssl');
    console.log('Starting HTTP server instead...');

    app.prepare().then(() => {
        const { createServer } = require('http');
        createServer(async (req, res) => {
            try {
                const parsedUrl = parse(req.url, true);
                const { pathname, query } = parsedUrl;

                await handle(req, res, parsedUrl);
            } catch (err) {
                console.error('Error occurred handling', req.url, err);
                res.statusCode = 500;
                res.end('internal server error');
            }
        })
            .once('error', (err) => {
                console.error(err);
                process.exit(1);
            })
            .listen(port, () => {
                console.log(`> Ready on http://${hostname}:${port}`);
            });
    });
} 