import React, { useState } from "react";
import { Button, Modal } from "antd";
import RegisterCourse from "@/components/forms/courseRegistrationForm/courseregister";
import { useNavigate } from "react-router-dom"; // Importa o hook de navegação

const CourseManagement = () => {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const navigate = useNavigate(); // Usando o hook de navegação

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

  const goToCourseRegister = () => {
    navigate("/admin/course-register"); // Navega para a página de cadastro de curso (se necessário)
  };

  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      {/* Botão para cadastrar curso */}
      <Button
        type="primary"
        size="large"
        onClick={showCourseModal}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        Cadastrar Curso
      </Button>

      {/* Modal para cadastro de curso */}
      <Modal
        title="Cadastrar Curso"
        open={isCourseModalOpen}
        onOk={handleCourseOk}
        onCancel={handleCourseCancel}
        footer={null}
      >
        <RegisterCourse handleCancel={handleCourseCancel} />
      </Modal>
    </div>
  );
};

export default CourseManagement;
