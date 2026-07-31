import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { logoutUser } from '../services/authService';
import { getUserDocument } from '../services/firestoreService';

const UserSessionContext = createContext(null);

export function UserSessionProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null); // Firestore document
  const [loadingAuth, setLoadingAuth]   = useState(true);

  // Local onboarding state (used while the user completes onboarding steps in-session)
  const [selectedGrade, setSelectedGrade]                   = useState(null);
  const [selectedPath, setSelectedPath]                     = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  // Derived: true when the logged-in user has role === 'admin' in Firestore
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Load Firestore profile when user logs in
        try {
          const profile = await getUserDocument(user.uid);
          if (profile) {
            setUserProfile(profile);
            // Seed local onboarding state from Firestore so grades/paths are
            // immediately available everywhere without a second fetch
            if (profile.grade)          setSelectedGrade(profile.grade);
            if (profile.path)           setSelectedPath(profile.path);
            if (profile.specialization) setSelectedSpecialization(profile.specialization);
          }
        } catch (err) {
          console.error('Failed to load user profile from Firestore:', err);
        }
      } else {
        // User signed out — clear everything
        setUserProfile(null);
        setSelectedGrade(null);
        setSelectedPath(null);
        setSelectedSpecialization(null);
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUserProfile(null);
    setSelectedGrade(null);
    setSelectedPath(null);
    setSelectedSpecialization(null);
  };

  return (
    <UserSessionContext.Provider
      value={{
        currentUser,
        userProfile,
        loadingAuth,
        logout,
        isAdmin,
        selectedGrade,
        setSelectedGrade,
        selectedPath,
        setSelectedPath,
        selectedSpecialization,
        setSelectedSpecialization,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserSession() {
  const ctx = useContext(UserSessionContext);
  if (!ctx) throw new Error('useUserSession must be used inside UserSessionProvider');
  return ctx;
}
