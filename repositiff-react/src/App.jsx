import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Rodape from "@/components/footer/footer";
import Home from "./pages/home/home"; // Importe o componente Home
import Login from "./pages/login/login";

import LibrarianDashboard from "./pages/librarianDashboard/librarianDashboard";
import ProtectedRoute from "./components/protectedRoute/porotectedRoute";

function App() {
  return (
    <>
      <Header /> {/* Cabeçalho será mantido em todas as páginas */}
      <Routes>
        {/* Rota principal agora renderiza o componente Home */}
        <Route path="*" element={<p>404 - Página não encontrada</p>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/administrador"
          element={
            <ProtectedRoute>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        {/* Outras rotas */}
      </Routes>
      <Rodape /> {/* Rodapé será mantido em todas as páginas */}
    </>
  );
}

export default App;
