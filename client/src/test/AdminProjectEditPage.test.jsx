import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminProjectEditPage from '../pages/admin/AdminProjectEditPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import { vi, beforeEach } from 'vitest';
import * as api from '../services/api';

vi.mock('../services/api');

describe('AdminProjectEditPage', () => {
  beforeEach(() => {
    vi.mocked(api.getMe).mockRejectedValue(new Error('unauthenticated'));
  });

  it('renders required project fields', () => {
    render(
      <MemoryRouter initialEntries={['/admin/projects/new']}>
        <AuthProvider>
          <ToastProvider>
            <AdminProjectEditPage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });
});
