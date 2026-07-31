import React, { useState, useEffect } from 'react';
import LogoSvg from './LogoSvg';
import { ArrowLeft, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#hero', label: 'الرئيسية' },
  { href: '#opening', label: 'عن رؤية' },
  { href: '#pathways', label: 'المسارات' },
  { href: '#foundation', label: 'القاعدة' },
  { href: '#experience', label: 'التجربة' },
  { href: '#why-us', label: 'لماذا رؤية؟' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
];

export default function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sectionIds = NAV_ITEMS.map(n => n.href.replace('#', ''));
      let current = 'hero';
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) current = id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrapper">

        {/* Logo */}
        <a href="#hero" className="brand-logo">
          <div className="logo-emblem">
            <LogoSvg width={34} height={34} />
          </div>
          <div className="brand-text-group">
            <span className="brand-name-en">VISION</span>
            <span className="brand-name-ar">رؤيــة</span>
          </div>
        </a>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Nav Menu */}
        <nav>
          <ul className={`nav-menu ${mobileOpen ? 'active' : ''}`}>
            {NAV_ITEMS.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-link ${activeSection === item.href.replace('#', '') ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button className="btn-primary" onClick={() => { setMobileOpen(false); onOpenModal(); }}>
                <span>ابدأ مجانًا</span>
                <ArrowLeft size={18} />
              </button>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
