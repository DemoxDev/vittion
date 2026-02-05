import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./app/page";
import LoginPage from "./app/login/page";
import LoginCallbackPage from "./app/login/callback";
import DashboardPage from "./app/dashboard/page";
import DashboardOverview from "./app/dashboard/overview";
import DesignsPage from "./app/dashboard/designs/page";
import TreatmentsPage from "./app/dashboard/treatments/page";
import MaterialsPage from "./app/dashboard/materials/page";
import ImagesPage from "./app/dashboard/images/page";
import LensesDashboardPage from "./app/dashboard/lenses/page";
import LensesPage from "./app/lenses/page";
import LensDetailPage from "./app/lenses/[id]/page";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/callback" element={<LoginCallbackPage />} />
          <Route path="/lenses" element={<LensesPage />} />
          <Route path="/lenses/:id" element={<LensDetailPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="designs" element={<DesignsPage />} />
            <Route path="treatments" element={<TreatmentsPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="images" element={<ImagesPage />} />
            <Route path="lenses" element={<LensesDashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
