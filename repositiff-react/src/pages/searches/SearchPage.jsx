// src/pages/searches/SearchPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Button, Checkbox, Tag, Spin, Empty } from 'antd';
import { Toaster, toast } from 'sonner';
import TccResultCard from '@/components/tccResultCard/TccResultCard';

const SearchPage = () => {
    const [allWorks, setAllWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados para os inputs
    const [queryInput, setQueryInput] = useState(searchParams.get('query') || '');
    const [startDateInput, setStartDateInput] = useState('');
    const [endDateInput, setEndDateInput] = useState('');
    const [keywordsInput, setKeywordsInput] = useState('');

    // Estados para os filtros aplicados
    const [appliedQuery, setAppliedQuery] = useState(searchParams.get('query') || '');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');
    const [appliedKeywords, setAppliedKeywords] = useState('');

    // Estados de facetas
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAdvisors, setSelectedAdvisors] = useState([]);

    // useEffect para busca "ao vivo" com debounce na barra principal
    useEffect(() => {
        const timer = setTimeout(() => {
            setAppliedQuery(queryInput);
        }, 500); // Meio segundo de espera

        return () => {
            clearTimeout(timer);
        };
    }, [queryInput]);

    // Carregamento inicial de todos os trabalhos
    useEffect(() => {
        const fetchAllWorks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:3333/academicWork/");
                if (!response.ok) throw new Error("Erro na resposta do servidor");
                const data = await response.json();
                setAllWorks(data.result || []);
            } catch (error) {
                toast.error('Falha ao carregar os trabalhos do repositório.');
                console.error('Erro ao buscar todos os trabalhos:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllWorks();
    }, []);

    // Lógica de filtragem base
    const baseFilteredResults = useMemo(() => {
        let filtered = allWorks;

        // Busca principal (Título OU Palavra-chave)
        if (appliedQuery) {
            const normalizedQuery = appliedQuery.toLowerCase();
            filtered = filtered.filter(work => 
                work.title.toLowerCase().includes(normalizedQuery) || 
                (work.keyWords && Array.isArray(work.keyWords) && work.keyWords.some(kw => kw.toLowerCase().includes(normalizedQuery)))
            );
        }

        // Filtro dedicado de palavra-chave da barra lateral
        if (appliedKeywords) {
            const normalizedKeywords = appliedKeywords.toLowerCase();
            filtered = filtered.filter(work => {
                if (!work.keyWords) return false;
                if (Array.isArray(work.keyWords)) return work.keyWords.some(kw => kw.toLowerCase().includes(normalizedKeywords));
                if (typeof work.keyWords === 'string') return work.keyWords.toLowerCase().includes(normalizedKeywords);
                return false;
            });
        }

        if (appliedStartDate) {
            filtered = filtered.filter(work => work.year >= parseInt(appliedStartDate, 10));
        }
        if (appliedEndDate) {
            filtered = filtered.filter(work => work.year <= parseInt(appliedEndDate, 10));
        }
        return filtered;
    }, [allWorks, appliedQuery, appliedStartDate, appliedEndDate, appliedKeywords]);

    // Lógica para calcular as facetas de autores
    const authorFacets = useMemo(() => {
        const counts = new Map();
        const relevantWorks = baseFilteredResults.filter(work =>
            selectedAdvisors.length === 0 || (work.advisors && work.advisors.some(adv => selectedAdvisors.includes(`${adv.name} ${adv.surname}`)))
        );
        relevantWorks.forEach(work => {
            work.authors?.forEach(author => {
                counts.set(author, (counts.get(author) || 0) + 1);
            });
        });
        return Array.from(counts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [baseFilteredResults, selectedAdvisors]);

    // Lógica para calcular as facetas de orientadores
    const advisorFacets = useMemo(() => {
        const counts = new Map();
        const relevantWorks = baseFilteredResults.filter(work =>
            selectedAuthors.length === 0 || (work.authors && work.authors.some(author => selectedAuthors.includes(author)))
        );
        relevantWorks.forEach(work => {
            work.advisors?.forEach(advisor => {
                const fullName = `${advisor.name} ${advisor.surname}`;
                counts.set(fullName, (counts.get(fullName) || 0) + 1);
            });
        });
        return Array.from(counts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [baseFilteredResults, selectedAuthors]);

    // Lógica de filtragem final
    const filteredResults = useMemo(() => {
        let filtered = baseFilteredResults;
        if (selectedAuthors.length > 0) {
            filtered = filtered.filter(work =>
                work.authors && work.authors.some(author => selectedAuthors.includes(author))
            );
        }
        if (selectedAdvisors.length > 0) {
            filtered = filtered.filter(work =>
                work.advisors && work.advisors.some(adv => selectedAdvisors.includes(`${adv.name} ${adv.surname}`))
            );
        }
        return filtered;
    }, [baseFilteredResults, selectedAuthors, selectedAdvisors]);

    // Funções para manipular os filtros da barra lateral
    const handleApplySidebarFilters = () => {
        setAppliedStartDate(startDateInput);
        setAppliedEndDate(endDateInput);
        setAppliedKeywords(keywordsInput);
        toast.success("Filtros da barra lateral aplicados!");
    };

    const handleClearAllFilters = () => {
        setQueryInput('');
        setStartDateInput('');
        setEndDateInput('');
        setKeywordsInput('');
        setAppliedQuery('');
        setAppliedStartDate('');
        setAppliedEndDate('');
        setAppliedKeywords('');
        setSelectedAuthors([]);
        setSelectedAdvisors([]);
        toast.info("Todos os filtros foram removidos.");
    };

    const handleAuthorSelection = (e) => {
        const authorName = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedAuthors(prev => [...prev, authorName]);
        } else {
            setSelectedAuthors(prev => prev.filter(a => a !== authorName));
        }
    };

    const handleAdvisorSelection = (e) => {
        const advisorName = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedAdvisors(prev => [...prev, advisorName]);
        } else {
            setSelectedAdvisors(prev => prev.filter(a => a !== advisorName));
        }
    };

    // Lista de filtros ativos para renderizar as tags
    const activeFilters = [
        { key: 'keywords', label: 'Palavra-chave (filtro)', value: appliedKeywords, clear: () => setAppliedKeywords('') },
        { key: 'startDate', label: 'De', value: appliedStartDate, clear: () => setAppliedStartDate('') },
        { key: 'endDate', label: 'Até', value: appliedEndDate, clear: () => setAppliedEndDate('') },
        ...selectedAuthors.map(author => ({ key: `author_${author}`, label: 'Autor', value: author, clear: () => handleAuthorSelection({ target: { value: author, checked: false } }) })),
        ...selectedAdvisors.map(advisor => ({ key: `advisor_${advisor}`, label: 'Orientador', value: advisor, clear: () => handleAdvisorSelection({ target: { value: advisor, checked: false } }) })),
    ].filter(f => f.value);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Toaster richColors />

            <header className="mb-8 text-center">
                <img className="mx-auto mb-4 h-20" src="/logos/repositIffLogo.svg" alt="Logo RepositIFF" />
                <div className="max-w-2xl mx-auto">
                    <Input
                        style={{ fontSize: '16px', padding: '8px' }}
                        placeholder="Buscar por Título ou Palavra-chave..."
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                    />
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filtros na lateral */}
                <aside className="w-full md:w-1/4">
                    <div className="p-6 bg-gray-50 rounded-lg shadow sticky top-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Refinar a Busca</h2>
                            <Button onClick={handleClearAllFilters} type="link" size="small" className="text-iffEscuro">Limpar Tudo</Button>
                        </div>
                        <div className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Palavra-chave (filtro específico)</label>
                                <Input 
                                    value={keywordsInput} 
                                    onChange={(e) => setKeywordsInput(e.target.value)} 
                                    placeholder="Ex: Inteligência Artificial" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {authorFacets.length > 0 ? authorFacets.map(facet => (
                                        <div key={facet.name} className="flex items-center justify-between">
                                            <Checkbox
                                                value={facet.name}
                                                checked={selectedAuthors.includes(facet.name)}
                                                onChange={handleAuthorSelection}
                                            >
                                                <span className="text-sm">{facet.name}</span>
                                            </Checkbox>
                                            <Tag>{facet.count}</Tag>
                                        </div>
                                    )) : <p className="text-xs text-gray-500">Nenhum autor encontrado.</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Orientador</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {advisorFacets.length > 0 ? advisorFacets.map(facet => (
                                        <div key={facet.name} className="flex items-center justify-between">
                                            <Checkbox
                                                value={facet.name}
                                                checked={selectedAdvisors.includes(facet.name)}
                                                onChange={handleAdvisorSelection}
                                            >
                                                <span className="text-sm">{facet.name}</span>
                                            </Checkbox>
                                            <Tag>{facet.count}</Tag>
                                        </div>
                                    )) : <p className="text-xs text-gray-500">Nenhum orientador encontrado.</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ano de Publicação (De)</label>
                                <Input type="number" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} placeholder="Ex: 2020" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ano de Publicação (Até)</label>
                                <Input type="number" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} placeholder="Ex: 2024" />
                            </div>
                            <Button onClick={handleApplySidebarFilters} type="primary" block style={{ background: '#00A859' }}>
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Resultados */}
                <main className="w-full md:w-3/4">
                    <p className="text-gray-600 mb-4">
                        {isLoading ? 'Carregando...' : `Mostrando ${filteredResults.length} resultados`}
                    </p>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center mb-4 p-3 bg-gray-100 rounded-md">
                            <span className="text-sm font-semibold">Filtros Ativos:</span>
                            {activeFilters.map(filter => (
                                <Tag
                                    key={filter.key}
                                    closable
                                    onClose={filter.clear}
                                >
                                    {filter.label}: {filter.value}
                                </Tag>
                            ))}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-10"><Spin size="large" /></div>
                    ) : (
                        <div className="space-y-6">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((tcc) => <TccResultCard key={tcc.id} tcc={tcc} />)
                            ) : (
                                <Empty description="Nenhum resultado encontrado para os filtros selecionados." />
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchPage;