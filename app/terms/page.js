"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsAndConditionsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Active Navigation Highlight on Scroll
    const guideSections = document.querySelectorAll('.guide-section');
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

    const navLinksClick = document.querySelectorAll('.nav-link');
    navLinksClick.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.history.pushState(null, '', link.getAttribute('href'));
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
                    <div className="brand-subtitle">Legal & Compliance</div>
                </div>
            </div>

            {/*  Navigation Links  */}
            <nav className="nav-sections" id="navSections">
                <span className="nav-title">TERMS & CONDITIONS — GOLO</span>
                <a href="#1-introduction" className="nav-link active"><span>1. INTRODUCTION</span></a>
                <a href="#2-definitions" className="nav-link"><span>2. DEFINITIONS</span></a>
                <a href="#3-eligibility" className="nav-link"><span>3. ELIGIBILITY</span></a>
                <a href="#4-accounts" className="nav-link"><span>4. CREATION AND SECURITY OF ACCOUNTS</span></a>
                <a href="#5-role" className="nav-link"><span>5. GOLO’S ROLE AS A PLATFORM</span></a>
                <a href="#6-merchant-listings" className="nav-link"><span>6. MERCHANT LISTINGS, PRODUCTS AND SERVICES</span></a>
                <a href="#7-offers" className="nav-link"><span>7. OFFERS AND DEALS</span></a>
                <a href="#8-refusal" className="nav-link"><span>8. REFUSAL OF OFFER REDEMPTION</span></a>
                <a href="#9-payment" className="nav-link"><span>9. PAYMENT FOR MERCHANT PRODUCTS AND SERVICES</span></a>
                <a href="#10-returns" className="nav-link"><span>10. RETURNS, REPLACEMENTS, WARRANTIES AND REFUNDS</span></a>
                <a href="#11-paid-services" className="nav-link"><span>11. GOLO PAID SERVICES</span></a>
                <a href="#12-advertising" className="nav-link"><span>12. ADVERTISING AND PROMOTIONAL SERVICES</span></a>
                <a href="#13-refunds" className="nav-link"><span>13. CANCELLATION, REFUND AND CREDIT NOTES FOR GOLO SERVICES</span></a>
                <a href="#14-ugc" className="nav-link"><span>14. USER-GENERATED CONTENT</span></a>
                <a href="#15-prohibited" className="nav-link"><span>15. PROHIBITED CONTENT AND ACTIVITIES</span></a>
                <a href="#16-moderation" className="nav-link"><span>16. CONTENT MODERATION AND ENFORCEMENT</span></a>
                <a href="#17-reporting" className="nav-link"><span>17. REPORTING</span></a>
                <a href="#18-blocking" className="nav-link"><span>18. BLOCKING</span></a>
                <a href="#19-ratings" className="nav-link"><span>19. RATINGS</span></a>
                <a href="#20-chat" className="nav-link"><span>20. CHAT AND ONLINE CALLING</span></a>
                <a href="#21-verification" className="nav-link"><span>21. MERCHANT VERIFICATION</span></a>
                <a href="#22-merchant-obligations" className="nav-link"><span>22. MERCHANT OBLIGATIONS</span></a>
                <a href="#23-user-obligations" className="nav-link"><span>23. USER OBLIGATIONS</span></a>
                <a href="#24-referral" className="nav-link"><span>24. REFERRAL PROGRAM</span></a>
                <a href="#25-ip" className="nav-link"><span>25. INTELLECTUAL PROPERTY</span></a>
                <a href="#26-licence" className="nav-link"><span>26. USER AND MERCHANT CONTENT LICENCE</span></a>
                <a href="#27-privacy" className="nav-link"><span>27. PRIVACY</span></a>
                <a href="#28-third-party" className="nav-link"><span>28. THIRD-PARTY SERVICES</span></a>
                <a href="#29-suspension" className="nav-link"><span>29. ACCOUNT SUSPENSION AND TERMINATION</span></a>
                <a href="#30-deletion" className="nav-link"><span>30. ACCOUNT DELETION</span></a>
                <a href="#31-availability" className="nav-link"><span>31. PLATFORM AVAILABILITY</span></a>
                <a href="#32-no-guarantee" className="nav-link"><span>32. NO GUARANTEE OF MERCHANT PERFORMANCE OR COMMERCIAL RESULTS</span></a>
                <a href="#33-disclaimer" className="nav-link"><span>33. DISCLAIMER</span></a>
                <a href="#34-limitation" className="nav-link"><span>34. LIMITATION OF LIABILITY</span></a>
                <a href="#35-indemnification" className="nav-link"><span>35. INDEMNIFICATION</span></a>
                <a href="#36-disputes" className="nav-link"><span>36. USER-MERCHANT DISPUTES</span></a>
                <a href="#37-golo-disputes" className="nav-link"><span>37. DISPUTES BETWEEN YOU AND GOLO</span></a>
                <a href="#38-changes" className="nav-link"><span>38. CHANGES TO THESE TERMS</span></a>
                <a href="#39-electronic" className="nav-link"><span>39. ELECTRONIC ACCEPTANCE</span></a>
                <a href="#40-severability" className="nav-link"><span>40. SEVERABILITY</span></a>
                <a href="#41-entire-agreement" className="nav-link"><span>41. ENTIRE AGREEMENT</span></a>
                <a href="#42-contact" className="nav-link"><span>42. CONTACT</span></a>

            </nav>
        </aside>

        {/*  Main Content  */}
        <main className="content">
            <header className="doc-header">
                <h1 className="doc-title">TERMS & CONDITIONS — GOLO</h1>
                <div className="meta-tags">
                    <span className="meta-pill">Effective Date: [10/09/2026]</span>
                    <span className="meta-pill">Last Updated: [09/09/2026]</span>
                    <span className="meta-pill">NexaPrime Pvt. Ltd.</span>
                </div>
            </header>

