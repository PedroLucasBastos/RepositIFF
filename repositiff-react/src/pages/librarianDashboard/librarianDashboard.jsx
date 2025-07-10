import { useState, useEffect } from "react";
import { Dropdown, Menu, Avatar, message, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import FormTCC from "../../components/forms/formTCC"; // Verifique o caminho
import FormEditTCC from "../../components/forms/EditTCC/formEditTCC"; // Importe o novo componente FormEditTCC
import plusAnimation from "../../assets/lotties/plusAnimation.json"; // Verifique o caminho

import CardsLibrarian from "@/components/dashboardCharts/cardsLibrarian"; // Verifique o caminho
import TCCListTable from "@/components/tables/tccListtable/tccListTable"; // Verifique o caminho

const LibrarianDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false);
  const [isEditTCCModalOpen, setIsEditTCCModalOpen] = useState(false);
  const [selectedTCC, setSelectedTCC] = useState(null);
  const [isOrientadorModalOpen, setIsOrientadorModalOpen] = useState(false);
  const [tccs, setTccs] = useState([]);
  const [loadingTccs, setLoadingTccs] = useState(true);

  const navigate = useNavigate();

  const fetchTCCs = async () => {
    setLoadingTccs(true);
    try {
      const response = await fetch("http://localhost:3333/academicWork/");
      if (!response.ok) {
        throw new Error("Erro ao buscar trabalhos acadêmicos");
      }
      const data = await response.json();

      const fullDataWithFormattedFields = (data.result || []).map((item) => ({
        ...item,
        key: item.id, // Já usa .id
        authors: item.authors ? item.authors.join(", ") : "N/A",
        advisor: item.advisors && item.advisors.length > 0
          ? `${item.advisors[0].name} ${item.advisors[0].surname}`
          : "N/A",
        // >>>>> CORREÇÃO AQUI: USANDO .id PARA idCourse <<<<<
        idCourse: item.course?.id, // Assumindo que o objeto 'course' tem um 'id'
      }));

      setTccs(fullDataWithFormattedFields);
    } catch (error) {
      console.error("Falha ao carregar trabalhos acadêmicos:", error);
      message.error("Falha ao carregar trabalhos acadêmicos.");
    } finally {
      setLoadingTccs(false);
    }
  };

  useEffect(() => {
    fetchTCCs();
  }, []);

  const handleCloseTCCModal = () => {
    setIsTCCModalOpen(false);
    fetchTCCs();
  };

  const handleEditTCC = (tcc) => {
    setSelectedTCC(tcc);
    setIsEditTCCModalOpen(true);
  };

  const handleCloseEditTCCModal = () => {
    setIsEditTCCModalOpen(false);
    setSelectedTCC(null);
    fetchTCCs();
  };

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
        <div className="flex justify-center gap-12 mt-8 px-12">
          <button
            className="flex-1 h-25 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("plus")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsTCCModalOpen(true)}
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "plus"}
              />
            </div>
            <p>Registrar TCC</p>
          </button>

          <button
            className="flex-1 h-25 bg-sky-500 hover:bg-blue-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => navigate("/bibliotecario/gerenciarOrientador")}
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

        <div>
          <CardsLibrarian tccsData={tccs}/>
        </div>
        <div>
          <TCCListTable
            data={tccs}
            loading={loadingTccs}
            onRefresh={fetchTCCs}
            onEdit={handleEditTCC}
          />
        </div>
      </div>

      {isTCCModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Registrar novo TCC</h2>
              <button
                onClick={handleCloseTCCModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <FormTCC onClose={handleCloseTCCModal} />
          </div>
        </div>
      )}

      {isEditTCCModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Editar TCC</h2>
              <button
                onClick={handleCloseEditTCCModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {selectedTCC && (
              <FormEditTCC tccData={selectedTCC} onClose={handleCloseEditTCCModal} />
            )}
          </div>
        </div>
      )}

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