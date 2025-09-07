// src/components/tccResultCard/TccResultCard.jsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate

const TccResultCard = ({ tcc }) => {
  const navigate = useNavigate(); // 2. Chame o hook para pegar a função de navegação

  const authors = tcc.authors && tcc.authors.length > 0 
    ? tcc.authors.join(', ') 
    : 'Autor não informado';

  const publicationYear = tcc.year || 'Ano não informado';

  const advisors = tcc.advisors && tcc.advisors.length > 0 
    ? tcc.advisors.map(adv => `${adv.name} ${adv.surname}`).join(', ') 
    : 'Orientador não informado';

  const isPublic = tcc.visibility === true;
  
  const keywords = tcc.keyWords && tcc.keyWords.length > 0
    ? tcc.keyWords.join(', ')
    : '';

  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-green-800">{tcc.title}</h3>
        
      </div>
      
      <p className="text-sm text-gray-600 mb-1">
        por <span className="font-semibold">{authors}</span>
      </p>

      <p className="text-sm text-gray-600 mb-1">
        Orientado por: <span className="font-semibold">{advisors}</span>
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Publicado em {publicationYear}
      </p>
      {keywords && (
          <p className="text-xs text-gray-500 mb-4 italic">
            <strong>Palavras-chave:</strong> {keywords}
          </p>
        )}
      {tcc.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {tcc.description}
          </p>
        )}

      <Button 
        className="bg-botaoIFF hover:bg-green-800"
        // 3. Altere o onClick para navegar para a rota de detalhes
        onClick={() => navigate(`/tcc/${tcc.id}`)}
      >
        Acessar documento
      </Button>
    </div>
  );
};

export default TccResultCard;