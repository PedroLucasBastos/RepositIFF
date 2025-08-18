import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu, Avatar, Modal, message } from "antd";
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
  const [courses, setCourses] = useState([]);
  const [academicWorks, setAcademicWorks] = useState([]);

  const [loadingLib, setLoadingLib] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ---- Fetch Bibliotecários ----
  const fetchLibrarians = async () => {
    setLoadingLib(true);
    const token = Cookies.get("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:3333/librarian/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.status}`);
      }

      const jsonData = await res.json();

      const formatted = jsonData.map((item) => ({
        key: item._id,
        id: item._id,
        fullName: item._props.name,
        name: item._props.name,
        registrationNumber: item._props.registrationNumber,
        admissionDate: item._props.admissionDate || "N/A",
        position: "Bibliotecário",
      }));

      setLibrarians(formatted);
    } catch (err) {
      console.error("Erro ao carregar bibliotecários:", err);
      message.error("Não foi possível carregar os bibliotecários.");
    } finally {
      setLoadingLib(false);
    }
  };

  // ---- Fetch Cursos ----
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:3333/course/list");
      if (!res.ok) throw new Error(`Erro cursos: ${res.status}`);
      const data = await res.json();
      // Garantir que seja array
      console.log("Dados recebidos de course/list:", data);
      setCourses(Array.isArray(data.Courses) ? data.Courses : []);
    } catch (err) {
      console.error("Erro ao carregar cursos:", err);
      message.error("Não foi possível carregar os cursos.");
    }
  };

  // ---- Fetch Trabalhos Acadêmicos ----
  const fetchAcademicWorks = async () => {
    try {
      const res = await fetch("http://localhost:3333/academicWork/");
      if (!res.ok) throw new Error(`Erro trabalhos: ${res.status}`);
      const data = await res.json();
      // Garantir que seja array
      console.log("Dados recebidos de academicWork:", data);
      setAcademicWorks(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error("Erro ao carregar trabalhos acadêmicos:", err);
      message.error("Não foi possível carregar os trabalhos acadêmicos.");
    }
  };

  useEffect(() => {
    fetchLibrarians();
    fetchCourses();
    fetchAcademicWorks();
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      Cookies.remove("authToken");
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

  const handleRegisterSuccess = () => {
    setIsLibrarianModalOpen(false);
    fetchLibrarians();
  };

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard do Administrador</h1>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Avatar size="large" icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </div>

      {/* Painel */}
      <div className="min-h-screen">
        <h2 className="text-3xl font-semibold text-center mt-8">
          Painel de Controle
        </h2>

        <div className="flex justify-center gap-8 mt-8 px-12">
          <button
            className="flex-1 h-24 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md flex flex-col items-center justify-center"
            onMouseEnter={() => setHoveredButton("addLibrarian")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsLibrarianModalOpen(true)}
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "addLibrarian"}
              />
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
        <CardsAdmin
          librarians={librarians}
          courses={courses}
          academicWorks={academicWorks}
        />

        {/* tabela */}
        <div className="mx-12 mt-8">
          <LibrarianListTable
            data={librarians}
            loading={loadingLib}
            onRefresh={fetchLibrarians}
          />
        </div>
      </div>

      {/* modal */}
      <Modal
        title="Cadastrar Bibliotecário"
        open={isLibrarianModalOpen}
        onCancel={() => setIsLibrarianModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <RegisterLibrarian
          onCancel={() => setIsLibrarianModalOpen(false)}
          onSuccess={handleRegisterSuccess}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
