// src/pages/tccDetails/TccDetailsPage.jsx

import React, { useState, useEffect } from 'react';
// ADICIONADO: Importe o useNavigate
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
// ADICIONADO: Importe o ícone da seta
import { ArrowLeftOutlined } from '@ant-design/icons';

const TccDetailsPage = () => {
  const [tcc, setTcc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate(); // ADICIONADO: Chame o hook para a navegação

  useEffect(() => {
    if (!id) return;

    const fetchTccDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3333/academicWork/${id}`);
        if (!response.ok) {
          throw new Error('Trabalho não encontrado');
        }
        const data = await response.json();
        setTcc(data.result);
      } catch (error) {
        toast.error('Não foi possível carregar os detalhes do trabalho.');
        console.error("Erro ao buscar detalhes do TCC:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTccDetails();
  }, [id]);
  
  const handleDownload = async () => {
    try {
      toast.info("Preparando o link para download...");
      const response = await fetch(`http://localhost:3333/academicWork/${id}/download`);
      
      if (!response.ok) {
        throw new Error("Não foi possível obter o link de download.");
      }
      
      const data = await response.json();
      const signedUrl = data.result.value;

      if (signedUrl) {
        window.open(signedUrl, '_blank');
      } else {
        throw new Error("Link de download inválido recebido do servidor.");
      }

    } catch (error) {
      toast.error(error.message);
      console.error("Erro no processo de download:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Carregando detalhes do trabalho...</div>;
  }

  if (!tcc) {
    return <div className="text-center p-10">Trabalho não encontrado.</div>;
  }

  const authors = tcc.authors?.join(', ') || 'Não informado';
  const advisors = tcc.advisors?.map(adv => `${adv.name} ${adv.surname}`).join(', ') || 'Não informado';
  const keywords = tcc.keyWords?.join(', ') || 'Não informado';

  const InfoRow = ({ label, value, isEvenRow }) => (
    <div className={`flex flex-col md:flex-row py-3 px-4 ${isEvenRow ? 'bg-gray-50' : 'bg-white'}`}>
      <strong className="w-full md:w-1/4 min-w-[150px] text-gray-800">{label}:</strong> 
      <span className="flex-1 text-gray-700">{value}</span>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Toaster richColors />

      {/* ADICIONADO: Botão de Voltar */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} // navigate(-1) volta uma página
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-semibold"
        >
          <ArrowLeftOutlined style={{ marginRight: '8px' }} />
          Voltar para a busca
        </button>
      </div>

      <h1 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-center text-gray-800 mb-8 pt-5">
        {tcc.title}
      </h1>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <InfoRow label="Autor(s) principal:" value={authors} isEvenRow={false} />
        <InfoRow label="Orientador(a):" value={advisors} isEvenRow={true} />
        <InfoRow label="Data de Publicação:" value={tcc.year} isEvenRow={false} />
        <InfoRow label="Tipo de documento:" value={tcc.typeWork || 'Não informado'} isEvenRow={true} />
        <InfoRow label="Curso:" value={tcc.course?.name || 'Não informado'} isEvenRow={false} />
        <InfoRow label="Palavras-chave:" value={keywords} isEvenRow={true} />
        <InfoRow label="Quantidade de Páginas:" value={tcc.qtdPag || 'Não informado'} isEvenRow={false} />
        <InfoRow label="Número de Cutter:" value={tcc.cutterNumber || 'Não informado'} isEvenRow={true} />
        <InfoRow label="CDU:" value={tcc.cduCode || 'Não informado'} isEvenRow={false} />
        <InfoRow label="CDD:" value={tcc.cddCode || 'Não informado'} isEvenRow={true} />
        <div className="py-4 px-4 bg-white">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Resumo:</h2>
          <p className="text-justify text-gray-700">{tcc.description || 'Resumo não disponível.'}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-botaoIFF hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Baixar Documento
        </button>
      </div>
    </div>
  );
};

export default TccDetailsPage;