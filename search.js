const fs = require('fs');
const files = ['ads.js', 'merchant.js'];

['fetchAbsoluteJson', 'isNearbyOffersPrimaryUnsupported', 'emptyNearbyOffersResponse', 'markNearbyOffersPrimaryUnsupported'].forEach(func => {
    console.log(`Searching for ${func}...`);
    files.forEach(file => {
        const lines = fs.readFileSync(`app/lib/api/${file}`, 'utf8').split('\n');
        lines.forEach((line, i) => {
            if (line.includes(func) && !line.includes(`function ${func}`)) {
                console.log(`- Used in ${file}:${i + 1}`);
            }
        });
    });
});
