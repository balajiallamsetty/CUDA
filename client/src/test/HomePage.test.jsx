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
  });

  it('renders the hero headline and CTAs', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <HomePage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: /building technology, experiences and connections that move people forward/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Start a Project').length).toBeGreaterThan(0);
    expect(screen.getByText('Explore Vignak')).toBeInTheDocument();
  });
});
