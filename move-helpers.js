const fs = require('fs');

const merchantPath = 'app/lib/api/merchant.js';
const adsPath = 'app/lib/api/ads.js';

let merchantContent = fs.readFileSync(merchantPath, 'utf8');
let adsContent = fs.readFileSync(adsPath, 'utf8');

const regex = /const LOCAL_BACKEND_URL = API_ORIGIN_URL;[\s\S]*?async function fetchAbsoluteJson\(url\) \{[\s\S]*?\}\n/g;

const match = merchantContent.match(regex);
if (match) {
    // Remove from merchant
    merchantContent = merchantContent.replace(regex, '');
    fs.writeFileSync(merchantPath, merchantContent);

    // Append to ads
    adsContent += '\n\n' + match[0];
    fs.writeFileSync(adsPath, adsContent);
    console.log('Moved helpers from merchant.js to ads.js');
} else {
    console.log('Regex did not match in merchant.js');
}
