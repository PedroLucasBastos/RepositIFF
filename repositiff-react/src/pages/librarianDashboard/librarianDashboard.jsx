import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Avatar, message, Space } from "antd"; // Importe 'message' se ainda não importou
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import FormTCC from "../../components/forms/formTCC"; // Verifique o caminho
import plusAnimation from "../../assets/lotties/plusAnimation.json"; // Verifique o caminho

import CardsLibrarian from "@/components/dashboardCharts/cardsLibrarian"; // Verifique o caminho
import TCCListTable from "@/components/tables/tccListtable/tccListTable"; // Verifique o caminho

const LibrarianDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false); // Estado para controlar a visibilidade da modal de TCC
  const [isOrientadorModalOpen, setIsOrientadorModalOpen] = useState(false); // Estado para controlar a visibilidade da modal de Orientador
  const [tccs, setTccs] = useState([]); // Estado para armazenar a lista de TCCs
  const [loadingTccs, setLoadingTccs] = useState(true); // Estado de carregamento dos TCCs

  const navigate = useNavigate();

  // Função para buscar e formatar os TCCs
  const fetchTCCs = async () => {
    setLoadingTccs(true);
    try {
      const response = await fetch("http://localhost:3333/academicWork/");
      if (!response.ok) {
        throw new Error("Erro ao buscar trabalhos acadêmicos");
      }
      const data = await response.json();
      // Mapear os dados de 'result' para o formato da tabela
      const formattedData = (data.result || []).map((item) => ({
        key: item.id,
        id: item.id,
        title: item.title,
        authors: item.authors ? item.authors.join(", ") : "N/A",
        advisor: item.advisors && item.advisors.length > 0
          ? `${item.advisors[0].name} ${item.advisors[0].surname}`
          : "N/A",
        year: item.year,
        visibility: "Público", // Valor fixo, ajuste se tiver um campo real no backend
      }));
      setTccs(formattedData); // Atualiza o estado com os TCCs formatados
    } catch (error) {
      console.error("Falha ao carregar trabalhos acadêmicos:", error);
      message.error("Falha ao carregar trabalhos acadêmicos.");
    } finally {
      setLoadingTccs(false);
    }
  };

  // Carrega os TCCs na montagem do componente (useEffect com array de dependências vazio)
  useEffect(() => {
    fetchTCCs();
  }, []);

  // Função para fechar a modal de TCC e, em seguida, recarregar a lista de TCCs
  const handleCloseTCCModal = () => {
    setIsTCCModalOpen(false); // Fecha a modal
    fetchTCCs(); // Recarrega a lista de TCCs para mostrar o novo item (ou remover o excluído)
  };

  // Funções de logout e perfil (mantidas do seu código original)
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      Cookies.remove("token");
      navigate("/login");
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Perfil
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {/* Cabeçalho com avatar e dropdown */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard do Bibliotecário</h1>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className="min-h-screen">
        <h1 className="text-3xl font-semibold text-center mt-8">
          Painel de Controle
        </h1>
        {/* Container para botões */}
        <div className="flex justify-center gap-12 mt-8 px-12">
          {/* Botão de Registrar TCC */}
          <button
            className="flex-1 h-25 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("plus")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsTCCModalOpen(true)} // Abre modal para TCC
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "plus"}
              />
            </div>
            <p>Registrar TCC</p>
          </button>

          {/* Botão de Adicionar Orientador */}
          <button
            className="flex-1 h-25 bg-sky-500 hover:bg-blue-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => navigate("/bibliotecario/gerenciarOrientador")} // Redireciona para a página de gerenciar orientadores
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "add"}
              />
            </div>
            <p>Gerenciar Orientadores</p>
          </button>
        </div>

        {/* Cards e Tabela */}
        <div>
          <CardsLibrarian />
        </div>
        <div>
          {/* A TCCListTable agora recebe os dados e o estado de loading do componente pai */}
          {/* E também recebe a função onRefresh para ser chamada após exclusão */}
          <TCCListTable data={tccs} loading={loadingTccs} onRefresh={fetchTCCs} />
        </div>
      </div>

      {/* Modal Registrar TCC */}
      {isTCCModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Registrar novo TCC</h2>
              <button
                onClick={handleCloseTCCModal} // Chama a função que fecha a modal e recarrega a lista
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* O FormTCC recebe a função handleCloseTCCModal como prop onClose */}
            <FormTCC onClose={handleCloseTCCModal} />
          </div>
        </div>
      )}

      {/* Modal Adicionar Orientador (mantida do seu código original) */}
      {isOrientadorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[50vw] max-h-[70vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Adicionar Orientador</h2>
              <button
                onClick={() => setIsOrientadorModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p>Formulário para adicionar orientador vai aqui.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;