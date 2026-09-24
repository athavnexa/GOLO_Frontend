const fs = require('fs');
['faqs', 'user-guide'].forEach(page => {
    const path = 'app/' + page + '/page.js';
    let content = fs.readFileSync(path, 'utf8');
    
    // We want to replace the broken backtick structure:
    // `        /* Responsive Overrides */ ... }</style>
    
    // Find the index of `        /* Responsive Overrides */
    const resOverridesIdx = content.indexOf('`        /* Responsive Overrides */');
    
    if (resOverridesIdx !== -1) {
        // Find the index of }</style>
        const styleEndIdx = content.indexOf('}</style>', resOverridesIdx);
        
        if (styleEndIdx !== -1) {
            // Reconstruct perfectly
            const before = content.substring(0, resOverridesIdx);
            const inside = content.substring(resOverridesIdx + 1, styleEndIdx).trimRight(); // exclude the initial backtick
            const after = content.substring(styleEndIdx + 9);
            
            const fixedContent = before + '\n' + inside + '\n      `}</style>' + after;
            fs.writeFileSync(path, fixedContent);
            console.log('Fixed ' + path);
        }
    } else {
        console.log('Could not find marker in ' + path);
    }
});
