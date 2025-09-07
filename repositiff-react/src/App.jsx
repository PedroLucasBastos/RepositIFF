import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header/header";
import Rodape from "@/components/footer/footer";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import LibrarianDashboard from "./pages/librarianDashboard/librarianDashboard";
import LoggedInHeader from "./components/header/LoggedInHeader/loggedInHeader";
import NotFound from "./pages/error/404NotFound";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";
import ManageAdvisor from "./pages/librarianDashboard/manageAdvisor/manageAdvisor";
import EditProfile from "./components/editProfile/editProfile";
import CourseManagement from "./pages/adminDashboard/courseManagement/courseManagement";
import ProtectedRoute from "./components/protectedRoute/protectedRoute"; // 👈 Importa a proteção
import PasswordRecovery from "./pages/passwordRecovery/passwordRecovery";
import SearchPage from "./pages/searches/SearchPage";
import SearchCE from "./pages/searches/SearchCE";
import SearchFST from "./pages/searches/SearchFST";
import TccDetailsPage from "./pages/searches/TccDetailsPage";
import AdminHeader from "./components/header/AdminHeader/adminHeader";

function App() {
  const location = useLocation();

  // Define qual cabeçalho usar com base na rota
  const isLibrarianRoute = location.pathname.startsWith("/bibliotecario");
  const isAdminRoute = location.pathname.startsWith("/admin");
  

  return (
    <>
      {isAdminRoute ? (
        <AdminHeader />
      ) : isLibrarianRoute ? (
        <LoggedInHeader />
      ) : (
        <Header />
      )}

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/course-management" element={<CourseManagement />} />
        <Route path="/reset-password" element={<PasswordRecovery />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/EngenhariaComputacao" element={<SearchCE />} />
        <Route path="/search/CienciaTecnologiaAlimentos" element={<SearchFST />} />
        <Route path="/tcc/:id" element={<TccDetailsPage />} />

        {/* 🔒 Rota protegida para bibliotecário */}
        <Route
          path="/bibliotecario/*"
          element={
            <ProtectedRoute>
              <LibrarianLayout />
            </ProtectedRoute>
          }
        />
        <Route
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
        path="/admin"
        />
      </Routes>
      <Rodape />
    </>
  );
}

// Layout de rotas do bibliotecário
function LibrarianLayout() {
  return (
    <Routes>
      <Route path="/" element={<LibrarianDashboard />} />
      <Route path="gerenciarOrientador" element={<ManageAdvisor />} />
      <Route path="editarPerfil" element={<EditProfile />} />

    </Routes>
  );
}

export default App;
