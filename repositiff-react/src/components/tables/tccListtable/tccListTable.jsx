import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

// A tabela agora recebe 'data', 'loading' e 'onRefresh' como props
const TCCListTable = ({ data, loading, onRefresh }) => {
  const [searchText, setSearchText] = useState("");
  // dataSource e filteredData agora são baseados nos dados recebidos via props
  const [dataSource, setDataSource] = useState(data); 
  const [filteredData, setFilteredData] = useState(data);

  // useEffect para atualizar os dados internos quando as props 'data' mudarem
  // Isso garante que a tabela reaja aos novos dados fornecidos pelo componente pai
  useEffect(() => {
    setDataSource(data);
    // Ao receber novos dados, re-aplica o filtro de pesquisa atual
    if (searchText) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Se não houver pesquisa, mostra todos os dados novos
    }
  }, [data, searchText]); // Dependências nas props 'data' e 'searchText'

  // Função para filtrar os dados com base no texto de pesquisa
  const handleSearch = () => {
    const filtered = dataSource.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Função para visualizar detalhes do TCC (pode abrir um modal ou navegar)
  const handleView = (record) => {
    Modal.info({
      title: "Detalhes do Trabalho Acadêmico",
      content: (
        <div>
          <p>
            <strong>Título:</strong> {record.title}
          </p>
          <p>
            <strong>Autores:</strong> {record.authors}
          </p>
          <p>
            <strong>Orientador:</strong> {record.advisor}
          </p>
          <p>
            <strong>Ano:</strong> {record.year}
          </p>
          <p>
            <strong>Visibilidade:</strong> {record.visibility}
          </p>
          {/* Adicione mais campos do seu JSON aqui, por exemplo: */}
          {/* <p><strong>Cutter Number:</strong> {record.cutterNumber}</p> */}
          {/* <p><strong>Descrição:</strong> {record.description}</p> */}
        </div>
      ),
      onOk() {},
    });
  };

  // Função para editar o TCC
  const handleEdit = (record) => {
    message.info(`Redirecionando para edição do TCC: ${record.title}`);
    // Exemplo: Redirecionar para uma rota de edição
    // Se estiver usando react-router-dom, ficaria algo como:
    // navigate(`/edit-academic-work/${record.id}`);
    console.log("Editar TCC com ID:", record.id);
  };

  // Função para excluir o TCC
  const handleDelete = (record) => {
    confirm({
      title: `Tem certeza que deseja excluir o TCC "${record.title}"?`,
      icon: <DeleteOutlined />,
      content: "Esta ação não pode ser desfeita.",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      async onOk() {
        try {
          const response = await fetch(
            `http://localhost:3333/academicWork/${record.id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao excluir trabalho: ${errorText || response.statusText}`);
          }
          message.success("TCC excluído com sucesso!");
          // Chama a função onRefresh do componente pai após a exclusão bem-sucedida
          if (onRefresh) {
            onRefresh(); 
          }
        } catch (error) {
          console.error("Falha ao excluir trabalho acadêmico:", error);
          message.error("Falha ao excluir trabalho acadêmico: " + error.message);
        }
      },
      onCancel() {
        message.info("Exclusão cancelada.");
      },
    });
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
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        loading={loading}
      />
    </div>
  );
};

export default TCCListTable;