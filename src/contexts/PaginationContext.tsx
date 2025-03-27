import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaginationState {
  users: {
    page: number;
    rowsPerPage: number;
    selectedOrgId: string | number;
  };
  organizations: {
    page: number;
    rowsPerPage: number;
  };
}

interface PaginationContextType {
  paginationState: PaginationState;
  updateUsersPagination: (data: Partial<PaginationState['users']>) => void;
  updateOrganizationsPagination: (data: Partial<PaginationState['organizations']>) => void;
}

const defaultState: PaginationState = {
  users: {
    page: 0,
    rowsPerPage: 10,
    selectedOrgId: 'all',
  },
  organizations: {
    page: 0,
    rowsPerPage: 10,
  },
};

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paginationState, setPaginationState] = useState<PaginationState>(() => {
    // Try to load from localStorage on initial render
    const savedState = localStorage.getItem('paginationState');
    return savedState ? JSON.parse(savedState) : defaultState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('paginationState', JSON.stringify(paginationState));
  }, [paginationState]);

  const updateUsersPagination = (data: Partial<PaginationState['users']>) => {
    setPaginationState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        ...data,
      },
    }));
  };

  const updateOrganizationsPagination = (data: Partial<PaginationState['organizations']>) => {
    setPaginationState(prev => ({
      ...prev,
      organizations: {
        ...prev.organizations,
        ...data,
      },
    }));
  };

  return (
    <PaginationContext.Provider
      value={{
        paginationState,
        updateUsersPagination,
        updateOrganizationsPagination,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};