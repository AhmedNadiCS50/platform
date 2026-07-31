import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserSession } from '../context/UserSessionContext';
import { Loader2 } from 'lucide-react';
import LogoSvg from './LogoSvg';

/**
 * ProtectedRoute component that verifies Firebase Authentication state.
 * - Displays a loading screen while Firebase checks token validity.
 * - Redirects unauthenticated users to /login automatically.
 * - Renders protected child components or Outlet for authenticated users.
 */
export default function ProtectedRoute({ children }) {
  const { currentUser, loadingAuth } = useUserSession();

  if (loadingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-base)',
          color: 'var(--text-main)',
          gap: '1.2rem',
          direction: 'rtl',
          fontFamily: 'var(--font-body-ar)',
        }}
      >
        <div className="logo-emblem" style={{ width: 64, height: 64 }}>
          <LogoSvg width={40} height={40} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--green-neon)', fontWeight: 700 }}>
          <Loader2 size={22} className="spin-icon" />
          <span>جاري التحقق من حالة الحساب...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
