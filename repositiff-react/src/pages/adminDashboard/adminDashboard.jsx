import React, { useState } from "react";
import { Button, Modal } from "antd";
import RegisterLibrarian from "@/components/formTCC/librarianRegistrationForm/resgisterLibrarian/ResgisterLibrarian";

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    console.log("Cancelado");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Botão centralizado */}
      <Button
        type="primary"
        size="large"
        onClick={showModal}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Cadastrar Bibliotecário
      </Button>

      {/* Modal */}
      <Modal
        title="Cadastrar Bibliotecário"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Se preferir, pode adicionar botões personalizados.
      >
        <div>
          <RegisterLibrarian handleCancel={handleCancel} />
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
