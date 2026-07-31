import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  TrendingUp,
  Trophy,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import LogoSvg from '../components/LogoSvg';
import { useUserSession } from '../context/UserSessionContext';

const SIDEBAR_ITEMS = [
  { path: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { path: '/dashboard/subjects', label: 'المواد', icon: BookOpen },
  { path: '/dashboard/exams', label: 'الاختبارات', icon: FileCheck2 },
  { path: '/dashboard/progress', label: 'التقدم', icon: TrendingUp },
  { path: '/dashboard/achievements', label: 'الإنجازات', icon: Trophy },
  { path: '/dashboard/profile', label: 'الملف الشخصي', icon: User },
  { path: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser, userProfile, logout, selectedGrade } = useUserSession();

  // Resolve display name: Firestore fullName > Auth displayName > email prefix > fallback
  const userName = userProfile?.fullName
    || currentUser?.displayName
    || currentUser?.email?.split('@')[0]
    || 'طالب جديد';

  const userInitials = userName.trim().substring(0, 2);

  const gradeName = (() => {
    const g = userProfile?.grade || selectedGrade;
    if (g === 'grade-1') return 'الصف الأول الثانوي';
    if (g === 'grade-2') return 'الصف الثاني الثانوي';
    if (g === 'grade-3') return 'الصف الثالث الثانوي';
    return 'طالب جديد';
  })();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="dash-container">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="dash-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Sidebar Header / Logo */}
        <div className="dash-sidebar-header">
          <NavLink to="/" className="dash-logo">
            <div className="logo-emblem" style={{ width: 42, height: 42 }}>
              <LogoSvg width={26} height={26} />
            </div>
            <div className="brand-text-group">
              <span className="brand-name-ar" style={{ fontSize: '1.25rem' }}>رؤيــة</span>
              <span className="dash-badge-pro">PRO</span>
            </div>
          </NavLink>
          <button
            className="dash-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X size={22} />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="dash-sidebar-user">
          <div className="dash-user-avatar">
            <span>{userInitials}</span>
          </div>
          <div className="dash-user-info">
            <span className="dash-user-name">{userName}</span>
            <span className="dash-user-grade">{gradeName}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="dash-nav">
          <span className="dash-nav-title">القائمة الرئيسية</span>
          <ul className="dash-nav-list">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `dash-nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={20} className="dash-nav-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout at Bottom */}
        <div className="dash-sidebar-footer">
          <button type="button" className="dash-logout-btn" onClick={handleLogout}>
            <LogOut size={19} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dash-main-wrapper">
        {/* Top Navigation */}
        <header className="dash-header">
          <div className="dash-header-left">
            <button
              type="button"
              className="dash-menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="dash-search-wrap">
              <Search size={18} className="dash-search-icon" />
              <input
                type="text"
                placeholder="ابحث عن دروس، اختبارات، مواضيع..."
                className="dash-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="dash-header-right">
            {/* Notifications */}
            <button type="button" className="dash-icon-btn" aria-label="الإشعارات">
              <Bell size={20} />
              <span className="dash-notification-dot" />
            </button>

            {/* User Profile Dropdown snippet */}
            <div className="dash-profile-chip" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
              <div className="dash-chip-avatar">{userInitials}</div>
              <div className="dash-chip-details">
                <span className="dash-chip-name">{userName}</span>
                <span className="dash-chip-role">{gradeName}</span>
              </div>
              <ChevronDown size={16} className="dash-chip-arrow" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="dash-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
