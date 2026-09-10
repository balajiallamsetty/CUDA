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

  const refresh = useCallback(async () => {
    try {
      const res = await api.getMe();
      setUser(res.data.user);
      setPermissions(res.data.permissions || permissionsForRole(res.data.user.role));
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

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
    setUser(res.data.user);
    setPermissions(res.data.permissions || permissionsForRole(res.data.user.role));
    return res.data.user;
  }, []);

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
      logout,
      refresh,
      can,
      isStaff: user ? isStaffRole(user.role) : false,
    }),
    [user, permissions, loading, login, logout, refresh, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
