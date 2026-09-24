const fs = require('fs');

const faqsStyle = `
        /* Responsive Overrides */
        @media (max-width: 900px) {
            .faq-layout-container {
                flex-direction: column !important;
            }
            .faq-sidebar {
                width: 100% !important;
                position: static !important;
                height: auto !important;
                border-right: none !important;
                border-bottom: 1px solid var(--fq-b) !important;
                display: block !important;
            }
            main {
                padding: 24px 16px !important;
            }
        }
`;

const userGuideStyle = `
        /* Responsive Overrides */
        @media (max-width: 900px) {
            .app-container {
                flex-direction: column !important;
            }
            .sidebar {
                width: 100% !important;
                position: static !important;
                height: auto !important;
                border-right: none !important;
                border-bottom: 1px solid var(--border-color) !important;
            }
            .content {
                padding: 24px 16px !important;
            }
            .roles-grid {
                grid-template-columns: 1fr !important;
            }
        }
`;

function injectStyle(filePath, newStyle) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // For faqs/page.js which has existing mobile hidden logic, let's remove it
    if (filePath.includes('faqs')) {
        content = content.replace(/@media\(max-width:900px\)\{\.faq-sidebar\{display:none!important\}main\{padding:24px 20px!important\}\}/g, '');
    }

    // Inject before </style>
    const styleCloseIndex = content.lastIndexOf('</style>');
    if (styleCloseIndex !== -1) {
        content = content.substring(0, styleCloseIndex) + newStyle + content.substring(styleCloseIndex);
        
        if (filePath.includes('faqs')) {
             content = content.replace('<div style={{ display:"flex", position:"relative", zIndex:10 }}>', '<div className="faq-layout-container" style={{ display:"flex", position:"relative", zIndex:10 }}>');
        }
        
        fs.writeFileSync(filePath, content);
        console.log("Successfully updated " + filePath);
    } else {
        console.error("Could not find </style> in " + filePath);
    }
}

injectStyle('app/faqs/page.js', faqsStyle);
injectStyle('app/user-guide/page.js', userGuideStyle);
