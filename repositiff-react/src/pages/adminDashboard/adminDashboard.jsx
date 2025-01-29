import React, { useState } from "react";
import { Button, Modal } from "antd";
import RegisterLibrarian from "@/components/forms/librarianRegistrationForm/resgisterLibrarian/ResgisterLibrarian";
import CourseRegister from "@/components/forms/courseRegistrationForm/courseregister";

const AdminDashboard = () => {
  const [isLibrarianModalOpen, setIsLibrarianModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

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

  const showCourseModal = () => {
    setIsCourseModalOpen(true);
  };

  const handleCourseOk = () => {
    setIsCourseModalOpen(false);
  };

  const handleCourseCancel = () => {
    setIsCourseModalOpen(false);
    console.log("Cadastro de Curso Cancelado");
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

      {/* Botão para cadastrar curso */}
      <Button
        type="primary"
        size="large"
        onClick={showCourseModal}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        Cadastrar Curso
      </Button>

      {/* Modal para curso */}
      <Modal
        title="Cadastrar Curso"
        open={isCourseModalOpen}
        onOk={handleCourseOk}
        onCancel={handleCourseCancel}
        footer={null}
      >
        <div>
          <CourseRegister handleCancel={handleCourseCancel} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
