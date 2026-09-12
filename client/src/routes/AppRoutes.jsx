import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminShell from '../layouts/AdminShell';
import DashboardLayout from '../layouts/DashboardLayout';
import { Loading } from '../components/ui/Loading';
import RequirePermission from '../components/admin/RequirePermission';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { PERMISSIONS } from '@vignak/shared';

const ServicesCatalogPage = lazy(() => import('../pages/ServicesCatalogPage'));
const ServiceDetailPage = lazy(() => import('../pages/ServiceDetailPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectAssistancePage = lazy(() => import('../pages/ProjectAssistancePage'));
const DomainLandingPage = lazy(() => import('../pages/DomainLandingPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const TalksPage = lazy(() => import('../pages/TalksPage'));
const TalkDetailPage = lazy(() => import('../pages/TalkDetailPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('../pages/PortfolioDetailPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const StartProjectPage = lazy(() => import('../pages/StartProjectPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const StudentDashboardPage = lazy(() => import('../pages/dashboard/StudentDashboardPage'));
const MyRequestsPage = lazy(() => import('../pages/dashboard/MyRequestsPage'));
const MyRequestDetailPage = lazy(() => import('../pages/dashboard/MyRequestDetailPage'));
const NewRequestPage = lazy(() => import('../pages/dashboard/NewRequestPage'));
const ProfilePage = lazy(() => import('../pages/dashboard/ProfilePage'));
const MyProjectsPage = lazy(() => import('../pages/dashboard/MyProjectsPage'));
const MyProjectDetailPage = lazy(() => import('../pages/dashboard/MyProjectDetailPage'));
const NotificationsPage = lazy(() => import('../pages/dashboard/NotificationsPage'));
const PaymentsPage = lazy(() => import('../pages/dashboard/PaymentsPage'));
const QuotationsPage = lazy(() => import('../pages/dashboard/QuotationsPage'));
const DeliverablesPage = lazy(() => import('../pages/dashboard/DeliverablesPage'));
const SupportPage = lazy(() => import('../pages/dashboard/SupportPage'));
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
const AdminServiceRequestsPage = lazy(() => import('../pages/admin/AdminServiceRequestsPage'));
const AdminServiceRequestDetailPage = lazy(() => import('../pages/admin/AdminServiceRequestDetailPage'));
const AdminWorkProjectsPage = lazy(() => import('../pages/admin/AdminWorkProjectsPage'));
const AdminWorkProjectDetailPage = lazy(() => import('../pages/admin/AdminWorkProjectDetailPage'));
const AdminServiceDefinitionsPage = lazy(() => import('../pages/admin/AdminServiceDefinitionsPage'));
const AdminAssignedOverviewPage = lazy(() => import('../pages/admin/AdminAssignedOverviewPage'));

function RouteFallback() {
  return (
    <div className="p-12 text-center">
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
          <Route path="project-assistance" element={<ProjectAssistancePage />} />
          <Route path="project-assistance/domains/:domainId" element={<DomainLandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesCatalogPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="solutions" element={<Navigate to="/services" replace />} />
          <Route path="solutions/web-services" element={<Navigate to="/services/web-development" replace />} />
          <Route path="solutions/custom-digital-solutions" element={<Navigate to="/services/business-startup-digital" replace />} />
          <Route path="customized" element={<Navigate to="/services" replace />} />
          <Route path="customized/gifts" element={<Navigate to="/services/customized-gifts-conference-kits" replace />} />
          <Route path="customized/conference-kits" element={<Navigate to="/services/customized-gifts-conference-kits" replace />} />
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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<StudentDashboardPage />} />
          <Route path="requests" element={<MyRequestsPage />} />
          <Route path="requests/new" element={<NewRequestPage />} />
          <Route path="requests/:id" element={<MyRequestDetailPage />} />
          <Route path="projects" element={<MyProjectsPage />} />
          <Route path="projects/:id" element={<MyProjectDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="deliverables" element={<DeliverablesPage />} />
          <Route path="support" element={<SupportPage />} />
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
            path="service-requests"
            element={(
              <RequirePermission permission={PERMISSIONS.SERVICE_REQUESTS_READ}>
                <AdminServiceRequestsPage />
              </RequirePermission>
            )}
          />
          <Route
            path="service-requests/:id"
            element={(
              <RequirePermission permission={PERMISSIONS.SERVICE_REQUESTS_READ}>
                <AdminServiceRequestDetailPage />
              </RequirePermission>
            )}
          />
          <Route
            path="work-projects"
            element={(
              <RequirePermission permission={PERMISSIONS.WORK_PROJECTS_READ}>
                <AdminWorkProjectsPage />
              </RequirePermission>
            )}
          />
          <Route
            path="work-projects/:id"
            element={(
              <RequirePermission permission={PERMISSIONS.WORK_PROJECTS_READ}>
                <AdminWorkProjectDetailPage />
              </RequirePermission>
            )}
          />
          <Route
            path="service-definitions"
            element={(
              <RequirePermission permission={PERMISSIONS.SERVICES_READ}>
                <AdminServiceDefinitionsPage />
              </RequirePermission>
            )}
          />
          <Route
            path="assigned-overview"
            element={(
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <AdminAssignedOverviewPage />
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
