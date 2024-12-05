import React, { useState } from "react";
import { Table, Input, Button, Space, Tooltip, message } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const TCCListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      title: "Análise de Algoritmos de Busca",
      authors: "Pedro Lucas, João Silva",
      advisor: "Dr. Marcos Silva",
      year: 2023,
      visibility: "Público",
    },
    {
      key: "2",
      title: "Estudo de Redes Neurais",
      authors: "Maria Oliveira",
      advisor: "Prof. Ana Souza",
      year: 2024,
      visibility: "Privado",
    },
    {
      key: "3",
      title: "Tecnologias Sustentáveis",
      authors: "Carla Mendes, Rafael Lima",
      advisor: "Dr. José Carlos",
      year: 2022,
      visibility: "Público",
    },
    {
      key: "4",
      title: "Tecnologias Sustentáveis",
      authors: "Carla Mendes, Rafael Lima",
      advisor: "Dr. José Carlos",
      year: "2022",
      visibility: "Público",
    },
    {
      key: "5",
      title: "Tecnologias Sustentáveis",
      authors: "Carla Mendes, Rafael Lima",
      advisor: "Dr. José Carlos",
      year: "2022",
      visibility: "Público",
    },
    {
      key: "6",
      title: "Tecnologias Sustentáveis",
      authors: "Carla Mendes, Rafael Lima",
      advisor: "Dr. José Carlos",
      year: "2022",
      visibility: "Público",
    },
  ]);
  const [filteredData, setFilteredData] = useState([]);

  // Função para alternar a visibilidade (público/privado)
  const toggleVisibility = (key) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        const newVisibility =
          item.visibility === "Público" ? "Privado" : "Público";
        message.success(`Trabalho agora está ${newVisibility.toLowerCase()}!`);
        return { ...item, visibility: newVisibility };
      }
      return item;
    });
    setDataSource(updatedData);
    setFilteredData(
      filteredData.length > 0
        ? updatedData.filter((item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
          )
        : updatedData
    );
  };

  // Função para filtrar os dados com base no texto de pesquisa
  const handleSearch = () => {
    const filtered = dataSource.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Definição das colunas da tabela
  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Autores",
      dataIndex: "authors",
      key: "authors",
      sorter: (a, b) => a.authors.localeCompare(b.authors),
    },
    {
      title: "Orientador",
      dataIndex: "advisor",
      key: "advisor",
      sorter: (a, b) => a.advisor.localeCompare(b.advisor),
    },
    {
      title: "Ano de Publicação",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Visibilidade",
      dataIndex: "visibility",
      key: "visibility",
      sorter: (a, b) => a.visibility.localeCompare(b.visibility),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Visualizar">
            <EyeOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
          </Tooltip>
          <Tooltip title="Editar">
            <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
          </Tooltip>
          <Tooltip
            title={
              record.visibility === "Público"
                ? "Privar Trabalho"
                : "Publicar Trabalho"
            }
          >
            {record.visibility === "Público" ? (
              <LockOutlined
                style={{ color: "#faad14", cursor: "pointer" }}
                onClick={() => toggleVisibility(record.key)}
              />
            ) : (
              <UnlockOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => toggleVisibility(record.key)}
              />
            )}
          </Tooltip>
          <Tooltip title="Apagar">
            <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer" }} />
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
          placeholder="Pesquisar TCC"
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

export default TCCListTable;
