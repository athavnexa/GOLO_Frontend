const fs = require('fs');
const path = require('path');

const API_FILE = './app/lib/api.js';
const API_DIR = './app/lib/api';

if (!fs.existsSync(API_DIR)) {
  fs.mkdirSync(API_DIR, { recursive: true });
}

// 1. Read api.js
const code = fs.readFileSync(API_FILE, 'utf-8');

// 2. Define mappings
const mappings = {
  core: ['apiClient', 'getStoredAccessToken', 'getStoredRefreshToken', 'setStoredAuthTokens', 'clearStoredAuthTokens', 'API_BASE_URL', 'API_ORIGIN_URL'],
  auth: ['loginUser', 'socialAuthUser', 'validateMerchantStep', 'registerUser', 'refreshTokenApi', 'logoutUser', 'sendForgotPasswordOTP', 'verifyForgotPasswordOTP', 'resetForgotPassword', 'sendPasswordChangeOTP', 'verifyPasswordChangeOTP', 'changePasswordWithOTP', 'changePassword'],
  ads: ['getAllAds', 'searchAds', 'getAdById', 'getAdsByCategory', 'getFeaturedDeals', 'getTrendingSearches', 'getRecommendedDeals', 'getPopularPlaces', 'getNearbyAds', 'createAd', 'updateAd', 'deleteAd', 'cancelAd', 'trackAdView', 'trackAdContactClick', 'getNearbyOffers', 'getNearbyOfferDetails', 'searchMerchants', 'searchProducts', 'unifiedSearch'],
  user: ['getUserById', 'getProfile', 'updateProfile', 'getLoyaltyHistory', 'toggleWishlist', 'getWishlistIds', 'getWishlistAds', 'getNotifications', 'markNotificationRead', 'markAllNotificationsRead', 'clearAllNotifications', 'getIWantPreference', 'saveIWantPreference', 'savePreferredCategories', 'getMyAds', 'getAdsByUser', 'getAdWishlistCount', 'getMyVouchers', 'getVoucherById', 'getUserVouchers', 'getUserDealStatistics', 'deleteUserAccount'],
};

// Any function not in the above is considered 'merchant'
const coreImports = `import Cookies from 'js-cookie';\n\n`;

// Since splitting the AST precisely is very complex in a plain node script without Babel, 
// a highly effective strategy to avoid breaking the app (since "everything works properly") 
// while fully splitting the files for Tree Shaking is to copy the whole file into the 5 parts 
// and then prune the non-relevant exports from each.
// However, since we want to be clean, we will use a simpler approach:
// We will generate the 5 files, but to guarantee NO ERRORS and perfect tree-shaking, 
// we will just write the original code into all 5, but ONLY EXPORT the mapped functions from each!
// Wait, no, that duplicates the codebase 5 times.
// Let's do it properly by just creating a facade for now? No, user explicitly said "Split the 2000 line file".

// Let's write a simple regex-based splitter.
// We will split the file by "export "
const blocks = code.split(/(?=export (?:async )?(?:function|const|let) )/);

let files = {
  core: `import Cookies from 'js-cookie';\n`,
  auth: `import { apiClient, getStoredRefreshToken } from './core';\n`,
  ads: `import { apiClient } from './core';\nimport { updateProfile } from './user';\n`,
  user: `import { apiClient } from './core';\n`,
  merchant: `import { apiClient } from './core';\n`
};

blocks.forEach(block => {
  if (!block.startsWith('export ')) {
    // Add non-export code (like helpers, masks, constants) to core, as others depend on it
    files.core += block;
    return;
  }

  const match = block.match(/export (?:async )?(?:function|const) ([a-zA-Z0-9_]+)/);
  if (match) {
    const funcName = match[1];
    let foundGroup = 'merchant'; // default
    for (const [group, funcs] of Object.entries(mappings)) {
      if (funcs.includes(funcName)) {
        foundGroup = group;
        break;
      }
    }
    files[foundGroup] += block;
  } else {
    files.core += block;
  }
});

// Phase 3: Update Core to use Cookies
files.core = files.core.replace(
  /localStorage\.getItem\([^)]+\)/g,
  "(typeof window !== 'undefined' ? Cookies.get($1) : '')"
);
files.core = files.core.replace(
  /localStorage\.setItem\(([^,]+),\s*([^)]+)\)/g,
  "if (typeof window !== 'undefined') Cookies.set($1, $2, { expires: 7 })"
);
files.core = files.core.replace(
  /localStorage\.removeItem\(([^)]+)\)/g,
  "if (typeof window !== 'undefined') Cookies.remove($1)"
);

// Write files
Object.keys(files).forEach(group => {
  fs.writeFileSync(path.join(API_DIR, `${group}.js`), files[group]);
});

// 3. Update imports across the app
const reverseMapping = {};
for (const [group, funcs] of Object.entries(mappings)) {
  funcs.forEach(f => reverseMapping[f] = group);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]((?:\.\.\/)+lib\/api)['"]/g;
  
  let newContent = content.replace(importRegex, (match, importsStr, pathStr) => {
    const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const groups = { core: [], auth: [], ads: [], user: [], merchant: [] };
    
    imports.forEach(imp => {
      const baseName = imp.split(' as ')[0].trim();
      const group = reverseMapping[baseName] || 'merchant';
      groups[group].push(imp);
    });

    return Object.keys(groups)
      .filter(k => groups[k].length > 0)
      .map(k => `import { ${groups[k].join(', ')} } from "${pathStr}/${k}";`)
      .join('\n');
  });

  const aliasRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/app\/lib\/api['"]/g;
  newContent = newContent.replace(aliasRegex, (match, importsStr) => {
    const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const groups = { core: [], auth: [], ads: [], user: [], merchant: [] };
    imports.forEach(imp => {
      const baseName = imp.split(' as ')[0].trim();
      const group = reverseMapping[baseName] || 'merchant';
      groups[group].push(imp);
    });
    return Object.keys(groups)
      .filter(k => groups[k].length > 0)
      .map(k => `import { ${groups[k].join(', ')} } from "@/app/lib/api/${k}";`)
      .join('\n');
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated ' + filePath);
  }
}

function walkDir(dir) {
  const filesList = fs.readdirSync(dir);
  for (const file of filesList) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (fullPath.includes('node_modules') || fullPath.includes('.next')) continue;
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      if (!fullPath.includes('lib\\api')) {
        processFile(fullPath);
      }
    }
  }
}

walkDir('./app');
console.log('Refactor complete.');
