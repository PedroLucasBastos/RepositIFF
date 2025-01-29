import React, { useState } from "react";
import { Button, Modal } from "antd";
import RegisterCourse from "@/components/forms/courseRegistrationForm/courseregister";
import { useNavigate } from "react-router-dom";
import CoursesTable from "@/components/tables/courseTable/coursesTable";

const CourseManagement = () => {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const navigate = useNavigate();

  const showCourseModal = () => setIsCourseModalOpen(true);
  const handleCourseCancel = () => setIsCourseModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Título da página */}
      <h1 className="text-3xl font-semibold text-center mb-8">
        Gerenciamento de Cursos
      </h1>

      <div className="flex justify-center mb-6">
        {/* Botão para cadastrar curso */}
        <Button
          type="primary"
          size="large"
          onClick={showCourseModal}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Cadastrar Curso
        </Button>
      </div>

      {/* Modal para cadastro de curso */}
      <Modal
        title="Cadastrar Curso"
        open={isCourseModalOpen}
        onCancel={handleCourseCancel}
        footer={null}
      >
        <RegisterCourse handleCancel={handleCourseCancel} />
      </Modal>

      {/* Tabela de cursos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <CoursesTable />
      </div>
    </div>
  );
};

export default CourseManagement;
