import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '../components/layout/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import * as api from '../services/api';

vi.mock('../services/api');

describe('Navbar', () => {
  beforeEach(() => {
    vi.mocked(api.getMe).mockRejectedValue(new Error('unauthenticated'));
  });

  it('renders primary navigation and CTA', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Vignak')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(screen.getAllByText('Start Your Project').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Project Assistance').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Talks').length).toBeGreaterThan(0);
  });
});
