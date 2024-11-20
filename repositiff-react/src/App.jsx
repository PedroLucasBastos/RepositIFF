import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header/header";
import Rodape from "@/components/footer/footer";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import LibrarianDashboard from "./pages/librarianDashboard/librarianDashboard";
import LoggedInHeader from "./components/header/LoggedInHeader/loggedInHeader";
import ProtectedRoute from "./components/protectedRoute/porotectedRoute";

function App() {
  const location = useLocation();

  // Define qual cabeçalho usar com base na rota
  const isLoggedInRoute = location.pathname.startsWith("/bibliotecario");

  return (
    <>
      {isLoggedInRoute ? <LoggedInHeader /> : <Header />}
      <Routes>
        <Route path="*" element={<p>404 - Página não encontrada</p>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/bibliotecario"
          element={
            <ProtectedRoute>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Rodape />
    </>
  );
}

export default App;
