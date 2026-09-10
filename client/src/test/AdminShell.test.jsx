import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminShell from '../layouts/AdminShell';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import * as api from '../services/api';
import { ROLES } from '@vignak/shared';

vi.mock('../services/api');

describe('AdminShell', () => {
  beforeEach(() => {
    vi.mocked(api.getMe).mockResolvedValue({
      data: {
        user: {
          id: '1',
          name: 'Sales User',
          email: 'sales@test.com',
          role: ROLES.SALES,
          isActive: true,
        },
        permissions: [
          'dashboard:read',
          'leads:read',
          'leads:write',
          'inquiries:read',
          'inquiries:write',
        ],
      },
    });
  });

  it('shows sales-relevant navigation and hides users', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AuthProvider>
          <ToastProvider>
            <AdminShell />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Leads')).toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });
});
