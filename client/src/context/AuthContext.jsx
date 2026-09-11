import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isStaffRole, permissionsForRole } from '@vignak/shared';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setPermissions([]);
  }, []);

  const applySession = useCallback((data) => {
    setUser(data.user);
    setPermissions(data.permissions || permissionsForRole(data.user.role));
    return data.user;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getMe();
      applySession(res.data);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    api.setUnauthorizedHandler(async () => {
      clearSession();
      if (
        typeof window !== 'undefined'
        && window.location.pathname.startsWith('/admin')
        && !window.location.pathname.includes('/login')
      ) {
        window.location.assign('/admin/login');
      }
    });
    return () => api.setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const res = await api.login({ email, password });
    return applySession(res.data);
  }, [applySession]);

  const register = useCallback(async (payload) => {
    const res = await api.register(payload);
    return applySession(res.data);
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const can = useCallback((permission) => permissions.includes(permission), [permissions]);

  const value = useMemo(
    () => ({
      user,
      permissions,
      loading,
      login,
      register,
      logout,
      refresh,
      can,
      isStaff: user ? isStaffRole(user.role) : false,
    }),
    [user, permissions, loading, login, register, logout, refresh, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