<section className="guide-section" id="1-introduction">
            <div className="section-header"><h2 className="section-title">
              1. INTRODUCTION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>
                Welcome to <strong>GOLO</strong>, a hyperlocal marketplace, discovery and customer-acquisition 
                platform operated by <strong>Sukrut Atul Nigavekar</strong>, the individual operator/proprietor of GOLO 
                (“GOLO”, “Platform”, “we”, “us” or “our”).
              </p>
              <p>
                These Terms & Conditions (“Terms”) govern your access to and use of the GOLO website, 
                mobile applications and related services.
              </p>
              <p>
                GOLO enables Users to discover nearby Merchants, products, services, offers, deals, 
                advertisements and other content. GOLO also enables Merchants to present their 
                businesses, products, services and promotional offers to potential customers.
              </p>
              <p>
                GOLO primarily functions as a platform that facilitates discovery, connection, customer 
                acquisition, offer claiming and redemption. Unless expressly stated otherwise, GOLO is 
                <strong> not the seller, manufacturer, supplier or service provider of products or services offered by Merchants.</strong>
              </p>
              <p>
                By creating an account, accessing or using GOLO, you agree to be legally bound by these 
                Terms and the GOLO Privacy Policy.
              </p>
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="font-bold text-red-800 m-0">
                  If you do not agree with these Terms, you must not create an account or use GOLO.
                </p>
              </div>
            </div>
          </section>

