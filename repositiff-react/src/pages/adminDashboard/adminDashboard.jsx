// src/pages/adminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu, Avatar, Modal } from "antd";
import { UserOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import Lottie from "lottie-react";
import plusAnimation from "../../assets/lotties/plusAnimation.json";

import CardsAdmin from "../../components/dashboardCharts/cardsAdmin";
import LibrarianListTable from "../../components/tables/librarianListTable/librarianListTable";
import RegisterLibrarian from "@/components/forms/librarianRegistrationForm/resgisterLibrarian/ResgisterLibrarian";

const AdminDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isLibrarianModalOpen, setIsLibrarianModalOpen] = useState(false);
  const [librarians, setLibrarians] = useState([]);
  const [loadingLib, setLoadingLib] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // busca bibliotecários
  const fetchLibrarians = async () => {
    setLoadingLib(true);
    try {
      const res = await fetch("http://localhost:3333/librarian/");
      const json = await res.json();
      const data = json.result || [];
      const formatted = data.map(item => ({
        ...item,
        key: item.id,
        fullName: `${item.name} ${item.surname}`,
        admissionDate: item.admissionDate,
        position: item.position || "Bibliotecário",
      }));
      setLibrarians(formatted);
    } catch (err) {
      console.error("Erro ao carregar bibliotecários", err);
    } finally {
      setLoadingLib(false);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

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
      <Menu.Item key="profile" icon={<UserOutlined />}>Perfil</Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard do Administrador</h1>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a onClick={e => e.preventDefault()}>
            <Avatar size="large" icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </div>

      {/* Painel de Controle */}
      <div className="min-h-screen">
        <h2 className="text-3xl font-semibold text-center mt-8">Painel de Controle</h2>
        <div className="flex justify-center gap-8 mt-8 px-12">
          <button
            className="flex-1 h-24 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md flex flex-col items-center justify-center"
            onMouseEnter={() => setHoveredButton("addLibrarian")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsLibrarianModalOpen(true)}
          >
            <div className="w-10 h-10">
              <Lottie animationData={plusAnimation} loop={hoveredButton === "addLibrarian"} />
            </div>
            <p>Cadastrar Bibliotecário</p>
          </button>

          <button
            className="flex-1 h-24 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md flex flex-col items-center justify-center"
            onClick={() => navigate("/admin/course-management")}
          >
            <PlusOutlined style={{ fontSize: 24 }} />
            <p>Gerenciar Curso</p>
          </button>
        </div>

        {/* indicadores */}
        <CardsAdmin data={librarians} />

        {/* tabela */}
        <div className="mx-12 mt-8">
          <LibrarianListTable
            data={librarians}
            loading={loadingLib}
            onRefresh={fetchLibrarians}
          />
        </div>
      </div>

      {/* modal de cadastro */}
      <Modal
        title="Cadastrar Bibliotecário"
        open={isLibrarianModalOpen}
        onCancel={() => setIsLibrarianModalOpen(false)}
        footer={null}
      >
        <RegisterLibrarian onCancel={() => setIsLibrarianModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
