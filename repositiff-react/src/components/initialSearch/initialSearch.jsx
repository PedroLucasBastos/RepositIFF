// src/components/initialSearch/initialSearch.jsx

import "./initialSearch.css";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ADICIONADO: Hooks do React para estado e navegação
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InitialSearch() {
  // ADICIONADO: Estado para armazenar o termo da busca
  const [searchTerm, setSearchTerm] = useState('');
  
  // ADICIONADO: Hook para controlar a navegação
  const navigate = useNavigate();

  // ADICIONADO: Função que é chamada ao submeter o formulário
  const handleSearch = (e) => {
    e.preventDefault(); // Previne o recarregamento padrão da página
    if (searchTerm.trim()) {
      // Navega para a página de busca, passando o termo na URL
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto mt-12 ">
      <div className="flex justify-center">
        <img
          className="mx-auto"
          src="/logos/repositIffLogo.svg"
          alt="LogoProjeto"
        />
      </div>

      {/* ADICIONADO: Tag <form> com o manipulador onSubmit */}
      <form onSubmit={handleSearch}>
        <div className="flex w-full max-w-[900px] items-center space-x-2">
          <Input
            type="search"
            placeholder="Busca por título, autor, palavra-chave..."
            // ADICIONADO: Conecta o input ao estado
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Este botão não é mais necessário dentro do formulário principal */}
          {/* <Button className="bg-botaoIFF hover:bg-green-800 " type="submit">
            Todos os campos
          </Button> */}
        </div>
        <div className="mt-5 flex justify-center space-x-4">
          <Button className="bg-botaoIFF hover:bg-green-800" type="submit">
            Pesquisar <AiOutlineSearch />
          </Button>
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-green-500"
            type="button" // Mudado para 'button' para não submeter o formulário
            onClick={() => navigate('/search')} // Leva para a busca avançada sem termo
          >
            Busca avançada
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InitialSearch;