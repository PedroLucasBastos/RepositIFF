import "./buscainicial.css";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function BuscaInicial() {
  return (
    <div className="max-w-[800px] mx-auto mt-12 ">
      <div className="flex justify-center">
        <img
          className="mx-auto"
          src="/logos/repositIffLogo.svg"
          alt="LogoProjeto"
        />
      </div>
      <div className="flex w-full max-w-[900px] items-center space-x-2">
        <Input type="busca" placeholder="Busca" />
        <Button className="bg-botaoIFF hover:bg-green-800 " type="submit">
          Todos os campos
        </Button>
      </div>
      <div className="mt-5 flex justify-center space-x-4">
        <Button className="bg-botaoIFF hover:bg-green-800" type="submit">
          Pesquisar <AiOutlineSearch />
        </Button>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-green-500"
          type="submit"
        >
          Busca avançada
        </Button>
      </div>
    </div>
  );
}

export default BuscaInicial;
