"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserGuidePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Original JS logic ported directly
    
    // Theme toggle removed
    // Search Filter
        const searchInput = document.getElementById('guideSearch');
        const guideSections = document.querySelectorAll('.guide-section');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            guideSections.forEach(section => {
                const text = section.innerText.toLowerCase();
                if (!query || text.includes(query)) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });

        // Stakeholder / Role Filter Chips
        const roleChips = document.querySelectorAll('.role-chip');
        const roleCards = document.querySelectorAll('.role-card');
        const rolesGrids = document.querySelectorAll('.roles-grid');

        roleChips.forEach(chip => {
            chip.addEventListener('click', () => {
                roleChips.forEach(c => {
                    c.className = 'role-chip';
                });

                const role = chip.getAttribute('data-role');
                if (role === 'all') {
                    chip.classList.add('active-all');
                } else if (role === 'user') {
                    chip.classList.add('active-user');
                } else if (role === 'choja') {
                    chip.classList.add('active-choja');
                } else if (role === 'merchant') {
                    chip.classList.add('active-merchant');
                }

                roleCards.forEach(card => {
                    const cardRole = card.getAttribute('data-role-type');
                    if (role === 'all' || cardRole === role) {
                        card.classList.remove('hidden-card');
                    } else {
                        card.classList.add('hidden-card');
                    }
                });

                rolesGrids.forEach(grid => {
                    if (role === 'all') {
                        grid.classList.remove('single-col');
                    } else {
                        grid.classList.add('single-col');
                    }
                });
            });
        });

        // Active Navigation Highlight on Scroll
        window.addEventListener('scroll', () => {
            let current = '';
            guideSections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 120) {
                    current = section.getAttribute('id');
                }
            });

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="user-guide-wrapper" style={{ minHeight:"100vh", background:"transparent", position:"relative", zIndex:10 }}>
      <Navbar />
      <div style={{ position:"relative", zIndex:10, background:"transparent" }}>
        <div className="app-container">
        {/*  Sidebar Navigation  */}
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-logo">G</div>
                <div>
                    <div className="brand-title">GOLO Docs</div>
                    <div className="brand-subtitle">3-Sided Guides</div>
                </div>
            </div>

            {/*  Search  */}
            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input type="text" id="guideSearch" className="search-input" placeholder="Search 15 guides..." />
            </div>

            {/*  Role Filter Chips  */}
            <div className="role-filters">
                <span className="role-filters-label">Filter by Stakeholder</span>
                <div className="role-chips">
                    <button className="role-chip active-all" data-role="all">All Roles</button>
                    <button className="role-chip" data-role="user">GOLO User</button>
                    <button className="role-chip" data-role="choja">Choja (C2C)</button>
                    <button className="role-chip" data-role="merchant">Merchant</button>
                </div>
            </div>

            {/*  Navigation Links  */}
            <nav className="nav-sections" id="navSections">
                <span className="nav-title">Guides Index (15 Modules)</span>
                <a href="#guide-1" className="nav-link active"><span>1. Registration</span> <span className="nav-badge">P0</span></a>
                <a href="#guide-2" className="nav-link"><span>2. Login</span> <span className="nav-badge">P0</span></a>
                <a href="#guide-3" className="nav-link"><span>3. Profile Mgmt</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-4" className="nav-link"><span>4. Address Mgmt</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-5" className="nav-link"><span>5. Product Search</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-6" className="nav-link"><span>6. Product Browsing</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-7" className="nav-link"><span>7. Product Details</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-8" className="nav-link"><span>8. Refund & Credit</span> <span className="nav-badge">P0</span></a>
                <a href="#guide-9" className="nav-link"><span>9. Review & Rating</span> <span className="nav-badge">P2</span></a>
                <a href="#guide-10" className="nav-link"><span>10. Wishlist</span> <span className="nav-badge">P2</span></a>
                <a href="#guide-11" className="nav-link"><span>11. Coupon & Voucher</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-12" className="nav-link"><span>12. Offers Guide</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-13" className="nav-link"><span>13. Notifications</span> <span className="nav-badge">P2</span></a>
                <a href="#guide-14" className="nav-link"><span>14. Account Deactivation</span> <span className="nav-badge">P1</span></a>
                <a href="#guide-15" className="nav-link"><span>15. Password Reset</span> <span className="nav-badge">P0</span></a>
                <a href="#guide-matrix" className="nav-link"><span>16. Cross-Role Matrix</span> <span className="nav-badge">Ref</span></a>
            </nav>
        </aside>

        {/*  Main Content  */}
        <main className="content">
            <header className="doc-header">
                <h1 className="doc-title">GOLO Operational Guides</h1>
                <p className="doc-description">
                    Complete end-to-end operational documentation across all 15 core features for the 3 key stakeholders of the GOLO ecosystem: 
                    <strong>GOLO User (Shopper)</strong>, <strong>Choja (Classifieds / C2C)</strong>, and <strong>Merchant (Retailer / Store Owner)</strong>.
                </p>
                <div className="meta-tags">
                    <span className="meta-pill pill-user">🔵 GOLO User (Shopper)</span>
                    <span className="meta-pill pill-choja">🟣 Choja (Classifieds / C2C)</span>
                    <span className="meta-pill pill-merchant">🟠 Merchant (Store Owner)</span>
                    <span className="meta-pill">v2.0 Official</span>
                    <span className="meta-pill">NexaPrime Pvt. Ltd.</span>
                </div>
            </header>

            {/*  Guide 1: Registration  */}
            <section className="guide-section" id="guide-1">
                <div className="section-header">
                    <span className="section-num">01</span>
                    <h2 className="section-title">Customer Registration Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <div className="step-list">
                            <div className="step-item"><span className="step-number">1</span><div className="step-content"><strong>Access Registration:</strong> Open the GOLO app or visit the Registration page on the web.</div></div>
                            <div className="step-item"><span className="step-number">2</span><div className="step-content"><strong>Enter Details:</strong> Provide Full Legal Name, active Mobile Number, valid Email, and secure Password.</div></div>
                            <div className="step-item"><span className="step-number">3</span><div className="step-content"><strong>Mobile Verification:</strong> Request SMS OTP. A 6-digit verification passcode is delivered instantly.</div></div>
                            <div className="step-item"><span className="step-number">4</span><div className="step-content"><strong>Consent & Activate:</strong> Enter OTP, accept Terms & Privacy Policy, and activate the account.</div></div>
                        </div>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <div className="step-list">
                            <div className="step-item"><span className="step-number">1</span><div className="step-content"><strong>Single Sign-On (SSO):</strong> Existing GOLO shoppers automatically have Choja credentials; no second account needed.</div></div>
                            <div className="step-item"><span className="step-number">2</span><div className="step-content"><strong>Seller Setup:</strong> Tap "Post Free Ad" or "Choja Tab". Choose your city and neighborhood (e.g. Rajarampuri).</div></div>
                            <div className="step-item"><span className="step-number">3</span><div className="step-content"><strong>Contact Preferences:</strong> Choose whether your phone number is displayed or restricted to in-app chat.</div></div>
                            <div className="step-item"><span className="step-number">4</span><div className="step-content"><strong>Trust Verification:</strong> Complete mobile OTP verification before publishing your first classified ad.</div></div>
                        </div>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <div className="step-list">
                            <div className="step-item"><span className="step-number">1</span><div className="step-content"><strong>Merchant Onboarding:</strong> Visit the Merchant Portal or select "Become a GOLO Merchant".</div></div>
                            <div className="step-item"><span className="step-number">2</span><div className="step-content"><strong>Business Profile:</strong> Enter Legal Business Name, Trade Name, Store Category, and Physical Address.</div></div>
                            <div className="step-item"><span className="step-number">3</span><div className="step-content"><strong>Statutory KYC:</strong> Upload GSTIN (or declaration), Business PAN, and Shop License / FSSAI.</div></div>
                            <div className="step-item"><span className="step-number">4</span><div className="step-content"><strong>Bank Details:</strong> Provide Account Number, IFSC, and Cancelled Cheque for automated payout settlements.</div></div>
                            <div className="step-item"><span className="step-number">5</span><div className="step-content"><strong>Profile Verification:</strong> GOLO audits KYC within 24–48 hours to unlock the Merchant Console.</div></div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Guide 2: Login  */}
            <section className="guide-section" id="guide-2">
                <div className="section-header">
                    <span className="section-num">02</span>
                    <h2 className="section-title">Login Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Standard Password Login:</strong> Enter Mobile Number/Email and Password on the Login page.</li>
                            <li className="bullet-item"><strong>Passwordless OTP Login:</strong> Select "Login with OTP" for instant 6-digit SMS verification.</li>
                            <li className="bullet-item"><strong>Social Authentication:</strong> 1-tap Google or Apple ID sign-in on supported devices.</li>
                            <li className="bullet-item"><strong>Session Persistence:</strong> "Remember Me" maintains session token for 30 days on trusted devices.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Unified Single Sign-On:</strong> Seamless session transfer when navigating between GOLO store and Choja classifieds.</li>
                            <li className="bullet-item"><strong>Guest Browsing:</strong> Browse ads freely; attempting to Chat, Call, or Post triggers a contextual in-line login modal.</li>
                            <li className="bullet-item"><strong>Multi-Device Sync:</strong> Active chats and saved listings automatically sync across all logged-in devices.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Dedicated Merchant Console:</strong> Access via the Merchant Login page or the GOLO Merchant App.</li>
                            <li className="bullet-item"><strong>Two-Factor Authentication (2FA):</strong> Mandatory OTP on unrecognized devices or IP addresses.</li>
                            <li className="bullet-item"><strong>Role-Based Staff Access (RBAC):</strong> Restricted sub-accounts for billing cashiers (scanning only, no financial ledgers).</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 3: Profile Management  */}
            <section className="guide-section" id="guide-3">
                <div className="section-header">
                    <span className="section-num">03</span>
                    <h2 className="section-title">Profile Management Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Profile Center:</strong> Open Profile from bottom navigation or top avatar (or by clicking your profile name).</li>
                            <li className="bullet-item"><strong>Personal Information:</strong> Edit Full Name, Alternate Phone, Date of Birth, Gender, and Profile Avatar.</li>
                            <li className="bullet-item"><strong>Communication Channels:</strong> Toggle WhatsApp order updates, promotional SMS, and email newsletters.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Public Seller Bio:</strong> Add personal bio, display "Verified Seller" badge, and show average response time.</li>
                            <li className="bullet-item"><strong>Privacy Shield:</strong> Mask your phone number to direct inquiries exclusively through encrypted in-app chat.</li>
                            <li className="bullet-item"><strong>Listings Console:</strong> Monitor active ads, drafts, expired listings, and total buyer inquiries.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Storefront Branding:</strong> Upload Store Logo, 16:9 Hero Banner, and showroom aisle photos.</li>
                            <li className="bullet-item"><strong>Operating Hours:</strong> Configure daily opening/closing times, weekly holidays, and emergency close toggle.</li>
                            <li className="bullet-item"><strong>Live Announcements:</strong> Post store announcements (e.g., "Fresh organic vegetables restocked").</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 4: Address Management  */}
            <section className="guide-section" id="guide-4">
                <div className="section-header">
                    <span className="section-num">04</span>
                    <h2 className="section-title">Address Management Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Saved Addresses:</strong> Go to Profile &rarr; Manage Addresses. Tag as Home, Work, or Other.</li>
                            <li className="bullet-item"><strong>GPS Pinpoint:</strong> Drag-and-drop map pin for precise doorstep delivery accuracy.</li>
                            <li className="bullet-item"><strong>Default Shipping:</strong> Select a default destination for 1-click rapid checkout.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Neighborhood Tagging:</strong> Classifieds require locality tagging (e.g. Shahupuri) instead of home addresses for privacy.</li>
                            <li className="bullet-item"><strong>Public Meetup Landmarks:</strong> System suggests safe, well-lit public landmarks (malls, civic centers) for item inspection.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Physical Store Coordinates:</strong> Store GPS latitude and longitude pinned for turn-by-turn customer navigation.</li>
                            <li className="bullet-item"><strong>Delivery Radius:</strong> Define self-delivery or courier fulfillment boundary polygon (e.g. 0–7 km).</li>
                            <li className="bullet-item"><strong>Branch Management:</strong> Manage multiple retail outlets and localized inventory pools from one master login.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 5: Product Search  */}
            <section className="guide-section" id="guide-5">
                <div className="section-header">
                    <span className="section-num">05</span>
                    <h2 className="section-title">Product Search Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Smart Search Bar:</strong> Autocomplete support for brand names, keywords, and local spellings (Marathi/Hindi/English).</li>
                            <li className="bullet-item"><strong>"I Want" Assistant:</strong> Natural language intent matching (e.g. "pure ghee 1kg") that routes to nearby stockists.</li>
                            <li className="bullet-item"><strong>Faceted Filters:</strong> Filter by Proximity (2 km, 5 km), Rating (4+ Stars), Price, and Discount percentage.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Classified Channels:</strong> Search Vehicles, Real Estate, Mobiles, Electronics, Furniture, Jobs, Services, Pets.</li>
                            <li className="bullet-item"><strong>Deep Sub-Filters:</strong> Filter cars by year/fuel/transmission, properties by BHK/carpet area, and jobs by salary.</li>
                            <li className="bullet-item"><strong>Budget Sliders:</strong> Custom Min and Max price sliders to find pre-owned deals within budget.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Catalog Search:</strong> Search internal store inventory by SKU, EAN/UPC Barcode, Product Title, or Category.</li>
                            <li className="bullet-item"><strong>Barcode Scanner:</strong> Fast mobile camera or USB barcode reader integration for instant item lookup.</li>
                            <li className="bullet-item"><strong>Stock Filters:</strong> Instant filtering for "Out of Stock", "Low Stock (&lt;5)", and "Active Deals".</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 6: Product Browsing  */}
            <section className="guide-section" id="guide-6">
                <div className="section-header">
                    <span className="section-num">06</span>
                    <h2 className="section-title">Product Browsing Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Curated Feeds:</strong> Explore Nearby Deals, Top Savings in City, Flash Offers, and Supermarket Aisles.</li>
                            <li className="bullet-item"><strong>Merchant Storefronts:</strong> Tap merchant cards to browse full virtual shop aisles with store-exclusive vouchers.</li>
                            <li className="bullet-item"><strong>Recently Viewed:</strong> Resume viewing items previously inspected across sessions.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Visual Listing Grid:</strong> High-res photo cards showing price, title, locality, and publish date.</li>
                            <li className="bullet-item"><strong>Listing Badges:</strong> Spot "Featured", "Urgent Sale", and "Price Negotiable" classifieds at a glance.</li>
                            <li className="bullet-item"><strong>Map Discovery:</strong> Interactive map mode displaying classified listings located within walking distance.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Customer View Toggle:</strong> Preview exactly how your products, images, and prices appear to consumers.</li>
                            <li className="bullet-item"><strong>Category Organization:</strong> Organize stock into custom seasonal aisles (e.g. "Festive Specials", "Clearance").</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 7: Product Details  */}
            <section className="guide-section" id="guide-7">
                <div className="section-header">
                    <span className="section-num">07</span>
                    <h2 className="section-title">Product Details Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Price & Savings Breakdown:</strong> Transparent MRP, GOLO Offer Price, and calculated net savings (₹ and %).</li>
                            <li className="bullet-item"><strong>Specifications:</strong> Net weight, ingredients, manufacturer, expiry date, and return policy coverage.</li>
                            <li className="bullet-item"><strong>Store Context:</strong> Merchant name, distance in km, store rating, and operational hours.</li>
                            <li className="bullet-item"><strong>Call to Action:</strong> Claim Discount Voucher, Add to Cart, Buy Now, or Message Store.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Item Condition:</strong> Transparent grading (Brand New, Like New, Good, Fair), age, and invoice availability.</li>
                            <li className="bullet-item"><strong>Direct Negotiation:</strong> In-app chat, masked phone calling, and direct counter-offer submission.</li>
                            <li className="bullet-item"><strong>Safety Advisory:</strong> Persistent warning reminding buyers to verify goods physically before making payment.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Listing Wizard:</strong> Configure Title, Category, Sub-Category, Brand, Description, and photo gallery.</li>
                            <li className="bullet-item"><strong>Multi-Variant Setup:</strong> Define Size, Color, Flavor, or Weight variations with independent barcodes and stock.</li>
                            <li className="bullet-item"><strong>Tax & GST:</strong> Set HSN/SAC codes and applicable GST slabs (0%, 5%, 12%, 18%, 28%).</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 8: Refund & Credit Note  */}
            <section className="guide-section" id="guide-8">
                <div className="section-header">
                    <span className="section-num">08</span>
                    <h2 className="section-title">Refund & Credit Note Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Eligibility:</strong> Damaged goods, expired items, missing items, or merchant cancellation.</li>
                            <li className="bullet-item"><strong>Claim Window:</strong> Submit request within 24–48 hours via My Orders &rarr; Request Refund with photos.</li>
                            <li className="bullet-item"><strong>Reimbursement:</strong> Reversal to original bank/UPI account in 5–7 days, or instant GOLO Wallet credit.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>P2P Exchange:</strong> Discovery platform only; cash transactions are private. Physical inspection is mandatory.</li>
                            <li className="bullet-item"><strong>Paid Boost Refunds:</strong> If a paid ad boost fails due to system error, 100% refund is processed within 3–5 days.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Review SLA:</strong> Review active return claims within 24 hours in the Merchant Console.</li>
                            <li className="bullet-item"><strong>Action Choices:</strong> Approve full/partial refund, issue store credit note, or reject with photographic evidence.</li>
                            <li className="bullet-item"><strong>Reconciliation:</strong> All adjustments and commission credits appear on weekly settlement ledgers.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 9: Review & Rating  */}
            <section className="guide-section" id="guide-9">
                <div className="section-header">
                    <span className="section-num">09</span>
                    <h2 className="section-title">Review & Rating Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Verified Buyers Only:</strong> Only shoppers with completed orders or redeemed vouchers can rate.</li>
                            <li className="bullet-item"><strong>Rating Dimensions:</strong> 1 to 5 Stars on Product Quality, Merchant Service, and Delivery Speed.</li>
                            <li className="bullet-item"><strong>Photos & Feedback:</strong> Attach real unboxing photos to guide fellow community shoppers.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Peer Trust Scores:</strong> Mutual post-deal ratings on communication, reliability, and authenticity.</li>
                            <li className="bullet-item"><strong>Safety Flagging:</strong> Tap "Report Ad" to flag suspicious listings, scams, or offensive content.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Reputation Hub:</strong> Real-time visibility into all customer reviews and ratings.</li>
                            <li className="bullet-item"><strong>Public Replies:</strong> Post professional merchant responses to praise or customer grievances.</li>
                            <li className="bullet-item"><strong>Visibility Boosts:</strong> Maintaining 4.3+ stars unlocks home feed priority and "Top Rated" store badges.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 10: Wishlist  */}
            <section className="guide-section" id="guide-10">
                <div className="section-header">
                    <span className="section-num">10</span>
                    <h2 className="section-title">Wishlist & Saved Items Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>1-Tap Heart:</strong> Tap Heart icon on any product, deal, or merchant card to save.</li>
                            <li className="bullet-item"><strong>Price Drop Alerts:</strong> Automated push notifications when a wishlisted item goes on sale.</li>
                            <li className="bullet-item"><strong>Move to Cart:</strong> 1-click transfer from wishlist directly into the shopping cart.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Bookmark Classifieds:</strong> Save listings into "Saved Ads" to compare options.</li>
                            <li className="bullet-item"><strong>Price Cut Alerts:</strong> Get notified if the seller lowers the asking price.</li>
                            <li className="bullet-item"><strong>Sold Updates:</strong> Automatic alerts when a saved listing is sold or removed.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Demand Analytics:</strong> See aggregated data on which products are most wishlisted nearby.</li>
                            <li className="bullet-item"><strong>Targeted Discounts:</strong> Launch flash deals on high-wishlist items to drive instant store footfalls.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 11: Coupon & Voucher  */}
            <section className="guide-section" id="guide-11">
                <div className="section-header">
                    <span className="section-num">11</span>
                    <h2 className="section-title">Coupon & Voucher Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Claiming Deals:</strong> Tap "Claim Voucher" to generate a digital voucher with an alphanumeric code and QR code.</li>
                            <li className="bullet-item"><strong>Voucher Wallet:</strong> Manage active vouchers under Profile &rarr; Active Vouchers.</li>
                            <li className="bullet-item"><strong>Dual Redemption:</strong> Show QR code at store counter for billing discounts, or apply promo code online.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Ad Upgrade Promos:</strong> Apply discount coupon codes when purchasing ad boosts or featured listings.</li>
                            <li className="bullet-item"><strong>Seasonal Credits:</strong> Redeem festive credits for free listing bumps.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Coupon Wizard:</strong> Configure Percentage (%) or Flat (₹) discounts and Minimum Order Values.</li>
                            <li className="bullet-item"><strong>Usage Limits:</strong> Set campaign budget caps, daily limits, and per-user redemption caps.</li>
                            <li className="bullet-item"><strong>Counter Scanner:</strong> Use GOLO Merchant App's built-in camera to validate customer voucher QR codes in 2 seconds.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 12: Offers & Promotions  */}
            <section className="guide-section" id="guide-12">
                <div className="section-header">
                    <span className="section-num">12</span>
                    <h2 className="section-title">Offers & Promotions Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Nearby Deals:</strong> Live discounts sorted by walking or driving distance.</li>
                            <li className="bullet-item"><strong>Deal Formats:</strong> Flash sales with countdown timers, BOGO bundles, and clearance discounts.</li>
                            <li className="bullet-item"><strong>Interactive Map:</strong> Spot high-discount clusters and participating retail hubs across town.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Spotlight Listing:</strong> Pin classifieds at the top of category searches for 7 or 30 days.</li>
                            <li className="bullet-item"><strong>Urgent Tag:</strong> Bold red badge to signal readiness for quick cash negotiations.</li>
                            <li className="bullet-item"><strong>Auto-Bump:</strong> Automatically refresh ad publication timestamp every 3 days.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Campaign Studio:</strong> Launch custom flash discounts, bundle deals, and clearance banners.</li>
                            <li className="bullet-item"><strong>Geo-Fenced Banners:</strong> Book top carousel app banners targeted at customers in selected pin codes.</li>
                            <li className="bullet-item"><strong>ROI Tracking:</strong> Measure impressions, clicks, vouchers claimed, and actual billing generated.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 13: Notifications  */}
            <section className="guide-section" id="guide-13">
                <div className="section-header">
                    <span className="section-num">13</span>
                    <h2 className="section-title">Notifications Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Multi-Channel:</strong> Push Notifications, SMS, WhatsApp, and in-app Notification Center.</li>
                            <li className="bullet-item"><strong>Transactional Stages:</strong> Order Placed, Confirmed, Packed, Out for Delivery, and Delivered.</li>
                            <li className="bullet-item"><strong>Custom Control:</strong> Silence promotional alerts while keeping mandatory security notices active.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Buyer Inquiries:</strong> Instant push alerts when prospective buyers send a message or counter-offer.</li>
                            <li className="bullet-item"><strong>Ad Lifecycle:</strong> Reminders when ads are approved or nearing 30-day expiration.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Audible Order Chime:</strong> Loud audio chime on Merchant App for incoming orders requiring confirmation within 5 minutes.</li>
                            <li className="bullet-item"><strong>Operational Reminders:</strong> Low inventory alerts and unhandled return requests.</li>
                            <li className="bullet-item"><strong>Payout Confirmations:</strong> Instant notices when daily/weekly bank payouts are dispatched.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 14: Account Deactivation  */}
            <section className="guide-section" id="guide-14">
                <div className="section-header">
                    <span className="section-num">14</span>
                    <h2 className="section-title">Account Deactivation Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Self-Service:</strong> Go to Profile &rarr; Settings &rarr; Security & Privacy &rarr; Deactivate or Delete Account.</li>
                            <li className="bullet-item"><strong>Options:</strong> Temporary pause hides profile; permanent deletion purges personal data within 30 days.</li>
                            <li className="bullet-item"><strong>Pre-requisites:</strong> All orders in transit and pending refunds must be resolved first.</li>
                        </ul>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Pause Classifieds:</strong> Temporarily pause active ads with 1 click without closing the main account.</li>
                            <li className="bullet-item"><strong>Unpublishing:</strong> Account deactivation immediately unpublishes all live classifieds and disables chat threads.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Formal Offboarding:</strong> Request store closure via Merchant Dashboard &rarr; Store Settings.</li>
                            <li className="bullet-item"><strong>Fulfillment:</strong> Fulfill all pending orders, honor active vouchers, and resolve return requests.</li>
                            <li className="bullet-item"><strong>Settlement Audit:</strong> Audit ledgers, release final balances, and unlist storefront permanently.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/*  Guide 15: Password Reset  */}
            <section className="guide-section" id="guide-15">
                <div className="section-header">
                    <span className="section-num">15</span>
                    <h2 className="section-title">Password Reset Guide</h2>
                </div>
                <div className="roles-grid">
                    <div className="role-card role-user" data-role-type="user">
                        <div className="role-header">
                            <span className="role-title-badge">🔵 GOLO User</span>
                            <span className="role-persona">Consumer / Shopper</span>
                        </div>
                        <div className="step-list">
                            <div className="step-item"><span className="step-number">1</span><div className="step-content"><strong>Forgot Password:</strong> Tap "Forgot Password?" on the Login screen.</div></div>
                            <div className="step-item"><span className="step-number">2</span><div className="step-content"><strong>Identifier:</strong> Enter registered Mobile Number or Email Address.</div></div>
                            <div className="step-item"><span className="step-number">3</span><div className="step-content"><strong>Verification:</strong> Receive 6-digit SMS OTP or secure password reset email link.</div></div>
                            <div className="step-item"><span className="step-number">4</span><div className="step-content"><strong>Set New Password:</strong> Enter and confirm new password. All prior sessions are logged out.</div></div>
                        </div>
                    </div>

                    <div className="role-card role-choja" data-role-type="choja">
                        <div className="role-header">
                            <span className="role-title-badge">🟣 Choja</span>
                            <span className="role-persona">Classifieds / C2C Poster</span>
                        </div>
                        <ul className="bullet-list">
                            <li className="bullet-item"><strong>Unified Sync:</strong> Resetting your GOLO customer password updates Choja authentication across all devices.</li>
                            <li className="bullet-item"><strong>In-App Reset:</strong> Password recovery can be triggered directly from any Choja auth prompt.</li>
                        </ul>
                    </div>

                    <div className="role-card role-merchant" data-role-type="merchant">
                        <div className="role-header">
                            <span className="role-title-badge">🟠 Merchant</span>
                            <span className="role-persona">Retailer / Store Owner</span>
                        </div>
                        <div className="step-list">
                            <div className="step-item"><span className="step-number">1</span><div className="step-content"><strong>Store Recovery:</strong> Click "Forgot Store Password?" on the Merchant Login screen.</div></div>
                            <div className="step-item"><span className="step-number">2</span><div className="step-content"><strong>Business Check:</strong> Enter registered Merchant Business Email and Store ID.</div></div>
                            <div className="step-item"><span className="step-number">3</span><div className="step-content"><strong>Reset Token + 2FA:</strong> Time-limited token link (15 min validity) + mandatory 2FA mobile OTP.</div></div>
                            <div className="step-item"><span className="step-number">4</span><div className="step-content"><strong>Audit Logging:</strong> Create new strong password; security alert is dispatched to store owner.</div></div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Guide Matrix  */}
            <section className="guide-section" id="guide-matrix">
                <div className="section-header">
                    <span className="section-num">16</span>
                    <h2 className="section-title">Cross-Role Operational Matrix</h2>
                </div>
                <div className="matrix-container">
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th>Operational Dimension</th>
                                <th className="col-user">🔵 GOLO User (Shopper)</th>
                                <th className="col-choja">🟣 Choja (Classifieds)</th>
                                <th className="col-merchant">🟠 Merchant (Retailer)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="matrix-dimension">Primary Identifier</td>
                                <td>Mobile Number / Email</td>
                                <td>Linked GOLO User ID</td>
                                <td>Store ID + Business Email</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Registration & KYC</td>
                                <td>Mobile/Email + SMS OTP</td>
                                <td>Unified SSO + Locality Setup</td>
                                <td>GSTIN, PAN, Bank KYC + Platform Verification</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Authentication</td>
                                <td>Password / OTP / Social 1-tap</td>
                                <td>Unified Single Sign-On (SSO)</td>
                                <td>Store Credentials + Mandatory 2FA</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Profile Control</td>
                                <td>Personal data, avatar, privacy</td>
                                <td>Public bio, verified badge, phone hide</td>
                                <td>Store branding, hours, catalog categories</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Location Mapping</td>
                                <td>Doorstep GPS pin + Home/Work tag</td>
                                <td>Neighborhood / meeting landmark tag</td>
                                <td>Store GPS coords + delivery radius</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Search Engine</td>
                                <td>Keyword, voice, "I Want" intent</td>
                                <td>Category & attribute sub-filters</td>
                                <td>SKU, barcode scanner, inventory filter</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Browsing Mode</td>
                                <td>Nearby deals, aisles, store cards</td>
                                <td>Classifieds photo grid, urgent badges</td>
                                <td>Catalog view, stock audit, category tree</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Item Interaction</td>
                                <td>Claim voucher, add to cart, buy</td>
                                <td>In-app chat, call seller, make offer</td>
                                <td>Add/edit item, variants, pricing, GST</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Refunds & Claims</td>
                                <td>24–48h SLA, original mode/wallet</td>
                                <td>Inspection before pay; ad fee refunds</td>
                                <td>24h review SLA, credit note issuance</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Reviews & Rating</td>
                                <td>Verified 1–5 stars + photo upload</td>
                                <td>Peer trust ratings & safety reports</td>
                                <td>Public store reply & rating score</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Wishlist / Saved</td>
                                <td>Saved items with price drop alerts</td>
                                <td>Saved ads with price cut alerts</td>
                                <td>Demand analytics & targeted coupons</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Coupons / Vouchers</td>
                                <td>Cart promo codes & in-store QR</td>
                                <td>Listing boost promo vouchers</td>
                                <td>Coupon creation wizard & QR scanner</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Promotions</td>
                                <td>Flash sales, BOGO, nearby vouchers</td>
                                <td>Spotlight ads, urgent badges, bumps</td>
                                <td>Promotional studio, banner ads, ROI</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Alerts System</td>
                                <td>Order stages, deals, chat alerts</td>
                                <td>Buyer chat, ad expiry reminders</td>
                                <td>High-volume order chimes, stock alerts</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Account Exit</td>
                                <td>Self-service temporary/permanent</td>
                                <td>Pause ads or delete C2C profile</td>
                                <td>Order/ledger clearance + final settlement</td>
                            </tr>
                            <tr>
                                <td className="matrix-dimension">Password Reset</td>
                                <td>Self-service mobile/email OTP</td>
                                <td>Unified SSO password sync</td>
                                <td>Secure token link + mandatory 2FA check</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="page-footer">
                <p>&copy; 2026 GOLO Hyperlocal Retail & Classifieds Network. Operated by NexaPrime Pvt. Ltd.</p>
                <p>Confidential & Proprietary Architecture Documentation</p>
            </footer>
        </main>
    </div>
      </div>
      <Footer />
      <style>{`
        .user-guide-wrapper {
            --bg-primary: transparent;
            --bg-surface: #ffffff;
            --bg-card: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            
            --primary: #157A4F;
            --primary-hover: #064e3b;
            --primary-light: #eff6ff;

            --role-user: #157A4F;
            --role-user-bg: #eff6ff;
            --role-user-border: #bfdbfe;

            --role-choja: #F5B849;
            --role-choja-bg: #FFF8E6;
            --role-choja-border: #F8C45C;

            --role-merchant: #10b981;
            --role-merchant-bg: #ecfdf5;
            --role-merchant-border: #6ee7b7;

            --code-bg: #f1f5f9;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 16px;
        }

        .user-guide-wrapper[data-theme="dark"] {
            --bg-primary: transparent;
            --bg-surface: #111827;
            --bg-card: #1f2937;
            --text-primary: #f9fafb;
            --text-secondary: #9ca3af;
            --text-muted: #6b7280;
            --border-color: #374151;
            
            --primary: #157A4F;
            --primary-hover: #10b981;
            --primary-light: #1e293b;

            --role-user: #10b981;
            --role-user-bg: #1e293b;
            --role-user-border: #157A4F;

            --role-choja: #F5B849;
            --role-choja-bg: #423012;
            --role-choja-border: #c9951e;

            --role-merchant: #34d399;
            --role-merchant-bg: #064e3b;
            --role-merchant-border: #059669;

            --code-bg: #1e293b;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
        }

        

        

        .app-container {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 320px;
            background: transparent;
            border-right: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
            padding: 24px 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            z-index: 20;
            flex-shrink: 0;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .brand-logo {
            width: 40px;
            height: 40px;
            background: #157A4F;
            color: white;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.25rem;
            letter-spacing: -0.5px;
            box-shadow: 0 4px 10px rgba(21, 122, 79, 0.3);
        }

        .brand-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
        }

        .brand-subtitle {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .search-box {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 10px 14px 10px 38px;
            font-size: 0.88rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background: var(--bg-primary);
            color: var(--text-primary);
            outline: none;
            transition: all 0.2s;
        }

        .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 0.9rem;
            pointer-events: none;
        }

        /* Role Filter Chips */
        .role-filters {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 10px;
            background: var(--bg-primary);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
        }

        .role-filters-label {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.5px;
        }

        .role-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .role-chip {
            padding: 4px 10px;
            font-size: 0.76rem;
            font-weight: 600;
            border-radius: 20px;
            border: 1px solid var(--border-color);
            background: var(--bg-surface);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .role-chip:hover {
            border-color: var(--text-muted);
        }

        .role-chip.active-all {
            background: var(--text-primary);
            color: var(--bg-surface);
            border-color: var(--text-primary);
        }

        .role-chip.active-user {
            background: var(--role-user);
            color: #ffffff;
            border-color: var(--role-user);
        }

        .role-chip.active-choja {
            background: var(--role-choja);
            color: #ffffff;
            border-color: var(--role-choja);
        }

        .role-chip.active-merchant {
            background: var(--role-merchant);
            color: #ffffff;
            border-color: var(--role-merchant);
        }

        .nav-sections {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
        }

        .nav-title {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            margin-top: 8px;
            margin-bottom: 6px;
            padding-left: 8px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 7px 10px;
            font-size: 0.84rem;
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: var(--radius-sm);
            transition: all 0.15s ease;
            font-weight: 500;
        }

        .nav-link:hover {
            background: var(--primary-light);
            color: var(--primary);
        }

        .nav-link.active {
            background: var(--primary);
            color: white;
            font-weight: 600;
        }

        .nav-badge {
            font-size: 0.72rem;
            padding: 1px 6px;
            background: var(--border-color);
            border-radius: 10px;
            margin-left: auto;
            color: var(--text-muted);
        }

        .sidebar-footer {
            padding-top: 14px;
            border-top: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .theme-toggle, .print-btn {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 0.82rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .theme-toggle:hover, .print-btn:hover {
            background: var(--primary-light);
            color: var(--primary);
            border-color: var(--primary);
        }

        /* Main Content */
        .content {
            flex: 1;
            padding: 40px 48px;
            max-width: 1200px;
            overflow-y: auto;
        }

        .doc-header {
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border-color);
        }

        .doc-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--text-primary);
            letter-spacing: -0.5px;
            margin-bottom: 10px;
            line-height: 1.2;
        }

        .doc-description {
            font-size: 1.05rem;
            color: var(--text-secondary);
            max-width: 850px;
            margin-bottom: 20px;
        }

        .meta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }

        .meta-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 20px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        .meta-pill.pill-user {
            border-color: var(--role-user-border);
            color: var(--role-user);
            background: var(--role-user-bg);
        }

        .meta-pill.pill-choja {
            border-color: var(--role-choja-border);
            color: var(--role-choja);
            background: var(--role-choja-bg);
        }

        .meta-pill.pill-merchant {
            border-color: var(--role-merchant-border);
            color: var(--role-merchant);
            background: var(--role-merchant-bg);
        }

        /* Guide Section */
        .guide-section {
            margin-bottom: 56px;
            scroll-margin-top: 40px;
        }

        .section-header {
            display: flex;
            align-items: baseline;
            gap: 12px;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--primary);
        }

        .section-num {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--primary);
            font-family: 'JetBrains Mono', monospace;
        }

        .section-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        /* 3-Role Grid */
        .roles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
            .roles-grid {
                grid-template-columns: 1fr;
            }
        }

        .role-card {
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            padding: 22px;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-sm);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
            position: relative;
            overflow: hidden;
        }

        .role-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .role-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
        }

        .role-card.role-user {
            border-top: 4px solid var(--role-user);
        }

        .role-card.role-choja {
            border-top: 4px solid var(--role-choja);
        }

        .role-card.role-merchant {
            border-top: 4px solid var(--role-merchant);
        }

        .role-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px dashed var(--border-color);
        }

        .role-title-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .role-user .role-title-badge { color: var(--role-user); }
        .role-choja .role-title-badge { color: var(--role-choja); }
        .role-merchant .role-title-badge { color: var(--role-merchant); }

        .role-persona {
            font-size: 0.76rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        /* Step List & Bullet List */
        .step-list, .bullet-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 0.88rem;
            color: var(--text-secondary);
        }

        .step-item {
            display: flex;
            gap: 10px;
            line-height: 1.5;
        }

        .step-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            font-size: 0.72rem;
            font-weight: 800;
            flex-shrink: 0;
            margin-top: 1px;
            font-family: 'JetBrains Mono', monospace;
        }

        .role-user .step-number {
            background: var(--role-user-bg);
            color: var(--role-user);
            border: 1px solid var(--role-user-border);
        }

        .role-choja .step-number {
            background: var(--role-choja-bg);
            color: var(--role-choja);
            border: 1px solid var(--role-choja-border);
        }

        .role-merchant .step-number {
            background: var(--role-merchant-bg);
            color: var(--role-merchant);
            border: 1px solid var(--role-merchant-border);
        }

        .step-content strong, .bullet-item strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        .bullet-item {
            position: relative;
            padding-left: 18px;
            line-height: 1.5;
        }

        .bullet-item::before {
            content: '•';
            position: absolute;
            left: 4px;
            top: -1px;
            font-size: 1.1rem;
        }

        .role-user .bullet-item::before { color: var(--role-user); }
        .role-choja .bullet-item::before { color: var(--role-choja); }
        .role-merchant .bullet-item::before { color: var(--role-merchant); }

        /* Comparison Table */
        .matrix-container {
            margin-top: 30px;
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            overflow-x: auto;
            box-shadow: var(--shadow-sm);
        }

        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
            text-align: left;
        }

        .matrix-table th {
            padding: 14px 18px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-weight: 700;
            border-bottom: 2px solid var(--border-color);
            white-space: nowrap;
        }

        .matrix-table th.col-user { color: var(--role-user); }
        .matrix-table th.col-choja { color: var(--role-choja); }
        .matrix-table th.col-merchant { color: var(--role-merchant); }

        .matrix-table td {
            padding: 12px 18px;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
            vertical-align: top;
        }

        .matrix-table tr:hover td {
            background: var(--primary-light);
        }

        .matrix-dimension {
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
        }

        /* Footer */
        .page-footer {
            margin-top: 60px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        /* Filter states */
        .hidden-card {
            display: none !important;
        }

        .roles-grid.single-col {
            grid-template-columns: 1fr;
        }

        /* Print styles */
        @media print {
            .sidebar { display: none; }
            .content { padding: 0; max-width: 100%; }
            .role-card { break-inside: avoid; border: 1px solid #ccc; }
            .matrix-container { break-inside: avoid; }
        }
    
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
      `}</style>
    </div>
  );
}
