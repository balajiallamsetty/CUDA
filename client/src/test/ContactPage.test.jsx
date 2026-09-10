import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactPage from '../pages/ContactPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import * as api from '../services/api';

vi.mock('../services/api');

function renderContact() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <ContactPage />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ContactPage', () => {
  beforeEach(() => {
    vi.mocked(api.getMe).mockRejectedValue(new Error('unauthenticated'));
    vi.mocked(api.createContact).mockResolvedValue({ success: true });
  });

  it('renders the contact form', () => {
    renderContact();
    expect(screen.getByRole('heading', { name: /tell us what you are working on/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();
    renderContact();
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findAllByText(/is required/i)).not.toHaveLength(0);
    expect(api.createContact).not.toHaveBeenCalled();
  });
});
