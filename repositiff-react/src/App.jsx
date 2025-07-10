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
        <Route path="/admin/course-management" element={<CourseManagement />} />

        {/* 🔒 Rota protegida para bibliotecário */}
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
