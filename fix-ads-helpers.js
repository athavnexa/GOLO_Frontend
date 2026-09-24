const fs = require('fs');
const merchantPath = 'app/lib/api/merchant.js';
const adsPath = 'app/lib/api/ads.js';

let merchantCode = fs.readFileSync(merchantPath, 'utf8');
let adsCode = fs.readFileSync(adsPath, 'utf8');

const startStr = "const LOCAL_BACKEND_URL = API_ORIGIN_URL;";
const endStr = "export async function getPublicMerchantProfile";

const startIndex = merchantCode.indexOf(startStr);
const endIndex = merchantCode.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const helpersChunk = merchantCode.substring(startIndex, endIndex);
    
    // Remove from merchant
    merchantCode = merchantCode.substring(0, startIndex) + merchantCode.substring(endIndex);
    fs.writeFileSync(merchantPath, merchantCode);

    // Also ads.js needs API_ORIGIN_URL
    if (!adsCode.includes('API_ORIGIN_URL')) {
        adsCode = adsCode.replace(
            "import { apiClient } from './core';",
            "import { apiClient, API_ORIGIN_URL } from './core';"
        );
    }
    
    // Append to ads.js
    adsCode += '\n\n' + helpersChunk;
    fs.writeFileSync(adsPath, adsCode);

    console.log("Successfully moved helpers from merchant.js to ads.js");
} else {
    console.log("Could not find boundaries in merchant.js!");
}
