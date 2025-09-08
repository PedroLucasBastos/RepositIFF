import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

const LibrarianListTable = ({ data, loading, onRefresh }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);
  const [librarianMatricula, setLibrarianMatricula] = useState("");
  const [matriculaToConfirm, setMatriculaToConfirm] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.registrationNumber.includes(searchText)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const handleView = (record) => {
    setSelectedLibrarianId(record.key);
    setIsDetailsModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedLibrarianId(record.key);
    setIsUpdateModalVisible(true);
  };

  const handleCancelDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedLibrarianId(null);
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
    setSelectedLibrarianId(null);
  };

  const showDeleteModal = (librarianId, matricula) => {
    setSelectedLibrarianId(librarianId);
    setLibrarianMatricula(matricula);
    setDeleteModalVisible(true);
    setMatriculaToConfirm("");
  };

  const showConfirmDeleteModal = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteVisible(false);
    setLibrarianMatricula("");
    setMatriculaToConfirm("");
  };

  const handleMatriculaChange = (e) => {
    setMatriculaToConfirm(e.target.value);
  };

  // --- FUNÇÃO DE EXCLUSÃO CORRIGIDA ---
  const handleDelete = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      message.error("Autenticação necessária. Por favor, faça login novamente.");
      return;
    }

    try {
      // CORREÇÃO: O ID do bibliotecário agora é adicionado diretamente à URL
      await axios.delete(`http://localhost:3333/user/delete/${selectedLibrarianId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // A propriedade 'data' foi removida pois não é mais necessária
      });

      message.success("Bibliotecário excluído com sucesso!");
      handleCancelDelete(); // Fecha todos os modais
      onRefresh(); // Atualiza a lista na página principal
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error(`Erro ao excluir o bibliotecário: ${errorMessage}`);
    }
  };

  const columns = [
    {
      title: "Nome Completo",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Número de Matrícula",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
      sorter: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Visualizar">
            <EyeOutlined
              className="text-blue-500 cursor-pointer"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <EditOutlined
              className="text-green-500 cursor-pointer"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Apagar">
            <DeleteOutlined
              className="text-red-500 cursor-pointer"
              onClick={() => showDeleteModal(record.key, record.registrationNumber)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Pesquisar por nome ou matrícula"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title="Deseja Deletar?"
        open={isDeleteModalVisible}
        onOk={showConfirmDeleteModal}
        onCancel={handleCancelDelete}
        okText="Sim, Excluir"
        cancelText="Cancelar"
        okButtonProps={{ className: "bg-red-500 border-none text-white hover:bg-red-600" }}
      >
        <p>Você tem certeza que deseja excluir o bibliotecário de matrícula <strong>{librarianMatricula}</strong>?</p>
      </Modal>

      <Modal
        title="Confirmação de Exclusão"
        open={isConfirmDeleteVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Confirmar Exclusão"
        cancelText="Cancelar"
        okButtonProps={{
          className: "bg-red-500 border-none text-white hover:bg-red-600",
          disabled: matriculaToConfirm !== librarianMatricula,
        }}
      >
        <p>
          Esta ação não pode ser desfeita. Para confirmar,
          digite o número de matrícula do bibliotecário: <strong>{librarianMatricula}</strong>
        </p>
        <Input
          value={matriculaToConfirm}
          onChange={handleMatriculaChange}
          placeholder="Digite o número de matrícula para confirmar"
        />
      </Modal>
    </div>
  );
};

export default LibrarianListTable;
