// Home.jsx
import BuscaInicial from "@/components/buscaInicial/buscaInicial";
import ItensColetados from "@/components/itensColetados/itensColetados";
import Sobre from "@/components/sobre/sobre";

function Home() {
  return (
    <div>
      <BuscaInicial />
      <ItensColetados />
      <Sobre />
    </div>
  );
}

export default Home;
