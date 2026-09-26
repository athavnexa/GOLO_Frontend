"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CookiePolicyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const guideSections = document.querySelectorAll('.guide-section');
    const onScroll = () => {
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
    };
    window.addEventListener('scroll', onScroll);

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

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="user-guide-wrapper" style={{ minHeight:"100vh", background:"transparent", position:"relative", zIndex:10 }}>
      <Navbar />
      <div style={{ position:"relative", zIndex:10, background:"transparent" }}>
        <div className="app-container">

          <aside className="sidebar">
            <div className="brand">
              <div className="brand-logo">G</div>
              <div>
                <div className="brand-title">GOLO Docs</div>
                <div className="brand-subtitle">Legal &amp; Compliance</div>
              </div>
            </div>

            <nav className="nav-sections" id="navSections">
              <span className="nav-title">COOKIE POLICY — GOLO</span>
              <a href="#1-what-are-cookies" className="nav-link active"><span>1. What Are Cookies and Similar Technologies?</span></a>
              <a href="#2-what-we-use" className="nav-link"><span>2. What We Use Them For</span></a>
              <a href="#3-cookies-we-use" className="nav-link"><span>3. Cookies We Use</span></a>
              <a href="#4-local-storage" className="nav-link"><span>4. Local Storage and Session Storage</span></a>
              <a href="#5-payment" className="nav-link"><span>5. Payment Technologies</span></a>
              <a href="#6-third-party" className="nav-link"><span>6. Third-Party and Future Technologies</span></a>
              <a href="#7-managing" className="nav-link"><span>7. Managing Cookies and Local Storage</span></a>
              <a href="#8-consent" className="nav-link"><span>8. Consent and Your Rights</span></a>
              <a href="#9-children" className="nav-link"><span>9. Children</span></a>
              <a href="#10-security" className="nav-link"><span>10. Security</span></a>
              <a href="#11-relationship" className="nav-link"><span>11. Relationship With the GOLO Privacy Policy</span></a>
              <a href="#12-changes" className="nav-link"><span>12. Changes to This Policy</span></a>
              <a href="#13-contact" className="nav-link"><span>13. Contact and Grievance Redressal</span></a>
            </nav>
          </aside>

          <main className="content">
            <header className="doc-header">
              <h1 className="doc-title">COOKIE POLICY — GOLO</h1>
              <div className="meta-tags">
                <span className="meta-pill">Effective Date: 26/09/2026</span>
                <span className="meta-pill">Last Updated: 26/09/2026</span>
                <span className="meta-pill">NexaPrime Pvt. Ltd.</span>
              </div>
            </header>

            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4 mb-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p>
                This Cookie Policy explains how <strong>NexaPrime Private Limited</strong>, a company incorporated under the Companies Act, 2013 and having its registered office at Mahalaxmi Nagar, Subhash Road, Mangalwar Peth, near Gokhale College, Kolhapur, Maharashtra, 416012 — India (<strong>"NexaPrime," "GOLO," "we," "us"</strong> or <strong>"our"</strong>), uses cookies and similar technologies when you access or use the GOLO web application and mobile application (together, the <strong>"Platform"</strong>).
              </p>
              <p>
                This Cookie Policy should be read together with the <a href="/privacy" className="text-blue-600 hover:underline font-semibold">GOLO Privacy Policy</a> and the <a href="/terms" className="text-blue-600 hover:underline font-semibold">GOLO Terms &amp; Conditions</a>. Terms such as <strong>"User"</strong> and <strong>"Merchant"</strong> have the same meaning as in those documents.
              </p>
            </div>

            <section className="guide-section" id="1-what-are-cookies">
              <div className="section-header"><h2 className="section-title">1. What Are Cookies and Similar Technologies?</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>Cookies are small text files that a website stores on your browser or device. GOLO also uses browser <strong>local storage</strong> and <strong>session storage</strong> (HTML5 storage mechanisms), which work similarly to cookies but are not sent with every request and, in the case of local storage, remain on your device until deleted or expired.</p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="font-semibold text-gray-900 m-0">In this Policy, <span className="text-[#157A4F]">"Cookies and Similar Technologies"</span> refers to cookies, local storage and session storage collectively.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="2-what-we-use">
              <div className="section-header"><h2 className="section-title">2. What We Use Them For</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>GOLO uses Cookies and Similar Technologies <strong>only</strong> to:</p>
                <ul className="list-disc pl-8 space-y-3">
                  <li>sign you in and keep your account session active;</li>
                  <li>keep your account and session secure and prevent unauthorised access;</li>
                  <li>remember your interface preferences, such as light/dark theme;</li>
                  <li>save your progress while filling in a form, so it is not lost if the page refreshes;</li>
                  <li>process payments securely and prevent payment fraud; and</li>
                  <li>keep the Platform working properly and protect it against abuse.</li>
                </ul>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-green-900 font-medium m-0">GOLO does <strong>not</strong> currently use cookies or similar technologies for third-party advertising, analytics or cross-site tracking. If GOLO introduces any such technology (for example, an analytics tool), we will update this Policy and this table first, and will ask for your consent before using it, as described in Section 7.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="3-cookies-we-use">
              <div className="section-header"><h2 className="section-title">3. Cookies We Use</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>The following cookies are currently set by GOLO:</p>
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#157A4F', color: '#fff' }}>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Cookie Name</th>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Category</th>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Expiration</th>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'accessToken', category: 'Strictly necessary', expiry: '7 days', purpose: 'Primary authentication token that verifies you are logged in and identifies your account securely to the GOLO backend.' },
                        { name: 'authToken', category: 'Strictly necessary', expiry: '7 days', purpose: 'Legacy authentication token retained to support older endpoints during API updates.' },
                        { name: 'GOLO-access-token', category: 'Strictly necessary', expiry: '7 days', purpose: 'Alternate access-token cookie used to keep your session working consistently across the Platform.' },
                        { name: 'refreshToken', category: 'Strictly necessary', expiry: '7 days', purpose: 'Used to obtain a new access token automatically when the current one expires, so you are not logged out unnecessarily.' },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '13px 18px', fontWeight: 700, color: '#157A4F', fontFamily: 'monospace', fontSize: '0.92rem' }}>{row.name}</td>
                          <td style={{ padding: '13px 18px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600 }}>{row.category}</span></td>
                          <td style={{ padding: '13px 18px', color: '#6b7280', whiteSpace: 'nowrap' }}>{row.expiry}</td>
                          <td style={{ padding: '13px 18px', color: '#374151' }}>{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-amber-900 font-medium m-0">Because these cookies are <strong>strictly necessary</strong> for signing in and keeping your session secure, we do not ask for your consent to set them, but we disclose them here as required by law. Blocking or deleting them will sign you out and may prevent you from logging back in.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="4-local-storage">
              <div className="section-header"><h2 className="section-title">4. Local Storage and Session Storage We Use</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#157A4F', color: '#fff' }}>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Storage Key</th>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Type</th>
                        <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.95rem' }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'GOLO_theme', type: 'Local storage', purpose: 'Remembers whether you prefer Light or Dark mode on the main Platform.' },
                        { key: 'GOLO_faq_theme', type: 'Local storage', purpose: 'Remembers your preferred theme specifically on the FAQ/help page.' },
                        { key: 'merchantRegData', type: 'Session storage', purpose: "Temporarily saves a Merchant's partially completed registration form so progress is not lost if the page is accidentally refreshed. Cleared automatically once registration is submitted, or when the browser session ends." },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '13px 18px', fontWeight: 700, color: '#157A4F', fontFamily: 'monospace', fontSize: '0.92rem' }}>{row.key}</td>
                          <td style={{ padding: '13px 18px' }}><span style={{ background: row.type === 'Session storage' ? '#ede9fe' : '#dbeafe', color: row.type === 'Session storage' ? '#6d28d9' : '#1e40af', padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600 }}>{row.type}</span></td>
                          <td style={{ padding: '13px 18px', color: '#374151' }}>{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>These are <strong>functional technologies</strong> used to improve your experience. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">GOLO_theme</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">GOLO_faq_theme</code> remain on your device until you clear your browser storage or delete them yourself. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">merchantRegData</code> is temporary and does not persist beyond your registration session.</p>
              </div>
            </section>

            <section className="guide-section" id="5-payment">
              <div className="section-header"><h2 className="section-title">5. Payment Technologies</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>GOLO uses <strong>Razorpay</strong> as its payment gateway. During checkout, Razorpay sets its own session and fraud-prevention cookies to process your payment, authenticate the transaction and detect fraud.</p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-gray-700 m-0">GOLO does <strong>not</strong> store your complete card or banking credentials; these are handled directly by Razorpay under its own privacy and cookie policy.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="6-third-party">
              <div className="section-header"><h2 className="section-title">6. Third-Party and Future Technologies</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>GOLO does <strong>not</strong> currently use third-party analytics, advertising or audience-measurement cookies (for example, Google Analytics or Mixpanel). Images on the Platform are delivered through <strong>Cloudinary</strong>, which may receive standard technical information (such as your IP address and browser type) needed to deliver and optimise media, but does not currently set tracking cookies for analytics purposes on GOLO.</p>
                <p>If GOLO adds any analytics, advertising or similar third-party technology in the future, we will:</p>
                <ul className="list-disc pl-8 space-y-3">
                  <li>update this Cookie Policy to name the specific cookies, their purpose and their provider;</li>
                  <li>introduce a cookie consent mechanism allowing you to accept or decline non-essential cookies before they are set; and</li>
                  <li>obtain your consent where required by applicable law before such cookies are used.</li>
                </ul>
              </div>
            </section>

            <section className="guide-section" id="7-managing">
              <div className="section-header"><h2 className="section-title">7. Managing Cookies and Local Storage</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Browser Settings</h3>
                    <p className="text-gray-700 text-sm leading-relaxed m-0">Most browsers let you view, delete and block cookies, and clear local storage and session storage, through their settings or privacy menu (for example, Chrome's "Site settings" or Safari's "Manage Website Data").</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <h3 className="text-lg font-bold text-red-900 mb-3">Effect of Blocking</h3>
                    <p className="text-red-800 text-sm leading-relaxed m-0">If you block or delete <code className="bg-red-100 px-1 rounded text-xs">accessToken</code>, <code className="bg-red-100 px-1 rounded text-xs">authToken</code>, <code className="bg-red-100 px-1 rounded text-xs">GOLO-access-token</code> or <code className="bg-red-100 px-1 rounded text-xs">refreshToken</code>, you will be signed out and may need to log in again. Clearing theme cookies resets your theme to default. Clearing <code className="bg-red-100 px-1 rounded text-xs">merchantRegData</code> mid-registration will lose your unsaved form progress.</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">Do Not Track</h3>
                    <p className="text-blue-800 text-sm leading-relaxed m-0">There is no common technical standard for browser "Do Not Track" signals, so GOLO does not respond to them differently at this time. Because GOLO does not use tracking or advertising cookies, this does not currently affect how your information is used.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="guide-section" id="8-consent">
              <div className="section-header"><h2 className="section-title">8. Consent and Your Rights</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>The cookies in Section 3 are <strong>strictly necessary</strong> to provide the service you have asked for (signing in, staying signed in, and keeping your account secure), so consent is not required for them, though they are disclosed here. The local/session storage in Section 4 is functional and used only to remember your own choices or unsaved input.</p>
                <p>Where GOLO introduces any optional, non-essential technology in the future, we will ask for your consent first, in clear and plain language. You will be able to <strong>withdraw that consent at any time</strong>, as easily as you gave it, and withdrawal will not affect processing already carried out before you withdrew.</p>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Your Rights Under DPDP Act, 2023</h3>
                  <p className="text-gray-700 m-0">Under the Digital Personal Data Protection Act, 2023 and the rules made under it, and other applicable Indian law, you may have rights over your personal data, including rights to access, correct, or erase it, and to have your grievances addressed. The <a href="/privacy" className="text-blue-600 hover:underline font-semibold">GOLO Privacy Policy</a> explains how to exercise these rights.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="9-children">
              <div className="section-header"><h2 className="section-title">9. Children</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4">
                <p>GOLO is intended only for people aged <strong>18 years or older</strong>. GOLO does not knowingly use Cookies and Similar Technologies to collect personal data from anyone under 18. If we learn that we have done so, we will take steps to delete that data.</p>
              </div>
            </section>

            <section className="guide-section" id="10-security">
              <div className="section-header"><h2 className="section-title">10. Security</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>NexaPrime uses reasonable security safeguards to protect information handled through Cookies and Similar Technologies, including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Encrypted communication (HTTPS/TLS)', 'Secure authentication and session management', 'Access controls', 'Monitoring for suspicious activity'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <span className="text-[#157A4F] mt-0.5 text-lg font-bold flex-shrink-0">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-amber-900 font-medium m-0">No method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="11-relationship">
              <div className="section-header"><h2 className="section-title">11. Relationship With the GOLO Privacy Policy</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4">
                <p>This Cookie Policy explains how GOLO uses cookies, local storage and session storage. The <a href="/privacy" className="text-blue-600 hover:underline font-semibold">GOLO Privacy Policy</a> explains what personal data GOLO collects, why, how long it is kept, who it is shared with, and how to exercise your rights.</p>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-blue-900 m-0">Where information collected through Cookies and Similar Technologies is personal data, it is handled under the Privacy Policy and applicable law.</p>
                </div>
              </div>
            </section>

            <section className="guide-section" id="12-changes">
              <div className="section-header"><h2 className="section-title">12. Changes to This Policy</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4">
                <p>We may update this Cookie Policy when the Platform, the technologies we use, our service providers, or applicable law change — including when we add a new cookie, storage key, or third-party technology.</p>
                <p>If we make a <strong>material change</strong>, we will give notice on the Platform or by another reasonable method, and will obtain fresh consent where the law requires it. The <strong>"Last Updated"</strong> date above shows when this Policy was last changed.</p>
              </div>
            </section>

            <section className="guide-section" id="13-contact">
              <div className="section-header"><h2 className="section-title">13. Contact and Grievance Redressal</h2></div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                <p>For questions about this Cookie Policy, or to raise a complaint about how Cookies and Similar Technologies are used:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-2xl font-black mb-6 text-[#157A4F]">NexaPrime Private Limited</h3>
                  <div className="space-y-4 text-gray-700">
                    <p><strong className="text-gray-900 text-lg">Operating:</strong><br/>GOLO Platform</p>
                    <p><strong className="text-gray-900 text-lg">Grievance Officer / Contact:</strong><br/>NexaPrime Pvt. Ltd.</p>
                    <p><strong className="text-gray-900 text-lg">Email:</strong><br/><a href="mailto:support.golo@nexaprime.in" className="text-blue-600 hover:underline">support.golo@nexaprime.in</a></p>
                    <p><strong className="text-gray-900 text-lg">Registered Office:</strong><br/>Mahalaxmi Nagar, Subhash Road, Mangalwar Peth, near Gokhale College, Kolhapur, Maharashtra, 416012 — India</p>
                    <p><strong className="text-gray-900 text-lg">CIN:</strong><br/>U62012PN2025PTC245962</p>
                  </div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-green-900 font-medium m-0">We will aim to resolve grievances within <strong>30 days</strong> of receiving them. If you are not satisfied with our response, you may approach the <strong>Data Protection Board of India</strong>, as provided under applicable law.</p>
                </div>
              </div>
            </section>

            <div className="page-footer">
              <p>GOLO Cookie Policy — NexaPrime Private Limited — Effective: 26/09/2026</p>
            </div>
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
