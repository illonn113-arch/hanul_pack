import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useVisitors } from './hooks/useVisitors';
import Home from './pages/Home';
import CompanyIntro from './pages/CompanyIntro';
import PalletWrappers from './pages/PalletWrappers';
import PalletWrapperDetail from './pages/PalletWrapperDetail';
import DeliveryCases from './pages/DeliveryCases';
import PackagingMaterials from './pages/PackagingMaterials';
import OptionsPage from './pages/OptionsPage';
import OptionDetail from './pages/OptionDetail';
import ProcessingSite from './pages/ProcessingSite';
import ContactPage from './pages/ContactPage';
import Admin from './pages/Admin';
import AdminPosts from './pages/AdminPosts';
import AdminInquiries from './pages/AdminInquiries';
import AdminSettings from './pages/AdminSettings';
import AdminWrappers from './pages/AdminWrappers';
import AdminOptions from './pages/AdminOptions';
import Login from './pages/Login';
import ClientLayout from './components/ClientLayout';
import ScrollToTop from './components/ScrollToTop';

function VisitTracker() {
  const { trackVisit } = useVisitors();
  useEffect(() => {
    trackVisit();
  }, []);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" />;

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <VisitTracker />
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white text-gray-900 selection:bg-[#FF6321]/10">
          <Routes>
            {/* Client Routes */}
            <Route element={
              <ClientLayout>
                <Outlet />
              </ClientLayout>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/company" element={<CompanyIntro />} />
              <Route path="/pallet-wrappers" element={<PalletWrappers />} />
              <Route path="/pallet-wrappers/:id" element={<PalletWrapperDetail />} />
              <Route path="/options" element={<OptionsPage />} />
              <Route path="/options/:id" element={<OptionDetail />} />
              <Route path="/processing-site" element={<ProcessingSite />} />
              <Route path="/delivery-cases" element={<DeliveryCases />} />
              <Route path="/packaging-materials" element={<PackagingMaterials />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/wrappers" element={
              <ProtectedRoute>
                <AdminWrappers />
              </ProtectedRoute>
            } />
            <Route path="/admin/options" element={
              <ProtectedRoute>
                <AdminOptions />
              </ProtectedRoute>
            } />
            <Route path="/admin/inquiries" element={
              <ProtectedRoute>
                <AdminInquiries />
              </ProtectedRoute>
            } />
            <Route path="/admin/delivery-cases" element={
              <ProtectedRoute>
                <AdminPosts mode="delivery-cases" />
              </ProtectedRoute>
            } />
            <Route path="/admin/processing-site" element={
              <ProtectedRoute>
                <AdminPosts mode="processing-site" />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
