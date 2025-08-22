import React, { useState } from "react"; // Não precisa mais de useEffect e axios aqui
import { Button, Modal } from "antd";
import RegisterCourse from "@/components/forms/courseRegistrationForm/courseregister";
import CoursesTable from "@/components/tables/courseTable/coursesTable";

const CourseManagement = () => {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  // << NOVO: Este estado será a nossa "chave mágica" para reiniciar a tabela
  const [tableKey, setTableKey] = useState(0);

  const showCourseModal = () => setIsCourseModalOpen(true);
  const handleCourseCancel = () => setIsCourseModalOpen(false);

  // << NOVO: Esta função será chamada pelo formulário após o sucesso
  const handleRegistrationSuccess = () => {
    // Apenas incrementamos a chave. Isso forçará o CoursesTable a ser recriado.
    setTableKey(prevKey => prevKey + 1);
    
    // Também fechamos o modal
    handleCourseCancel();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Gerenciamento de Cursos
      </h1>

      <div className="flex justify-center mb-6">
        <Button
          type="primary"
          size="large"
          onClick={showCourseModal}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Cadastrar Curso
        </Button>
      </div>

      <Modal
        title="Cadastrar Curso"
        open={isCourseModalOpen}
        onCancel={handleCourseCancel}
        destroyOnClose
        footer={null}
      >
        {/* ATUALIZADO: Passamos a nova função de callback */}
        <RegisterCourse
          handleCancel={handleCourseCancel}
          onCourseRegistered={handleRegistrationSuccess} 
        />
      </Modal>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* ATUALIZADO: Adicionamos a prop "key" à tabela */}
        <CoursesTable key={tableKey} />
      </div>
    </div>
  );
};

export default CourseManagement;