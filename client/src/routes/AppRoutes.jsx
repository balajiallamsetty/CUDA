import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminShell from '../layouts/AdminShell';
import { Loading } from '../components/ui/Loading';
import RequirePermission from '../components/admin/RequirePermission';
import { PERMISSIONS } from '@vignak/shared';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const SolutionsPage = lazy(() => import('../pages/SolutionsPage'));
const WebServicesPage = lazy(() => import('../pages/WebServicesPage'));
const CustomDigitalPage = lazy(() => import('../pages/CustomDigitalPage'));
const CustomizedPage = lazy(() => import('../pages/CustomizedPage'));
const GiftsPage = lazy(() => import('../pages/GiftsPage'));
const ConferenceKitsPage = lazy(() => import('../pages/ConferenceKitsPage'));
const TalksPage = lazy(() => import('../pages/TalksPage'));
const TalkDetailPage = lazy(() => import('../pages/TalkDetailPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('../pages/PortfolioDetailPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const StartProjectPage = lazy(() => import('../pages/StartProjectPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminLeadsPage = lazy(() => import('../pages/admin/AdminLeadsPage'));
const AdminLeadDetailPage = lazy(() => import('../pages/admin/AdminLeadDetailPage'));
const AdminInquiriesPage = lazy(() => import('../pages/admin/AdminInquiriesPage'));
const AdminInquiryDetailPage = lazy(() => import('../pages/admin/AdminInquiryDetailPage'));
const AdminProjectsPage = lazy(() => import('../pages/admin/AdminProjectsPage'));
const AdminProjectEditPage = lazy(() => import('../pages/admin/AdminProjectEditPage'));
const AdminTalksPage = lazy(() => import('../pages/admin/AdminTalksPage'));
const AdminTalkEditPage = lazy(() => import('../pages/admin/AdminTalkEditPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));

function RouteFallback() {
  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <Loading label="Loading…" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
          <Route
            path="dashboard"
            element={(
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <AdminDashboardPage />
              </RequirePermission>
            )}
          />
          <Route
            path="leads"
            element={(
              <RequirePermission permission={PERMISSIONS.LEADS_READ}>
                <AdminLeadsPage />
              </RequirePermission>
            )}
          />
          <Route
            path="leads/:id"
            element={(
              <RequirePermission permission={PERMISSIONS.LEADS_READ}>
                <AdminLeadDetailPage />
              </RequirePermission>
            )}
          />
          <Route
            path="inquiries"
            element={(
              <RequirePermission permission={PERMISSIONS.INQUIRIES_READ}>
                <AdminInquiriesPage />
              </RequirePermission>
            )}
          />
          <Route
            path="inquiries/:id"
            element={(
              <RequirePermission permission={PERMISSIONS.INQUIRIES_READ}>
                <AdminInquiryDetailPage />
              </RequirePermission>
            )}
          />
          <Route
            path="projects"
            element={(
              <RequirePermission permission={PERMISSIONS.PROJECTS_READ}>
                <AdminProjectsPage />
              </RequirePermission>
            )}
          />
          <Route
            path="projects/new"
            element={(
              <RequirePermission permission={PERMISSIONS.PROJECTS_WRITE}>
                <AdminProjectEditPage />
              </RequirePermission>
            )}
          />
          <Route
            path="projects/:id/edit"
            element={(
              <RequirePermission permission={PERMISSIONS.PROJECTS_WRITE}>
                <AdminProjectEditPage />
              </RequirePermission>
            )}
          />
          <Route
            path="talks"
            element={(
              <RequirePermission permission={PERMISSIONS.TALKS_READ}>
                <AdminTalksPage />
              </RequirePermission>
            )}
          />
          <Route
            path="talks/new"
            element={(
              <RequirePermission permission={PERMISSIONS.TALKS_WRITE}>
                <AdminTalkEditPage />
              </RequirePermission>
            )}
          />
          <Route
            path="talks/:id/edit"
            element={(
              <RequirePermission permission={PERMISSIONS.TALKS_WRITE}>
                <AdminTalkEditPage />
              </RequirePermission>
            )}
          />
          <Route
            path="users"
            element={(
              <RequirePermission permission={PERMISSIONS.USERS_READ}>
                <AdminUsersPage />
              </RequirePermission>
            )}
          />
          <Route
            path="settings"
            element={(
              <RequirePermission permission={PERMISSIONS.SETTINGS_READ}>
                <AdminSettingsPage />
              </RequirePermission>
            )}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
