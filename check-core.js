const fs = require('fs');
const files = ['auth.js', 'ads.js', 'user.js', 'merchant.js'];

['ACCESS_TOKEN_STORAGE_KEY', 'REFRESH_TOKEN_STORAGE_KEY', 'BASE_URL', '_maskCloudinaryDeep'].forEach(sym => {
    files.forEach(file => {
        const content = fs.readFileSync(`app/lib/api/${file}`, 'utf8');
        if (content.includes(sym)) {
            console.log(`Warning: ${sym} used in ${file} but it's internal to core.js!`);
        }
    });
});
