import React from 'react';
import LogoSvg from './LogoSvg';
import { Mail, MessageCircle } from 'lucide-react';

const QUICK_LINKS = [
  { href: '#hero', label: 'الرئيسية' },
  { href: '#opening', label: 'عن رؤية' },
  { href: '#pathways', label: 'المسارات الأكاديمية' },
  { href: '#foundation', label: 'مجانية المنصة' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
];

const SUPPORT_LINKS = [
  { href: '#why-us', label: 'لماذا رؤية؟' },
  { href: 'mailto:support@vision-edu.eg', label: 'support@vision-edu.eg' },
];

export default function Footer({ onOpenModal }) {
  return (
    <footer className="footer-section">
      <div className="container">

        {/* Top grid */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <a href="#hero" className="brand-logo" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>
              <div className="logo-emblem">
                <LogoSvg width={30} height={30} />
              </div>
              <div className="brand-text-group">
                <span className="brand-name-en">VISION</span>
                <span className="brand-name-ar">رؤيــة</span>
              </div>
            </a>
            <p className="footer-brand-desc">
              المنصة التعليمية الأولى المصممة خصيصًا لتواكب نظام البكالوريا المصري الجديد، بمحتوى احترافي مجاني للجميع.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={onOpenModal} style={{ padding: '0.7rem 1.4rem', fontSize: '0.92rem' }}>
                ابدأ مجانًا
              </button>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="footer-heading">روابط سريعة</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map((l, i) => (
                <li key={i}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="footer-heading">التواصل والدعم</h4>
            <ul className="footer-links">
              {SUPPORT_LINKS.map((l, i) => (
                <li key={i}><a href={l.href}>{l.label}</a></li>
              ))}
              <li>
                <a href="#hero" onClick={e => { e.preventDefault(); onOpenModal(); }}>
                  تسجيل دخول الطلاب
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© 2026 <span className="text-green-gradient" style={{ fontSize: 'inherit' }}>VISION (رؤية)</span>. جميع الحقوق محفوظة | البكالوريا المصرية الجديدة</p>
        </div>
      </div>
    </footer>
  );
}
