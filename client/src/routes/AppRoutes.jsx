import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
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
import AdminHomePage from '../pages/AdminHomePage';

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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
