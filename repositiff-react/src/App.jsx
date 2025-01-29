import { Routes, Route, useLocation, Outlet } from "react-router-dom";
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

        {/* Rota para gerenciamento de cursos dentro de admin */}
        <Route path="/admin/course-management" element={<CourseManagement />} />

        <Route path="/bibliotecario/*" element={<LibrarianLayout />} />
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
        <Route path="editarPerfil" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;
