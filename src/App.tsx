import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./app/page";
import DashboardPage from "./app/dashboard/page";
import LensDetailPage from "./app/lenses/[id]/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/lenses/:id" element={<LensDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