<section className="guide-section" id="2-definitions">
            <div className="section-header"><h2 className="section-title">
              2. DEFINITIONS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-8">
              <p>For purposes of these Terms:</p>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.1 “GOLO”, “Platform”, “we”, “us” or “our”</h3>
                <p>means GOLO and its website, mobile applications, technology, systems and related services operated by Sukrut Atul Nigavekar.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.2 “User”</h3>
                <p>means an individual who accesses or uses GOLO for discovering Merchants, products, services, offers, deals, advertisements or other Platform content, posting classified advertisements or “I Want” requests, communicating with Merchants, claiming offers, or using other User functionality.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.3 “Merchant”</h3>
                <p>means a business owner, service provider, shop, establishment or authorised representative using GOLO to display a business, products, services, offers, deals, advertisements or promotional content.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.4 “Offer” or “Deal”</h3>
                <p>means a promotional offer created by a Merchant through GOLO and made available to Users subject to the terms, conditions, validity period and other restrictions specified by the Merchant.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.5 “Classified Advertisement”</h3>
                <p>means an advertisement or listing submitted by a User through GOLO for the purpose of promoting, seeking, offering or communicating information about goods, services, requirements or other permitted content.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.6 “GOLO Services”</h3>
                <p>means services provided directly by GOLO, including Merchant subscriptions, banner advertising, promotional services, classified advertising services and other services expressly offered by GOLO.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.7 “Credit Note”</h3>
                <p>means an accounting/credit adjustment issued by GOLO in accordance with its applicable Refund, Cancellation and Credit Note Policy. A Credit Note is not a cash balance, bank deposit, withdrawable amount or general-purpose wallet balance.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-[#157A4F]">2.8 “User Content”</h3>
                <p>means content submitted, uploaded, posted, communicated or otherwise made available by a User or Merchant through GOLO, including text, photographs, videos, advertisements, product information, offers, ratings and other content.</p>
              </div>
            </div>
          </section>

<section className="guide-section" id="3-eligibility">
            <div className="section-header"><h2 className="section-title">
              3. ELIGIBILITY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may only be used by persons who are <strong>18 years of age or older</strong>.</p>
              <p>By using GOLO, you represent and warrant that:</p>
              <ol className="list-decimal pl-8 space-y-3 font-medium">
                <li>you are at least 18 years old;</li>
                <li>you have legal capacity to enter into these Terms;</li>
                <li>the information provided by you is accurate and not misleading;</li>
                <li>you will maintain accurate account information; and</li>
                <li>you will comply with these Terms and applicable law.</li>
              </ol>
              <p>GOLO may restrict or terminate accounts where it reasonably believes that an account does not satisfy the applicable eligibility requirements.</p>
            </div>
          </section>

<section className="guide-section" id="4-accounts">
            <div className="section-header"><h2 className="section-title">
              4. CREATION AND SECURITY OF ACCOUNTS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Certain GOLO features require account registration.</p>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-8 space-y-3">
                <li>providing accurate registration information;</li>
                <li>maintaining the confidentiality of your password and authentication credentials;</li>
                <li>protecting your account and device;</li>
                <li>notifying GOLO if you suspect unauthorised access; and</li>
                <li>all activity conducted through your account, subject to applicable law.</li>
              </ul>
              <p className="bg-blue-50 p-6 rounded-xl border border-blue-100 italic text-blue-900">
                You must not create accounts using false identities or another person’s information without lawful authority.
              </p>
              <p>GOLO may require additional verification where reasonably necessary for security, fraud prevention, Merchant verification, account recovery or legal compliance.</p>
            </div>
          </section>

<section className="guide-section" id="5-role">
            <div className="section-header"><h2 className="section-title">
              5. GOLO’S ROLE AS A PLATFORM
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-8">
              <p>GOLO provides technology and marketplace/discovery functionality intended to help Users discover and connect with Merchants and help Merchants acquire potential customers.</p>
              <p>GOLO may facilitate:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Merchant discovery;</li>
                <li>product and service discovery;</li>
                <li>offer and deal discovery;</li>
                <li>classified advertisements;</li>
                <li>customer acquisition;</li>
                <li>offer claiming;</li>
                <li>QR/code generation;</li>
                <li>offer redemption workflows;</li>
                <li>communication between Users and Merchants;</li>
                <li>ratings;</li>
                <li>advertising and promotional placement.</li>
              </ul>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">5.1 GOLO does not ordinarily participate in the underlying Merchant transaction</h3>
                <p className="mb-4">For ordinary purchases of Merchant products or services:</p>
                <p className="font-bold text-gray-900 mb-4">User → Merchant</p>
                <p className="mb-4">The User pays the Merchant directly.</p>
                <p className="mb-4">GOLO does not ordinarily:</p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>collect the underlying purchase price;</li>
                  <li>act as an escrow provider;</li>
                  <li>hold the purchase money;</li>
                  <li>settle the Merchant’s sale proceeds;</li>
                  <li>take a commission from the underlying Merchant/User transaction; or</li>
                  <li>become the seller or service provider merely because the transaction was discovered or facilitated through GOLO.</li>
                </ul>
                <p>The Merchant may receive payment directly through its applicable UPI-linked bank/payment account or another payment method accepted by the Merchant.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">5.2 GOLO’s own paid services</h3>
                <p className="mb-4">GOLO may separately charge:</p>
                <p className="font-bold text-gray-900 mt-4 mb-2">Merchant → GOLO</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Merchant subscription charges;</li>
                  <li>banner charges; and</li>
                  <li>other GOLO promotional services expressly offered.</li>
                </ul>
                <p className="font-bold text-gray-900 mt-4 mb-2">User → GOLO</p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>classified advertisement charges, including charges determined by applicable city, town, district or other geographical coverage; and</li>
                  <li>other GOLO services expressly offered to Users.</li>
                </ul>
                <p className="italic">The underlying Merchant/User purchase is separate from the User/Merchant payment for GOLO services.</p>
              </div>
            </div>
          </section>

<section className="guide-section" id="6-merchant-listings">
            <div className="section-header"><h2 className="section-title">
              6. MERCHANT LISTINGS, PRODUCTS AND SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Merchants are solely responsible for everything they publish or offer through GOLO.</p>
              <p>This includes responsibility for:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                <ul className="list-disc pl-8 space-y-2">
                  <li>product/service description;</li>
                  <li>price;</li>
                  <li>availability;</li>
                  <li>stock;</li>
                  <li>quality;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>authenticity;</li>
                  <li>legality;</li>
                  <li>licenses and permissions;</li>
                  <li>warranties;</li>
                  <li>taxes and statutory obligations;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>offer conditions;</li>
                  <li>promotional claims;</li>
                  <li>fulfillment;</li>
                  <li>delivery where applicable;</li>
                  <li>customer service;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>returns;</li>
                  <li>replacements;</li>
                  <li>refunds; and</li>
                  <li>compliance with applicable laws.</li>
                </ul>
              </div>
              <p className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 font-medium">
                GOLO does not independently guarantee the accuracy, completeness, quality, safety, legality, availability or suitability of every Merchant listing.
              </p>
              <p>Merchants must not publish misleading, fraudulent, deceptive or materially incomplete information.</p>
            </div>
          </section>

<section className="guide-section" id="7-offers">
            <div className="section-header"><h2 className="section-title">
              7. OFFERS AND DEALS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>A Merchant may create an Offer or Deal by selecting the applicable product/service and specifying the applicable promotional conditions and validity period.</p>
              <p>The general redemption process may operate as follows:</p>
              <ol className="list-decimal pl-8 space-y-3">
                <li>Merchant creates an Offer;</li>
                <li>User discovers and claims the Offer;</li>
                <li>GOLO generates or provides a QR code, code or other redemption identifier;</li>
                <li>User visits the Merchant’s store or applicable location;</li>
                <li>Merchant scans or verifies the code;</li>
                <li>Merchant determines whether the redemption satisfies the published Offer terms;</li>
                <li>If valid, the Merchant accepts the redemption;</li>
                <li>User pays the Merchant directly for the applicable product/service;</li>
                <li>Merchant receives the applicable purchase amount through the payment method accepted by the Merchant.</li>
              </ol>
              <p className="italic">GOLO facilitates the technical discovery, claim and redemption workflow but does not guarantee that the Merchant will perform the underlying transaction.</p>
            </div>
          </section>

<section className="guide-section" id="8-refusal">
            <div className="section-header"><h2 className="section-title">
              8. REFUSAL OF OFFER REDEMPTION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>A Merchant should not arbitrarily refuse a valid Offer.</p>
              <p>A Merchant may refuse redemption where there is a legitimate reason, including:</p>
              <ul className="list-disc pl-8 space-y-3">
                <li>the Offer has expired;</li>
                <li>the QR code or redemption code is invalid, altered or tampered with;</li>
                <li>the User has not satisfied the published Offer conditions;</li>
                <li>the applicable product/service is unavailable where the Offer expressly permits availability limitations;</li>
                <li>the Merchant reasonably suspects fraud or misuse;</li>
                <li>the Offer has already been redeemed; or</li>
                <li>another material restriction expressly disclosed in the Offer applies.</li>
              </ul>
              <p>Merchants must not use undisclosed conditions to unfairly defeat a valid Offer.</p>
              <p>GOLO may investigate complaints concerning alleged misuse, fraudulent redemption or unreasonable rejection, but GOLO does not guarantee the outcome of an underlying Merchant/User dispute.</p>
            </div>
          </section>

<section className="guide-section" id="9-payment">
            <div className="section-header"><h2 className="section-title">
              9. PAYMENT FOR MERCHANT PRODUCTS AND SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>The price paid by a User for a Merchant’s product or service is a transaction between the User and Merchant.</p>
              <p>The Merchant is responsible for:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="list-disc pl-8 space-y-2">
                  <li>accepting payment;</li>
                  <li>issuing applicable invoices/receipts;</li>
                  <li>applicable taxes;</li>
                  <li>refunds;</li>
                  <li>returns;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>replacements;</li>
                  <li>warranties;</li>
                  <li>customer service; and</li>
                  <li>other obligations relating to the sale or service.</li>
                </ul>
              </div>
              <p className="bg-gray-50 p-6 rounded-xl font-medium">Unless expressly stated otherwise, GOLO does not collect the underlying Merchant purchase amount.</p>
            </div>
          </section>

<section className="guide-section" id="10-returns">
            <div className="section-header"><h2 className="section-title">
              10. RETURNS, REPLACEMENTS, WARRANTIES AND REFUNDS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>The Merchant is responsible for handling product/service:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>returns;</li>
                <li>replacements;</li>
                <li>warranties;</li>
                <li>cancellations;</li>
                <li>refunds; and</li>
                <li>other post-sale obligations</li>
              </ul>
              <p>in accordance with applicable law and the Merchant’s disclosed policies.</p>
              <p className="font-medium text-gray-900">Because GOLO ordinarily does not collect the underlying Merchant purchase amount, GOLO does not ordinarily issue refunds for Merchant product/service purchases.</p>
              <p>GOLO may assist Users and Merchants in communication or dispute resolution where reasonably possible, but such assistance does not make GOLO a party to the underlying sale or service contract.</p>
            </div>
          </section>

<section className="guide-section" id="11-paid-services">
            <div className="section-header"><h2 className="section-title">
              11. GOLO PAID SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may provide paid services to Users and Merchants.</p>
              <p>These may include:</p>
              
              <div className="mt-4">
                <h4 className="font-bold text-gray-900 text-xl mb-2 text-[#157A4F]">Merchant Services</h4>
                <ul className="list-disc pl-8 space-y-2">
                  <li>subscription plans;</li>
                  <li>banner advertising;</li>
                  <li>promotional placements;</li>
                  <li>other Merchant advertising services.</li>
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-gray-900 text-xl mb-2 text-[#157A4F]">User Services</h4>
                <ul className="list-disc pl-8 space-y-2">
                  <li>classified advertisements;</li>
                  <li>geographical promotional coverage such as city, town or district-based advertising;</li>
                  <li>other paid GOLO services.</li>
                </ul>
              </div>

              <p>Applicable prices, duration, availability, plan benefits and conditions may be displayed at the time of purchase.</p>
              <p className="italic">A payment to GOLO for a GOLO service does not constitute payment for the underlying Merchant product or service.</p>
            </div>
          </section>

<section className="guide-section" id="12-advertising">
            <div className="section-header"><h2 className="section-title">
              12. ADVERTISING AND PROMOTIONAL SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Merchants and Users may be permitted to purchase advertising or promotional placement through GOLO, subject to applicable eligibility, content requirements, availability and payment conditions.</p>
              <p>GOLO may determine:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="list-disc pl-8 space-y-2">
                  <li>available advertising formats;</li>
                  <li>available banner positions;</li>
                  <li>geographical coverage;</li>
                  <li>campaign duration;</li>
                  <li>pricing;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>placement;</li>
                  <li>technical requirements;</li>
                  <li>content standards; and</li>
                  <li>campaign acceptance.</li>
                </ul>
              </div>
              <p className="font-medium mt-4">Payment for advertising does not guarantee:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>a particular number of customers;</li>
                <li>sales;</li>
                <li>revenue;</li>
                <li>leads;</li>
                <li>conversions;</li>
                <li>impressions;</li>
                <li>clicks;</li>
                <li>engagement; or</li>
                <li>any particular commercial result.</li>
              </ul>
              <p>Advertisers remain responsible for the legality, accuracy and rights associated with their advertising content.</p>
            </div>
          </section>

<section className="guide-section" id="13-refunds">
            <div className="section-header"><h2 className="section-title">
              13. CANCELLATION, REFUND AND CREDIT NOTES FOR GOLO SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Payments for GOLO’s advertising and promotional services are subject to the applicable <strong>Cancellation, Refund and Credit Note Policy</strong>.</p>
              <p>Where eligible under that policy, an amount may be issued as a <strong>GOLO Credit Note instead of a cash refund</strong>.</p>
              <p>A Credit Note:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>is not cash;</li>
                <li>is not a bank balance;</li>
                <li>is not a deposit;</li>
                <li>is not withdrawable;</li>
                <li>is not a general-purpose wallet balance; and</li>
                <li>may only be used in accordance with the applicable Credit Note terms.</li>
              </ul>
              <p>No refund or Credit Note will be provided where the applicable policy does not permit it, except where a refund or other remedy is legally required.</p>
            </div>
          </section>

<section className="guide-section" id="14-ugc">
            <div className="section-header"><h2 className="section-title">
              14. USER-GENERATED CONTENT
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may allow Users and Merchants to submit or publish content including:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>classified advertisements;</li>
                <li>“I Want” requests;</li>
                <li>photographs;</li>
                <li>videos;</li>
                <li>product information;</li>
                <li>promotional content;</li>
                <li>advertisements;</li>
                <li>ratings;</li>
                <li>communications; and</li>
                <li>other permitted content.</li>
              </ul>
              <p className="font-bold text-gray-900 mt-4">You are solely responsible for content you submit.</p>
              <p>You must have the necessary rights, permissions and authority to publish the content.</p>
            </div>
          </section>

<section className="guide-section" id="15-prohibited">
            <div className="section-header"><h2 className="section-title">
              15. PROHIBITED CONTENT AND ACTIVITIES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>You must not use GOLO to publish, promote, facilitate, sell, request or distribute content or activity involving:</p>
              <ol className="list-decimal pl-8 space-y-2 font-medium">
                <li>illegal products or services;</li>
                <li>counterfeit goods;</li>
                <li>stolen goods;</li>
                <li>fraudulent offers;</li>
                <li>misleading or deceptive claims;</li>
                <li>pornography or sexual exploitation;</li>
                <li>child sexual abuse or exploitation material;</li>
                <li>hate or abusive content;</li>
                <li>threats or intimidation;</li>
                <li>malware or malicious software;</li>
                <li>scams or fraudulent schemes;</li>
                <li>impersonation;</li>
                <li>copyright infringement;</li>
                <li>trademark infringement;</li>
                <li>unauthorised disclosure of personal or confidential information;</li>
                <li>regulated goods or services where prohibited by applicable law or GOLO rules;</li>
                <li>spam or unsolicited commercial abuse;</li>
                <li>fake or manipulated ratings;</li>
                <li>manipulation of offers or prices;</li>
                <li>attempts to manipulate redemption systems;</li>
                <li>referral or promotional abuse;</li>
                <li>attempts to bypass GOLO security or moderation systems;</li>
                <li>content intended to evade GOLO moderation;</li>
                <li>unlawful harassment or abuse; or</li>
                <li>any activity that violates applicable law.</li>
              </ol>
            </div>
          </section>

<section className="guide-section" id="16-moderation">
            <div className="section-header"><h2 className="section-title">
              16. CONTENT MODERATION AND ENFORCEMENT
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may use automated systems, manual review, security tools and, where applicable, third-party or AI-assisted moderation technologies to identify potentially prohibited content or activity.</p>
              <p>GOLO may, where reasonably necessary:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>reject content before publication;</li>
                <li>remove content;</li>
                <li>restrict content visibility;</li>
                <li>disable an advertisement;</li>
                <li>suspend functionality;</li>
                <li>restrict an account;</li>
                <li>require additional verification;</li>
                <li>suspend an account;</li>
                <li>terminate an account;</li>
                <li>block access to particular features; or</li>
                <li>take other proportionate measures.</li>
              </ul>
              <p>GOLO may take immediate action where necessary to protect Users, Merchants, the Platform, third parties or legal/regulatory interests.</p>
              <p>Where appropriate and reasonably practicable, GOLO may provide notice, an explanation, an opportunity to clarify or a review/appeal mechanism.</p>
              <p>Nothing in this section prevents GOLO from taking urgent action where immediate action is reasonably necessary for safety, fraud prevention, security or legal compliance.</p>
            </div>
          </section>

<section className="guide-section" id="17-reporting">
            <div className="section-header"><h2 className="section-title">
              17. REPORTING
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO currently provides reporting functionality for applicable Platform content and accounts, including:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Report User;</li>
                <li>Report Advertisement.</li>
              </ul>
              <p>Users may use the applicable reporting mechanism to notify GOLO of suspected prohibited, fraudulent, abusive or unlawful content/activity.</p>
              <p>GOLO may review reports and take action that it considers appropriate.</p>
              <p>GOLO does not guarantee that every reported item will be removed or that every report will result in enforcement action.</p>
              <p>GOLO may restrict or terminate accounts that repeatedly submit malicious, fraudulent or abusive reports.</p>
            </div>
          </section>

<section className="guide-section" id="18-blocking">
            <div className="section-header"><h2 className="section-title">
              18. BLOCKING
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may block or restrict Users or accounts as part of its safety, moderation, fraud-prevention or enforcement processes.</p>
              <p>Where User-facing blocking functionality is made available, Users may use it according to the applicable Platform functionality.</p>
              <p>GOLO may also independently restrict communication or interaction between accounts where reasonably necessary.</p>
              <p className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">Implementation note: GOLO should provide a User-facing “Block User” function before launch where Users can directly interact with each other through chat/calling.</p>
            </div>
          </section>

<section className="guide-section" id="19-ratings">
            <div className="section-header"><h2 className="section-title">
              19. RATINGS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may allow Users to provide ratings for eligible Merchants, products, services or experiences.</p>
              <p>Ratings must represent a genuine experience or legitimate interaction.</p>
              <p>You must not:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>create fake ratings;</li>
                <li>rate your own business through another account;</li>
                <li>manipulate ratings;</li>
                <li>purchase or exchange ratings;</li>
                <li>threaten another person to obtain a rating;</li>
                <li>submit ratings for improper competitive purposes; or</li>
                <li>use ratings to publish unlawful or abusive content.</li>
              </ul>
              <p>GOLO may remove, restrict or disregard ratings that violate these Terms or applicable rating rules.</p>
              <p className="italic">A rating does not constitute a guarantee or endorsement by GOLO.</p>
            </div>
          </section>

<section className="guide-section" id="20-chat">
            <div className="section-header"><h2 className="section-title">
              20. CHAT AND ONLINE CALLING
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may provide chat and online calling functionality to facilitate communication between Users and Merchants.</p>
              <p>Users and Merchants must use these features lawfully and respectfully.</p>
              <p>You must not use chat or calling to:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>harass or threaten another person;</li>
                <li>impersonate another person;</li>
                <li>distribute scams or malware;</li>
                <li>solicit unlawful transactions;</li>
                <li>send prohibited content;</li>
                <li>collect personal information improperly;</li>
                <li>evade GOLO moderation; or</li>
                <li>otherwise violate these Terms.</li>
              </ul>
              <p>GOLO may restrict communication functionality where necessary for safety, moderation, fraud prevention or legal compliance.</p>
              <p>GOLO does not guarantee the identity, intentions, statements, availability or conduct of another User or Merchant.</p>
            </div>
          </section>

<section className="guide-section" id="21-verification">
            <div className="section-header"><h2 className="section-title">
              21. MERCHANT VERIFICATION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may conduct verification checks on Merchants based on information and documentation submitted by the Merchant.</p>
              <p>A verification status means only that GOLO has completed certain applicable verification checks based on the information/documentation provided by the Merchant.</p>
              <p>Verification does <strong>not</strong> constitute:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>endorsement;</li>
                <li>certification;</li>
                <li>recommendation;</li>
                <li>guarantee;</li>
                <li>quality assurance;</li>
                <li>legal certification;</li>
                <li>financial assurance; or</li>
                <li>a guarantee of Merchant performance.</li>
              </ul>
              <p className="font-medium bg-blue-50 p-6 rounded-xl border border-blue-100">Users should independently evaluate Merchants before entering into transactions.</p>
            </div>
          </section>

<section className="guide-section" id="22-merchant-obligations">
            <div className="section-header"><h2 className="section-title">
              22. MERCHANT OBLIGATIONS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Every Merchant represents and agrees that it will:</p>
              <ol className="list-decimal pl-8 space-y-2 font-medium">
                <li>operate its business lawfully;</li>
                <li>maintain required licences, registrations and permissions;</li>
                <li>comply with applicable tax obligations;</li>
                <li>provide accurate product/service information;</li>
                <li>provide accurate prices and offer conditions;</li>
                <li>maintain lawful and appropriate stock/availability information;</li>
                <li>provide products/services of the represented quality;</li>
                <li>honour valid Offers subject to disclosed conditions;</li>
                <li>handle returns, replacements, warranties and refunds appropriately;</li>
                <li>respect consumer rights;</li>
                <li>comply with applicable advertising laws;</li>
                <li>possess rights to use uploaded intellectual property;</li>
                <li>avoid counterfeit/stolen goods;</li>
                <li>not engage in fraudulent or deceptive conduct;</li>
                <li>provide appropriate customer service; and</li>
                <li>comply with these Terms and applicable GOLO policies.</li>
              </ol>
            </div>
          </section>

<section className="guide-section" id="23-user-obligations">
            <div className="section-header"><h2 className="section-title">
              23. USER OBLIGATIONS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Users agree to:</p>
              <ul className="list-disc pl-8 space-y-2 font-medium">
                <li>provide accurate information;</li>
                <li>use GOLO lawfully;</li>
                <li>respect Merchants and other Users;</li>
                <li>use Offers only according to their conditions;</li>
                <li>not duplicate, tamper with or misuse QR codes or redemption codes;</li>
                <li>not manipulate prices, claims, ratings or promotions;</li>
                <li>not impersonate others;</li>
                <li>not submit fraudulent advertisements;</li>
                <li>not misuse chat or calling;</li>
                <li>not submit prohibited content;</li>
                <li>not attempt to bypass GOLO security or moderation; and</li>
                <li>comply with applicable law.</li>
              </ul>
            </div>
          </section>

<section className="guide-section" id="24-referral">
            <div className="section-header"><h2 className="section-title">
              24. REFERRAL PROGRAM
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Where GOLO operates a referral program, participation is subject to the applicable referral rules.</p>
              <p>GOLO may reject or reverse referral benefits where it identifies:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>self-referrals;</li>
                <li>duplicate accounts;</li>
                <li>fraudulent activity;</li>
                <li>manipulated referrals;</li>
                <li>artificial activity;</li>
                <li>abuse of promotional terms; or</li>
                <li>other prohibited conduct.</li>
              </ul>
              <p>GOLO may modify, suspend or discontinue a referral program subject to applicable law and applicable program terms.</p>
            </div>
          </section>

<section className="guide-section" id="25-ip">
            <div className="section-header"><h2 className="section-title">
              25. INTELLECTUAL PROPERTY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO and its licensors retain all rights in GOLO’s software, technology, branding, logos, designs, interfaces, databases, graphics, text and other Platform materials, except for third-party or User/Merchant-owned content.</p>
              <p>You must not reproduce, modify, distribute, reverse engineer, scrape, sell, license or commercially exploit GOLO’s proprietary materials without appropriate authorization, except where permitted by law.</p>
              <p>GOLO’s name, logo and branding may not be used in a manner that falsely suggests endorsement or affiliation.</p>
            </div>
          </section>

<section className="guide-section" id="26-licence">
            <div className="section-header"><h2 className="section-title">
              26. USER AND MERCHANT CONTENT LICENCE
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>By submitting content to GOLO, you retain ownership of your content, subject to any rights belonging to third parties.</p>
              <p>You grant GOLO a non-exclusive, worldwide, royalty-free licence, to the extent necessary to operate the Platform, to host, store, reproduce, process, display, transmit, format, moderate and distribute your content through GOLO’s services.</p>
              <p>This licence is limited to purposes such as:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>displaying your listing;</li>
                <li>operating advertisements;</li>
                <li>facilitating discovery;</li>
                <li>providing Platform functionality;</li>
                <li>moderation;</li>
                <li>security;</li>
                <li>technical processing; and</li>
                <li>improving and maintaining GOLO.</li>
              </ul>
              <p className="font-medium">You represent that you have the necessary rights to grant this licence.</p>
            </div>
          </section>

<section className="guide-section" id="27-privacy">
            <div className="section-header"><h2 className="section-title">
              27. PRIVACY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO processes personal data in accordance with the applicable <strong>GOLO Privacy Policy</strong>.</p>
              <p>The Privacy Policy describes categories of personal data, purposes of processing, sharing, security, retention and account deletion.</p>
              <p>Users and Merchants should read the Privacy Policy before using GOLO.</p>
              <p>GOLO’s Privacy Policy currently provides account deletion mechanisms for Users and Merchants through the Website and Mobile Applications, subject to legally permitted or required retention.</p>
            </div>
          </section>

<section className="guide-section" id="28-third-party">
            <div className="section-header"><h2 className="section-title">
              28. THIRD-PARTY SERVICES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may integrate or rely upon third-party services, technology providers, payment providers, cloud infrastructure, communication services, authentication providers, analytics tools, mapping/location services or other third-party systems.</p>
              <p>Third-party services may be governed by their own terms and privacy policies.</p>
              <p>GOLO is not responsible for independent acts, omissions, outages or policies of third-party providers to the extent permitted by applicable law.</p>
            </div>
          </section>

<section className="guide-section" id="29-suspension">
            <div className="section-header"><h2 className="section-title">
              29. ACCOUNT SUSPENSION AND TERMINATION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may restrict, suspend or terminate an account where reasonably necessary because of:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                <ul className="list-disc pl-8 space-y-2">
                  <li>fraud;</li>
                  <li>fake accounts;</li>
                  <li>prohibited content;</li>
                  <li>abuse;</li>
                  <li>harassment;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>payment fraud;</li>
                  <li>referral abuse;</li>
                  <li>Offer/QR-code manipulation;</li>
                  <li>repeated complaints;</li>
                  <li>KYC/verification failure;</li>
                </ul>
                <ul className="list-disc pl-8 space-y-2">
                  <li>policy violations;</li>
                  <li>unlawful activity;</li>
                  <li>security threats;</li>
                  <li>attempts to bypass Platform controls;</li>
                  <li>misuse of GOLO services;</li>
                  <li>regulatory or legal requirements; or</li>
                  <li>other material violations of these Terms.</li>
                </ul>
              </div>
              <p>GOLO will seek to take action proportionate to the circumstances.</p>
              <p>Where appropriate, GOLO may provide notice, clarification or review mechanisms. However, GOLO may take immediate action where necessary to protect Users, Merchants, the Platform or third parties.</p>
            </div>
          </section>

<section className="guide-section" id="30-deletion">
            <div className="section-header"><h2 className="section-title">
              30. ACCOUNT DELETION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Users and Merchants may request deletion of their accounts through the applicable GOLO account deletion mechanism.</p>
              <p>Account deletion may cause associated account, store, product, offer, advertisement and other information to be removed or made unavailable.</p>
              <p>Certain information may be retained where required or permitted for legal, tax, accounting, security, fraud-prevention, dispute-resolution or other legitimate purposes.</p>
              <p>GOLO’s Privacy Policy provides further details regarding deletion and retention.</p>
            </div>
          </section>

<section className="guide-section" id="31-availability">
            <div className="section-header"><h2 className="section-title">
              31. PLATFORM AVAILABILITY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO aims to provide reliable services but does not guarantee that:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>GOLO will always be available;</li>
                <li>every feature will always operate;</li>
                <li>the Platform will be error-free;</li>
                <li>listings will always be available;</li>
                <li>information will always be current;</li>
                <li>third-party services will always function; or</li>
                <li>interruptions will never occur.</li>
              </ul>
              <p>GOLO may modify, suspend or discontinue features or services where reasonably necessary.</p>
            </div>
          </section>

<section className="guide-section" id="32-no-guarantee">
            <div className="section-header"><h2 className="section-title">
              32. NO GUARANTEE OF MERCHANT PERFORMANCE OR COMMERCIAL RESULTS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO provides a platform for discovery and customer acquisition.</p>
              <p>GOLO does not guarantee:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>Merchant performance;</li>
                <li>product/service quality;</li>
                <li>Merchant availability;</li>
                <li>Merchant conduct;</li>
                <li>sales;</li>
                <li>revenue;</li>
                <li>customer numbers;</li>
                <li>leads;</li>
                <li>conversions;</li>
                <li>Offer redemption;</li>
                <li>advertising performance; or</li>
                <li>any specific commercial result.</li>
              </ul>
              <p className="font-medium bg-blue-50 p-6 rounded-xl border border-blue-100">Users should independently assess Merchants and their offerings.</p>
            </div>
          </section>

<section className="guide-section" id="33-disclaimer">
            <div className="section-header"><h2 className="section-title">
              33. DISCLAIMER
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>To the maximum extent permitted by applicable law, GOLO provides the Platform on an “as available” and “as reasonably provided” basis.</p>
              <p>GOLO does not guarantee that information supplied by Users or Merchants is accurate, complete, current or reliable.</p>
              <p>GOLO is not responsible for the independent acts or omissions of Users or Merchants.</p>
              <p>Nothing in these Terms excludes liability that cannot legally be excluded.</p>
            </div>
          </section>

<section className="guide-section" id="34-limitation">
            <div className="section-header"><h2 className="section-title">
              34. LIMITATION OF LIABILITY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>To the maximum extent permitted by applicable law, GOLO shall not be liable for indirect, incidental, special, consequential or punitive losses arising from:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>Merchant products/services;</li>
                <li>Merchant conduct;</li>
                <li>User conduct;</li>
                <li>disputes between Users and Merchants;</li>
                <li>inaccurate listings;</li>
                <li>Offer refusal;</li>
                <li>Merchant non-performance;</li>
                <li>advertising results;</li>
                <li>loss of business opportunity;</li>
                <li>third-party service failures; or</li>
                <li>Platform interruptions.</li>
              </ul>
              <p>Nothing in these Terms limits liability where such limitation is prohibited by applicable law.</p>
            </div>
          </section>

<section className="guide-section" id="35-indemnification">
            <div className="section-header"><h2 className="section-title">
              35. INDEMNIFICATION
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>To the extent permitted by applicable law, you agree to indemnify and hold GOLO and its operator harmless from claims, losses, liabilities, damages, costs and expenses arising from:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>your violation of these Terms;</li>
                <li>your unlawful conduct;</li>
                <li>your User Content;</li>
                <li>intellectual-property infringement;</li>
                <li>fraud or misrepresentation;</li>
                <li>misuse of GOLO;</li>
                <li>your violation of another person’s rights; or</li>
                <li>your transaction or dispute with another User or Merchant.</li>
              </ul>
            </div>
          </section>

<section className="guide-section" id="36-disputes">
            <div className="section-header"><h2 className="section-title">
              36. USER-MERCHANT DISPUTES
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>The User and Merchant are primarily responsible for resolving disputes relating to their underlying transaction.</p>
              <p>Such disputes may include:</p>
              <ul className="list-disc pl-8 space-y-2 columns-1 sm:columns-2">
                <li>product/service quality;</li>
                <li>price;</li>
                <li>availability;</li>
                <li>fulfillment;</li>
                <li>warranty;</li>
                <li>return;</li>
                <li>replacement;</li>
                <li>refund;</li>
                <li>Merchant conduct;</li>
                <li>Offer redemption; or</li>
                <li>other matters relating to the Merchant’s product/service.</li>
              </ul>
              <p>GOLO may reasonably assist with communication or facilitate resolution where possible, but such assistance does not make GOLO a party to the underlying sale or service contract.</p>
            </div>
          </section>

<section className="guide-section" id="37-golo-disputes">
            <div className="section-header"><h2 className="section-title">
              37. DISPUTES BETWEEN YOU AND GOLO
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>Any dispute between you and GOLO concerning the Platform or GOLO Services shall be governed by the laws of <strong>India</strong>, subject to applicable law.</p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6">Jurisdiction</h3>
              <p className="font-bold text-[#157A4F] bg-green-50 p-4 rounded-xl">
                KOLHAPUR, MAHARASHTRA, INDIA
              </p>
              <p>The courts having jurisdiction at the agreed location shall have jurisdiction over disputes, subject to applicable law.</p>
              <p>GOLO may establish additional support, escalation, mediation or arbitration procedures through a separate policy or agreement where appropriate.</p>
            </div>
          </section>

<section className="guide-section" id="38-changes">
            <div className="section-header"><h2 className="section-title">
              38. CHANGES TO THESE TERMS
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>GOLO may update these Terms from time to time.</p>
              <p>Changes may be made because of:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>new Platform features;</li>
                <li>business model changes;</li>
                <li>legal or regulatory requirements;</li>
                <li>security requirements;</li>
                <li>operational changes; or</li>
                <li>improvements to the Platform.</li>
              </ul>
              <p>The updated Terms will be published through the applicable GOLO website or application.</p>
              <p>Your continued use of GOLO after the effective date of updated Terms may constitute acceptance of the updated Terms to the extent permitted by applicable law.</p>
            </div>
          </section>

<section className="guide-section" id="39-electronic">
            <div className="section-header"><h2 className="section-title">
              39. ELECTRONIC ACCEPTANCE
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>By:</p>
              <ul className="list-disc pl-8 space-y-2 font-medium">
                <li>creating a GOLO account;</li>
                <li>accessing GOLO;</li>
                <li>using GOLO;</li>
                <li>selecting an acceptance checkbox; or</li>
                <li>otherwise affirmatively accepting these Terms,</li>
              </ul>
              <p>you acknowledge that you have read, understood and agreed to these Terms and the GOLO Privacy Policy.</p>
              <p>Where applicable, GOLO may require affirmative acceptance before allowing access to particular features.</p>
            </div>
          </section>

<section className="guide-section" id="40-severability">
            <div className="section-header"><h2 className="section-title">
              40. SEVERABILITY
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>If any provision of these Terms is determined to be invalid, unlawful or unenforceable, that provision shall be interpreted or modified to the extent legally permissible, and the remaining provisions shall continue to apply.</p>
            </div>
          </section>

<section className="guide-section" id="41-entire-agreement">
            <div className="section-header"><h2 className="section-title">
              41. ENTIRE AGREEMENT
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              <p>These Terms, together with the GOLO Privacy Policy and other applicable GOLO policies or service-specific terms, constitute the applicable agreement governing your use of GOLO, subject to any separate written agreement expressly entered into with GOLO.</p>
            </div>
          </section>

<section className="guide-section" id="42-contact">
            <div className="section-header"><h2 className="section-title">
              42. CONTACT
            </h2></div>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <p className="mb-6">For questions, support, complaints or policy-related matters:</p>
              <div className="space-y-4">
                <p><strong className="text-gray-900 text-xl block mb-2">GOLO</strong></p>
                <p><strong>Operator:</strong> Sukrut Atul Nigavekar</p>
                <p><strong>Registered Office:</strong> Mahalaxmi Nagar, Kolhapur, Maharashtra, PIN 416012, India</p>
                <p><strong>Email:</strong> <a href="mailto:golo.support@nexaprime.in" className="text-blue-600 hover:underline">golo.support@nexaprime.in</a></p>
              </div>
            </div>
          </section>
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
