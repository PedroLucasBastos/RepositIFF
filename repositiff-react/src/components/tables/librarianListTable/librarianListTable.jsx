import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";


const LibrarianListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);
  const [librarianMatricula, setLibrarianMatricula] = useState("");
  const [matriculaToConfirm, setMatriculaToConfirm] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchLibrarians = async () => {
    try {
      const response = await axios.get("http://localhost:3333/librarian/list");
      const librarians = response.data.librarians.map((lib) => ({
        key: lib._id,
        name: lib._props.name,
        surname: lib._props.surname,
        registrationNumber: lib._props.registrationNumber,
      }));
      setDataSource(librarians);
    } catch (error) {
      message.error("Erro ao buscar os bibliotecários: " + error.message);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

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

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3333/librarian/delete", {
        data: { librarianIdentification: selectedLibrarianId },
      });

      message.success("Bibliotecário excluído com sucesso!");
      setConfirmDeleteVisible(false);
      fetchLibrarians();
    } catch (error) {
      message.error("Erro ao excluir o bibliotecário: " + error.message);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Sobrenome",
      dataIndex: "surname",
      key: "surname",
      sorter: (a, b) => a.surname.localeCompare(b.surname),
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
          placeholder="Pesquisar Bibliotecário"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
        <Button type="primary" icon={<SearchOutlined />}>
          Pesquisar
        </Button>
      </div>

      <Table
        dataSource={filteredData.length > 0 ? filteredData : dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      
      <Modal
        title="Deseja Deletar?"
        open={isDeleteModalVisible}
        onOk={showConfirmDeleteModal}
        onCancel={handleCancelDelete}
        okText="Sim"
        cancelText="Cancelar"
        okButtonProps={{ className: "bg-red-500 border-none text-white" }}
        cancelButtonProps={{ className: "bg-gray-200 border-none" }}
      >
        <p>Você tem certeza que deseja excluir este bibliotecário?</p>
      </Modal>

      <Modal
        title="Confirmação de Exclusão"
        open={isConfirmDeleteVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Confirmar Exclusão"
        cancelText="Cancelar"
        okButtonProps={{
          className: "bg-red-500 border-none text-white",
          disabled: matriculaToConfirm !== librarianMatricula,
        }}
        cancelButtonProps={{ className: "bg-gray-200 border-none" }}
      >
        <p>
          Após confirmar, esta ação não poderá ser desfeita. Para confirmar,
          digite o número de matrícula do bibliotecário:
        </p>
        <Input
          value={matriculaToConfirm}
          onChange={handleMatriculaChange}
          placeholder="Digite o número de matrícula"
        />
        <p>Matrícula: {librarianMatricula}</p>
      </Modal>
    </div>
  );
};

export default LibrarianListTable;
