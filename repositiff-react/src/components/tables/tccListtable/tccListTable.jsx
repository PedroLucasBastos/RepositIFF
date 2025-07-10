import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

// A tabela agora recebe 'data', 'loading', 'onRefresh' E 'onEdit' como props
const TCCListTable = ({ data, loading, onRefresh, onEdit }) => { // Adicione onEdit aqui
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState(data);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setDataSource(data);
    if (searchText) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchText]);

  const handleSearch = () => {
    const filtered = dataSource.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

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
        </div>
      ),
      onOk() {},
    });
  };

  // Função para editar o TCC
  const handleEdit = (record) => {
    // Ao invés de apenas logar ou mostrar uma mensagem, chame a prop onEdit
    if (onEdit) {
      onEdit(record); // Chama a função onEdit do componente pai, passando o registro completo
    }
  };

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
              onClick={() => handleEdit(record)} // Isso chamará a prop onEdit do pai
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