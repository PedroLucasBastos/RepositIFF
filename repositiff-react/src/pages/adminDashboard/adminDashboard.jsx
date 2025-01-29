import React, { useState } from "react";
import { Button, Modal } from "antd";
import RegisterLibrarian from "@/components/forms/librarianRegistrationForm/resgisterLibrarian/ResgisterLibrarian";
import { useNavigate } from "react-router-dom"; // Importa o hook de navegação

const AdminDashboard = () => {
  const [isLibrarianModalOpen, setIsLibrarianModalOpen] = useState(false);
  const navigate = useNavigate(); // Usando o hook de navegação

  const showLibrarianModal = () => {
    setIsLibrarianModalOpen(true);
  };

  const handleLibrarianOk = () => {
    setIsLibrarianModalOpen(false);
  };

  const handleLibrarianCancel = () => {
    setIsLibrarianModalOpen(false);
    console.log("Cadastro de Bibliotecário Cancelado");
  };

  const goToCourseManagement = () => {
    navigate("/admin/course-management");
  };

  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      {/* Botão para cadastrar bibliotecário */}
      <Button
        type="primary"
        size="large"
        onClick={showLibrarianModal}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Cadastrar Bibliotecário
      </Button>

      {/* Modal para bibliotecário */}
      <Modal
        title="Cadastrar Bibliotecário"
        open={isLibrarianModalOpen}
        onOk={handleLibrarianOk}
        onCancel={handleLibrarianCancel}
        footer={null}
      >
        <div>
          <RegisterLibrarian handleCancel={handleLibrarianCancel} />
        </div>
      </Modal>

      {/* Botão para gerenciar curso */}
      <Button
        type="primary"
        size="large"
        onClick={goToCourseManagement} // Agora redireciona para a tela de gerenciamento
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        Gerenciar Curso
      </Button>
    </div>
  );
};

export default AdminDashboard;
