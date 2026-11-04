"use client";
import { useState, useEffect, useMemo } from "react";
import { SECTIONS } from "./faqData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SunMoon, Printer } from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
// Each section id matches the anchor used in the HTML sidebar nav.
// Answers use \n for line breaks which the renderer converts to <br/>.
// SECTIONS imported from ./faqData.js
function FAQItem({ q, a, isOpen, onToggle }) {
  const lines = String(a).split('\n');
  return (
    <div style={{ background:"var(--fq-s)", border:"1px solid var(--fq-b)", borderRadius:10, marginBottom:18, overflow:"hidden", boxShadow:isOpen?"0 4px 6px -1px rgba(0,0,0,.1)":"0 1px 2px 0 rgba(0,0,0,.05)", transition:"box-shadow .2s" }}>
      <button onClick={onToggle} style={{ width:"100%", padding:"16px 20px", fontWeight:600, fontSize:"1rem", color:"var(--fq-tp)", background:"var(--fq-s)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none", textAlign:"left", gap:12 }}>
        <span style={{ flex:1 }}>{q}</span>
        <span style={{ flexShrink:0, width:22, height:22, borderRadius:"50%", background:isOpen?"#157A4F":"var(--fq-cb)", color:isOpen?"#fff":"var(--fq-tm)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s" }}>▾</span>
      </button>
      {isOpen && (
        <div style={{ padding:"16px 20px 18px", color:"var(--fq-ts)", fontSize:"0.95rem", lineHeight:1.65, borderTop:"1px solid var(--fq-b)", background:"var(--fq-bg)" }}>
          {lines.map((l,i) => <span key={i}>{l}{i<lines.length-1&&<br/>}</span>)}
        </div>
      )}
    </div>
  );
}

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({});
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("1-general-golo-faq");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("golo_faq_theme") : null;
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => setIsDark(v => {
    const next = !v;
    if (typeof window !== "undefined") localStorage.setItem("golo_faq_theme", next ? "dark" : "light");
    return next;
  });

  const toggleItem = (sid, qi) => {
    const key = `${sid}-${qi}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const lq = searchQuery.toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!lq) return SECTIONS;
    return SECTIONS.map(s => ({
      ...s,
      qs: s.qs.filter(([q,a]) => q.toLowerCase().includes(lq) || a.toLowerCase().includes(lq))
    })).filter(s => s.qs.length > 0);
  }, [lq]);

  useEffect(() => {
    const onScroll = () => {
      for (let i = SECTIONS.length-1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(SECTIONS[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };

  const vars = isDark
    ? { "--fq-bg":"#0b0f19","--fq-s":"#111827","--fq-tp":"#f9fafb","--fq-ts":"#9ca3af","--fq-tm":"#6b7280","--fq-b":"#374151","--fq-pl":"#1e293b","--fq-cb":"#1e293b" }
    : { "--fq-bg":"#f8fafc","--fq-s":"#ffffff","--fq-tp":"#0f172a","--fq-ts":"#475569","--fq-tm":"#64748b","--fq-b":"#e2e8f0","--fq-pl":"#eff6ff","--fq-cb":"#f1f5f9" };

  const SH2 = { fontSize:"1.4rem", fontWeight:700, color:"var(--fq-tp)", letterSpacing:"-0.4px", marginBottom:20, paddingBottom:8, borderBottom:"2px solid var(--fq-pl)" };
  const navBtn = (active) => ({ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"0.87rem", color:active?"#fff":"var(--fq-ts)", background:active?"#157A4F":"transparent", border:"none", borderRadius:6, cursor:"pointer", fontWeight:active?600:500, lineHeight:1.4, marginBottom:2 });
  const footerBtn = { flex:1, background:"var(--fq-bg)", border:"1px solid var(--fq-b)", padding:"8px 10px", fontSize:"0.82rem", fontWeight:600, color:"var(--fq-ts)", borderRadius:6, cursor:"pointer" };

  return (
    <div style={{ minHeight:"100vh", background:"transparent", fontFamily:"'Inter',system-ui,-apple-system,sans-serif", WebkitFontSmoothing:"antialiased", ...vars }}>
      <Navbar />
      <div className="faq-layout-container" style={{ display:"flex", position:"relative", zIndex:10 }}>
        {/* ── Sidebar ── */}
        <aside className="faq-sidebar" style={{ width:300, flexShrink:0, background:"transparent", borderRight:"1px solid var(--fq-b)", position:"sticky", top:0, height:"100vh", overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20, zIndex:20 }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:16, borderBottom:"1px solid var(--fq-b)" }}>
            <div style={{ width:38, height:38, background:"#157A4F", color:"#fff", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.2rem", flexShrink:0 }}>A</div>
            <div>
              <div style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--fq-tp)" }}>AjuBaju Platform</div>
              <div style={{ fontSize:"0.72rem", color:"var(--fq-tm)", textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>FAQ Documentation</div>
            </div>
          </div>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--fq-tm)", pointerEvents:"none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width:"100%", padding:"10px 14px 10px 38px", fontSize:"0.9rem", border:"1px solid var(--fq-b)", borderRadius:10, background:"var(--fq-bg)", color:"var(--fq-tp)", outline:"none", boxSizing:"border-box" }} />
          </div>
          {/* Nav */}
          <nav style={{ display:"flex", flexDirection:"column", flex:1 }}>
            <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", color:"var(--fq-tm)", letterSpacing:"0.5px", marginBottom:8, paddingLeft:8 }}>FAQ Categories</div>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={navBtn(activeSection===s.id)}>{s.title}</button>
            ))}
          </nav>
          {/* Footer */}
          <div style={{ paddingTop:16, borderTop:"1px solid var(--fq-b)", display:"flex", gap:8 }}>
            <button onClick={toggleTheme} style={{ ...footerBtn, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <SunMoon size={15} />
              <span>Theme</span>
            </button>
            <button onClick={() => window.print()} style={{ ...footerBtn, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex:1, padding:"48px 56px", maxWidth:1020, minWidth:0 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--fq-pl)", color:"#157A4F", padding:"4px 12px", borderRadius:999, fontSize:"0.8rem", fontWeight:600, marginBottom:16 }}>Official Documentation v2.0</div>
          <h1 style={{ fontSize:"2.1rem", fontWeight:800, color:"var(--fq-tp)", letterSpacing:"-0.8px", marginBottom:12, lineHeight:1.25 }}>
            AjuBaju Platform — Comprehensive Frequently Asked Questions (FAQ) Documentation
          </h1>
          <p style={{ color:"var(--fq-tm)", fontSize:"0.95rem", marginBottom:32, paddingBottom:24, borderBottom:"1px solid var(--fq-b)", lineHeight:1.65 }}>
            This document provides complete, authoritative answers for all Frequently Asked Questions (FAQs) across{" "}
            <strong style={{ color:"var(--fq-tp)" }}>15 distinct categories</strong>. All answers reflect the official operating procedures and features of the AjuBaju web and mobile platforms, as well as AjuBaju&apos;s official{" "}
            <strong style={{ color:"var(--fq-tp)" }}>Refund &amp; Credit Note Policy</strong> operated by NexaPrime Pvt. Ltd.
          </p>

          {/* Table of Contents */}
          {!lq && (
            <div style={{ marginBottom:48 }}>
              <h2 style={{ ...SH2, marginTop:0 }}>Table of Contents</h2>
              <ol style={{ marginLeft:24, color:"var(--fq-ts)", lineHeight:1.9 }}>
                {SECTIONS.map(s => (
                  <li key={s.id} style={{ marginBottom:4 }}>
                    <button onClick={() => scrollTo(s.id)} style={{ background:"none", border:"none", color:"#157A4F", cursor:"pointer", fontSize:"0.95rem", padding:0, textDecoration:"underline" }}>{s.title}</button>
                  </li>
                ))}
              </ol>
              <hr style={{ margin:"32px 0", border:"none", borderTop:"1px solid var(--fq-b)" }} />
            </div>
          )}

          {lq && <p style={{ color:"var(--fq-tm)", fontSize:"0.88rem", marginBottom:24 }}>{filtered.reduce((a,s)=>a+s.qs.length,0)} result(s) for &quot;{searchQuery}&quot;</p>}

          {/* FAQ Sections */}
          {filtered.map(section => (
            <section key={section.id} id={section.id} style={{ scrollMarginTop:100 }}>
              <h2 style={{ ...SH2, marginTop:48 }}>{section.title}</h2>
              {section.qs.map(([q,a], qi) => {
                const key = `${section.id}-${qi}`;
                return <FAQItem key={key} q={q} a={a} isOpen={!!openItems[key]} onToggle={() => toggleItem(section.id, qi)} />;
              })}
              {!lq && <hr style={{ margin:"8px 0 0 0", border:"none", borderTop:"1px solid var(--fq-b)" }} />}
            </section>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding:"48px 0", textAlign:"center", color:"var(--fq-tm)" }}>No FAQs found for &quot;{searchQuery}&quot;. Try different keywords.</div>
          )}
        </main>
      </div>
      <Footer />
      <style>{`
        
        @media print{.faq-sidebar{display:none!important}main{padding:0!important;max-width:100%!important}}
      
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
      `}</style>
    </div>
  );
}