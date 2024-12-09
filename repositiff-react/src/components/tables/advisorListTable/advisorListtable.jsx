import React, { useState } from "react";
import { Table, Input, Button, Space, Tooltip, message } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const AdvisorListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "João",
      surname: "Silva",
      registrationNumber: "12345",
    },
    {
      key: "2",
      name: "Maria",
      surname: "Pereira",
      registrationNumber: "67890",
    },
    {
      key: "3",
      name: "Carlos",
      surname: "Souza",
      registrationNumber: "11223",
    },
    {
      key: "4",
      name: "Ana",
      surname: "Lima",
      registrationNumber: "44556",
    },
  ]);
  const [filteredData, setFilteredData] = useState([]);

  // Função para filtrar os dados com base no texto de pesquisa
  const handleSearch = () => {
    const filtered = dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.surname.toLowerCase().includes(searchText.toLowerCase()) ||
        item.registrationNumber.includes(searchText)
    );
    setFilteredData(filtered);
  };

  // Funções para as ações dos botões
  const handleView = (record) => {
    message.info(`Visualizando orientador: ${record.name} ${record.surname}`);
  };

  const handleEdit = (record) => {
    message.success(`Editando orientador: ${record.name} ${record.surname}`);
  };

  const handleDelete = (record) => {
    message.error(`Excluindo orientador: ${record.name} ${record.surname}`);
    setDataSource(dataSource.filter((item) => item.key !== record.key));
  };

  // Configuração das colunas da tabela
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
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <EditOutlined
              style={{ color: "#52c41a", cursor: "pointer" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Apagar">
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Barra de pesquisa */}
      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Pesquisar Orientador"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Pesquisar
        </Button>
      </div>

      {/* Tabela */}
      <Table
        dataSource={filteredData.length > 0 ? filteredData : dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
    </div>
  );
};

export default AdvisorListTable;
