import React, { createContext, useContext, useState } from 'react';

const UserSessionContext = createContext(null);

export function UserSessionProvider({ children }) {
  const [selectedGrade, setSelectedGrade] = useState(null); // 'grade-1' | 'grade-2'
  const [selectedPath, setSelectedPath]   = useState(null); // set on /select-path
  const [selectedSpecialization, setSelectedSpecialization] = useState(null); // set on /select-specialization

  return (
    <UserSessionContext.Provider
      value={{ selectedGrade, setSelectedGrade, selectedPath, setSelectedPath, selectedSpecialization, setSelectedSpecialization }}
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
