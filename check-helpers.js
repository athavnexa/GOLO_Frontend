const fs = require('fs');
const files = ['core.js', 'auth.js', 'ads.js', 'user.js', 'merchant.js'];

const helpers = [
    'buildLegacyPromotionPayload',
    'isNonWhitelistedPayloadError',
    'getPromotionRowId',
    'readTrackedOfferPromotionIds',
    'writeTrackedOfferPromotionIds',
    'rememberOfferPromotionId',
    'forgetOfferPromotionId',
    'isOfferRow',
    'loadRazorpayScript',
    'OFFER_PROMOTION_IDS_KEY'
];

helpers.forEach(helper => {
    let definedIn = null;
    let usedIn = new Set();
    
    files.forEach(file => {
        const content = fs.readFileSync(`app/lib/api/${file}`, 'utf8');
        const lines = content.split('\n');
        
        let hasDef = false;
        lines.forEach(line => {
            if (line.includes(`function ${helper}`) || line.includes(`const ${helper} =`)) {
                hasDef = true;
            } else if (line.includes(helper)) {
                usedIn.add(file);
            }
        });
        
        if (hasDef) definedIn = file;
    });
    
    console.log(`${helper}: defined in ${definedIn}, used in ${Array.from(usedIn).join(', ')}`);
});
