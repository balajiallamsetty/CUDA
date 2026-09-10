import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminShell from '../layouts/AdminShell';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SolutionsPage from '../pages/SolutionsPage';
import WebServicesPage from '../pages/WebServicesPage';
import CustomDigitalPage from '../pages/CustomDigitalPage';
import CustomizedPage from '../pages/CustomizedPage';
import GiftsPage from '../pages/GiftsPage';
import ConferenceKitsPage from '../pages/ConferenceKitsPage';
import TalksPage from '../pages/TalksPage';
import TalkDetailPage from '../pages/TalkDetailPage';
import PortfolioPage from '../pages/PortfolioPage';
import PortfolioDetailPage from '../pages/PortfolioDetailPage';
import ContactPage from '../pages/ContactPage';
import StartProjectPage from '../pages/StartProjectPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminLeadsPage from '../pages/admin/AdminLeadsPage';
import AdminLeadDetailPage from '../pages/admin/AdminLeadDetailPage';
import AdminInquiriesPage from '../pages/admin/AdminInquiriesPage';
import AdminInquiryDetailPage from '../pages/admin/AdminInquiryDetailPage';
import AdminProjectsPage from '../pages/admin/AdminProjectsPage';
import AdminProjectEditPage from '../pages/admin/AdminProjectEditPage';
import AdminTalksPage from '../pages/admin/AdminTalksPage';
import AdminTalkEditPage from '../pages/admin/AdminTalkEditPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="solutions/web-services" element={<WebServicesPage />} />
        <Route path="solutions/custom-digital-solutions" element={<CustomDigitalPage />} />
        <Route path="customized" element={<CustomizedPage />} />
        <Route path="customized/gifts" element={<GiftsPage />} />
        <Route path="customized/conference-kits" element={<ConferenceKitsPage />} />
        <Route path="talks" element={<TalksPage />} />
        <Route path="talks/:slug" element={<TalkDetailPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="start-project" element={<StartProjectPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="leads/:id" element={<AdminLeadDetailPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} />
        <Route path="inquiries/:id" element={<AdminInquiryDetailPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/new" element={<AdminProjectEditPage />} />
        <Route path="projects/:id/edit" element={<AdminProjectEditPage />} />
        <Route path="talks" element={<AdminTalksPage />} />
        <Route path="talks/new" element={<AdminTalkEditPage />} />
        <Route path="talks/:id/edit" element={<AdminTalkEditPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
