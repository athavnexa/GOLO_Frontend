const fs = require('fs');

const path = 'app/user-guide/page.js';
let content = fs.readFileSync(path, 'utf8');

// Replace exposed routes
content = content.replace(/<code>\/register<\/code>/g, 'the Registration page');
content = content.replace(/<code>\/merchant-register<\/code>/g, 'the Merchant Portal');
content = content.replace(/at <code>\/login<\/code>\./g, 'on the Login page.');
content = content.replace(/via <code>\/merchant-login<\/code>/g, 'via the Merchant Login page');
content = content.replace(/\(<code>\/profile\/\[id\]<\/code>\)/g, '(or by clicking your profile name)');
content = content.replace(/on <code>\/login<\/code> screen\./g, 'on the Login screen.');
content = content.replace(/on <code>\/merchant-login<\/code>\./g, 'on the Merchant Login screen.');

// Replace Admin references
content = content.replace(/<strong>Admin Approval:<\/strong>/g, '<strong>Profile Verification:</strong>');
content = content.replace(/GSTIN, PAN, Bank KYC \+ Admin Review/g, 'GSTIN, PAN, Bank KYC + Platform Verification');
content = content.replace(/Order\/ledger clearance \+ admin handshake/g, 'Order/ledger clearance + final settlement');

fs.writeFileSync(path, content);
console.log('User guide updated successfully!');
