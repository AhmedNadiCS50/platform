import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserSession } from '../context/UserSessionContext';
import { Loader2 } from 'lucide-react';
import LogoSvg from './LogoSvg';

/**
 * ProtectedRoute component that verifies Firebase Authentication and Onboarding State.
 * - Displays a loading screen while Firebase checks token validity and loads Firestore user profile.
 * - Redirects unauthenticated users to /login automatically.
 * - Redirects users with incomplete onboarding to the appropriate setup step when attempting to access dashboard pages.
 */
export default function ProtectedRoute({ children, allowIncompleteOnboarding = false }) {
  const { currentUser, userProfile, loadingAuth } = useUserSession();
  const location = useLocation();

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
          <span>جاري التحقق من الحساب وتحميل البيانات...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check onboarding completeness for dashboard and main routes
  if (!allowIncompleteOnboarding) {
    const hasGrade = Boolean(userProfile?.grade);
    const hasPath  = Boolean(userProfile?.path);
    const hasSpec  = Boolean(userProfile?.specialization);

    if (!hasGrade) {
      return <Navigate to="/select-grade" replace />;
    }
    if (!hasPath) {
      return <Navigate to="/select-path" replace />;
    }
    if (!hasSpec) {
      return <Navigate to="/select-specialization" replace />;
    }
  }

  return children ? children : <Outlet />;
}
