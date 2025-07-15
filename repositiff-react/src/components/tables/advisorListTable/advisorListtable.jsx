import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import AdvisorDetailsModal from "./optionsComponents/advisorDetailsModal";
import UpdateAdvisorModal from "./optionsComponents/updateAdvisorModal";

const AdvisorListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState(null);
  const [advisorMatricula, setAdvisorMatricula] = useState("");
  const [matriculaToConfirm, setMatriculaToConfirm] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchAdvisors = async () => {
    try {
      const response = await axios.get("http://localhost:3333/advisor/list");
      const advisors = response.data.Advisors.map((advisor) => ({
        key: advisor._id,
        name: advisor._props.name,
        surname: advisor._props.surname,
        registrationNumber: advisor._props.registrationNumber,
      }));
      setDataSource(advisors);
    } catch (error) {
      message.error("Erro ao buscar os orientadores: " + error.message);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredData([]);
    }
  }, [searchText]);

  const handleSearch = () => {
    const filtered = dataSource.filter((advisor) => {
      const fullName = `${advisor.name} ${advisor.surname}`.toLowerCase();
      const search = searchText.toLowerCase();
      return (
        fullName.includes(search) ||
        advisor.registrationNumber.toLowerCase().includes(search)
      );
    });

    setFilteredData(filtered);
  };

  const handleView = (record) => {
    setSelectedAdvisorId(record.key);
    setIsDetailsModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedAdvisorId(record.key);
    setIsUpdateModalVisible(true);
  };

  const handleCancelDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedAdvisorId(null);
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
    setSelectedAdvisorId(null);
  };

  const showDeleteModal = (advisorId, matricula) => {
    setSelectedAdvisorId(advisorId);
    setAdvisorMatricula(matricula);
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
    setAdvisorMatricula("");
    setMatriculaToConfirm("");
  };

  const handleMatriculaChange = (e) => {
    setMatriculaToConfirm(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const dataToSend = {
        advisorIdentification: selectedAdvisorId,
      };

      await axios.delete("http://localhost:3333/advisor/delete", {
        data: dataToSend,
      });

      message.success("Orientador excluído com sucesso!");
      setConfirmDeleteVisible(false);
      fetchAdvisors();
    } catch (error) {
      message.error("Erro ao excluir o orientador: " + error.message);
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
      sorter: (a, b) =>
        a.registrationNumber.localeCompare(b.registrationNumber),
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
              onClick={() =>
                showDeleteModal(record.key, record.registrationNumber)
              }
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
          placeholder="Pesquisar Orientador"
          value={searchText}
          onChange={(e) => {
            const text = e.target.value;
            setSearchText(text);

            const filtered = dataSource.filter((advisor) => {
              const fullName = `${advisor.name} ${advisor.surname}`.toLowerCase();
              return (
                fullName.includes(text.toLowerCase()) ||
                advisor.registrationNumber.toLowerCase().includes(text.toLowerCase())
              );
            });

            setFilteredData(filtered);
          }}
          className="w-full"
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Pesquisar
        </Button>
      </div>

      <Table
        dataSource={filteredData.length > 0 || searchText ? filteredData : dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      {isDetailsModalVisible && (
        <AdvisorDetailsModal
          advisorId={selectedAdvisorId}
          isVisible={isDetailsModalVisible}
          handleCancel={handleCancelDetails}
        />
      )}
      {isUpdateModalVisible && (
        <UpdateAdvisorModal
          advisorId={selectedAdvisorId}
          isVisible={isUpdateModalVisible}
          handleCancel={handleCancelUpdate}
          fetchAdvisors={fetchAdvisors}
        />
      )}

      <Modal
        title="Deseja Deletar?"
        open={isDeleteModalVisible}
        onOk={showConfirmDeleteModal}
        onCancel={handleCancelDelete}
        okText="Sim"
        cancelText="Cancelar"
        okButtonProps={{
          style: {
            backgroundColor: "#ff4d4f",
            borderColor: "#ff4d4f",
            color: "white",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#f0f0f0",
            borderColor: "#f0f0f0",
            color: "black",
          },
        }}
      >
        <p>Você tem certeza que deseja excluir este orientador?</p>
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
          disabled: matriculaToConfirm !== advisorMatricula,
        }}
        cancelButtonProps={{ className: "bg-gray-200 border-none" }}
      >
        <p>
          Após confirmar, esta ação não poderá ser desfeita. Para confirmar,
          digite o número de matrícula do orientador:
        </p>
        <Input
          value={matriculaToConfirm}
          onChange={handleMatriculaChange}
          placeholder="Digite o número de matrícula"
        />
        <p> Matrícula: {advisorMatricula}</p>
      </Modal>
    </div>
  );
};

export default AdvisorListTable;
