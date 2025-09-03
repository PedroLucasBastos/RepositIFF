// src/pages/searches/SearchPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import TccResultCard from '@/components/tccResultCard/TccResultCard';
import { AiOutlineSearch } from "react-icons/ai";

const SearchFST = () => {
  const [allWorks, setAllWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados para os filtros
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [author, setAuthor] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 1. Carregamento e FILTRO INICIAL
  useEffect(() => {
    const fetchAllWorks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3333/academicWork/");
        
        if (!response.ok) {
          throw new Error("Erro na resposta do servidor: " + response.statusText);
        }
        
        const data = await response.json();
        const worksData = data.result || [];
        
        // ADICIONADO: Filtro para Engenharia da Computação
        const computerEngineeringWorks = worksData.filter(
          work => work.course?.name === 'Ciência e Tecnologia de Alimentos'
        );
        
        setAllWorks(computerEngineeringWorks);
        
        toast.success(`${computerEngineeringWorks.length} trabalhos de Ciência e Tecnologia de Alimentos carregados.`);
      } catch (error) {
        toast.error('Falha ao carregar os trabalhos do repositório.');
        console.error('Erro ao buscar todos os trabalhos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllWorks();
  }, []);

  // 2. Lógica de filtragem (continua a mesma)
  const filteredResults = useMemo(() => {
    let filtered = allWorks;

    if (query) {
      const normalizedQuery = query.toLowerCase();
      filtered = filtered.filter(work =>
        work.title.toLowerCase().includes(normalizedQuery) ||
        (work.keywords && work.keywords.some(kw => kw.toLowerCase().includes(normalizedQuery)))
      );
    }
    if (author) {
      const normalizedAuthor = author.toLowerCase();
      filtered = filtered.filter(work =>
        work.authors && work.authors.some(a => a.toLowerCase().includes(normalizedAuthor))
      );
    }
    if (advisor) {
      const normalizedAdvisor = advisor.toLowerCase();
      filtered = filtered.filter(work =>
        work.advisors && work.advisors.some(adv => 
          `${adv.name} ${adv.surname}`.toLowerCase().includes(normalizedAdvisor)
        )
      );
    }
    if (startDate) {
      filtered = filtered.filter(work => work.year >= parseInt(startDate, 10));
    }
    if (endDate) {
       filtered = filtered.filter(work => work.year <= parseInt(endDate, 10));
    }

    return filtered;
  }, [allWorks, query, author, advisor, startDate, endDate]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Toaster richColors />
      
      <header className="mb-8 text-center">
        <img
          className="mx-auto mb-4 h-20"
          src="/logos/repositIffLogo.svg"
          alt="Logo RepositIFF"
        />
        <div className="max-w-2xl mx-auto">
            <div className="flex w-full items-center space-x-2">
                <Input 
                    type="search" 
                    placeholder="Buscar por título, autor, palavra-chave..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="text-lg p-4"
                />
                <Button className="bg-botaoIFF hover:bg-green-800 p-4" type="button">
                    <AiOutlineSearch size={24} />
                </Button>
            </div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="p-6 bg-gray-50 rounded-lg shadow sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Refinar a Busca</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <Input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Silva, João..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Orientador</label>
                <Input type="text" value={advisor} onChange={(e) => setAdvisor(e.target.value)} placeholder="Santos, Maria..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ano de Publicação (De)</label>
                <Input type="number" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Ex: 2020" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Ano de Publicação (Até)</label>
                <Input type="number" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Ex: 2024" />
              </div>
            </div>
          </div>
        </aside>
        
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Carregando...' : `Mostrando ${filteredResults.length} resultados`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10"><p>Carregando trabalhos do repositório...</p></div>
          ) : (
            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((tcc) => <TccResultCard key={tcc.id} tcc={tcc} />)
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg"><p>Nenhum trabalho de Engenharia de Computação encontrado.</p></div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchFST;