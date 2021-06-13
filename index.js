/**
 * M5Paper WebService
 * Command > node index.js
 *  --> to Start Web Service
 * Access http://localhost:3001/screenshot.jpg
 *  --> to View jpg from /web/view.html (default)
 * Access http://localhost:3001/screenshot.jpg?url=http://example.com 
 *  --> to View jpg from url
 * Access http://localhost:3001/view.html 
 *  --> to Preview /web/view.html
 * Access http://localhost:3001/screenshot.jpg?url=http://localhost:3001/dash/index.html
 *  --> to View jpg from /web/dash/view.html
 */

// <portnum(3001)> Setting
const portnum = 3001;

const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp')

const options = {
    defaultViewport: {
        width: 960,
        height: 540,
    },
    args: [
        '--window-size=960,540'
    ]
};

http.createServer(function (request, response) {
    const requrl = new URL('http://content' + request.url);
    if (requrl.pathname == '/screenshot.jpg') {
        (async () => {
            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            const shot_path = './screenshot/screenshot.' + (Math.random().toString(36).substr(2, 9)) + '.png';

            await page.goto(requrl.searchParams.get('url') || 'http://localhost:' + portnum + '/view.html');
            await page.waitForTimeout(3000);
            await page.screenshot({ path: shot_path });
            await browser.close();

            sharp(shot_path)
                .grayscale()
                .toFile(shot_path + '.jpg', (err, info) => {
                    if (err) {
                        throw err
                    }
                    fs.readFile(shot_path + '.jpg', function (error, content) {
                        response.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': Buffer.byteLength(content) });
                        response.end(content, 'utf-8');
                        fs.unlinkSync(shot_path);
                        fs.unlinkSync(shot_path + '.jpg');
                    });
                })
        })();
    } else {
        const filePath = './web' + request.url;

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end('404', 'utf-8');
                } else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            } else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });


    }


}).listen(portnum);