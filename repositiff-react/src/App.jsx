import { Routes, Route } from "react-router-dom";
import Cabecalho from "./components/cabecalho/cabecalho";
import Rodape from "@/components/rodape/rodape";
import Home from "./pages/home/home"; // Importe o componente Home
import Login from "./pages/login/login";

import Admin from "./pages/administrador/admin";

function App() {
  return (
    <>
      <Cabecalho /> {/* Cabeçalho será mantido em todas as páginas */}
      <Routes>
        {/* Rota principal agora renderiza o componente Home */}
        <Route path="*" element={<p>404 - Página não encontrada</p>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/administrador" element={<Admin />} />
        {/* Outras rotas */}
      </Routes>
      <Rodape /> {/* Rodapé será mantido em todas as páginas */}
    </>
  );
}

export default App;
