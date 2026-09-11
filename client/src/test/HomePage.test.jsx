import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import HomePage from '../pages/HomePage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import * as api from '../services/api';

vi.mock('../services/api');

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(api.getMe).mockRejectedValue(new Error('unauthenticated'));
    vi.mocked(api.getPublicProjects).mockResolvedValue({ data: [] });
  });

  it('renders Project Assistance hero and CTAs', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <HomePage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Vignak Solutions')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /turn your project idea into a working technical project/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Start Your Project').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Explore Project Assistance').length).toBeGreaterThan(0);
  });
});
