import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Header from "./components/header/header";
import Rodape from "@/components/footer/footer";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import LibrarianDashboard from "./pages/librarianDashboard/librarianDashboard";
import LoggedInHeader from "./components/header/LoggedInHeader/loggedInHeader";
import ProtectedRoute from "./components/protectedRoute/porotectedRoute";
import NotFound from "./pages/error/404NotFound";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";
import ManageAdvisor from "./pages/librarianDashboard/manageAdvisor/manageAdvisor";

function App() {
  const location = useLocation();

  // Define qual cabeçalho usar com base na rota
  const isLoggedInRoute = location.pathname.startsWith("/bibliotecario");

  return (
    <>
      {isLoggedInRoute ? <LoggedInHeader /> : <Header />}
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/bibliotecario/*"
          element={
            <ProtectedRoute>
              <LibrarianLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Rodape />
    </>
  );
}

// Componente de Layout para o Bibliotecário
function LibrarianLayout() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LibrarianDashboard />} />
        <Route path="gerenciarOrientador" element={<ManageAdvisor />} />
      </Routes>
    </div>
  );
}

export default App;
