const fs = require('fs');

const path = 'app/faqs/page.js';
let content = fs.readFileSync(path, 'utf8');

// Line 12
content = content.replace(
    'track customer analytics, and scan customer QR codes to validate voucher redemptions.\\nFor Admins: Platform administrators manage merchant verifications, content moderation, user safety, and subscription plans."]',
    'track customer analytics, and scan customer QR codes to validate voucher redemptions."]'
);

// Line 13
content = content.replace(
    'Service Providers: Local professionals offering appointment-based services.\\nPlatform Administrators & Managers: Operations staff overseeing platform health, approvals, and security."]',
    'Service Providers: Local professionals offering appointment-based services."]'
);

// Line 31
content = content.replace(
    'GOLO supports three distinct account types:\\nCustomer Account: For shoppers exploring neighborhood deals, claiming vouchers, saving favorites, and chatting with merchants.\\nMerchant Account: For business owners creating digital storefronts, listing products, launching offers, and scanning vouchers.\\nAdmin Account: For platform operators managing compliance, verification, moderation, subscriptions, and system settings.',
    'GOLO supports two distinct account types:\\nCustomer Account: For shoppers exploring neighborhood deals, claiming vouchers, saving favorites, and chatting with merchants.\\nMerchant Account: For business owners creating digital storefronts, listing products, launching offers, and scanning vouchers.'
);

// Line 56
content = content.replace(
    'or administrative account suspension.',
    'or account suspension.'
);

// Line 58
content = content.replace(
    'The Admin Compliance Team will',
    'The Compliance Team will'
);

// Lines 61-75 (Admin FAQ Section)
const adminFaqRegex = /\{\s*id:"5-admin-faq"[\s\S]*?\]\},\n?/g;
content = content.replace(adminFaqRegex, '');

// Line 101
content = content.replace(
    'GOLO Admin moderators',
    'GOLO moderators'
);

// Line 113
content = content.replace(
    'for administrative mediation.',
    'for mediation.'
);

// Line 191
content = content.replace(
    'or admin moderation.',
    'or platform moderation.'
);

fs.writeFileSync(path, content);
console.log('FAQ updated successfully!');
