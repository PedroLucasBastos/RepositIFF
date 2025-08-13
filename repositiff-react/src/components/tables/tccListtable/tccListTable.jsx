import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

// Não precisamos mais do 'confirm' aqui
// const { confirm } = Modal;

const TCCListTable = ({ data, loading, onRefresh, onEdit }) => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState(data);
  const [filteredData, setFilteredData] = useState(data);

  // --- NOVOS ESTADOS PARA O MODAL DE EXCLUSÃO ---
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null); // Guarda o TCC a ser excluído
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState(""); // Guarda o texto digitado
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // Estado de loading do botão

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

  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  // --- FUNÇÃO DE EXCLUSÃO MODIFICADA ---
  // Agora ela apenas abre o modal e guarda a informação do TCC
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

  // --- NOVA FUNÇÃO PARA CONFIRMAR A EXCLUSÃO (chamada pelo botão OK do modal) ---
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    setIsConfirmingDelete(true); // Ativa o loading
    try {
      const response = await fetch(
        `http://localhost:3333/academicWork/${recordToDelete.id}/delete`,
        {
          method: "DELETE",
        }
      );
      // Analisa a resposta como JSON, conforme sua imagem
      const result = await response.json(); 

      if (!response.ok || !result.isRight) {
        // Usa a mensagem do backend se disponível, senão uma mensagem padrão
        const errorMessage = result.Message || `Erro ao excluir trabalho.`;
        throw new Error(errorMessage);
      }
      
      message.success(result.Message || "TCC excluído com sucesso!");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Falha ao excluir trabalho acadêmico:", error);
      message.error("Falha ao excluir trabalho acadêmico: " + error.message);
    } finally {
      setIsConfirmingDelete(false); // Desativa o loading
      setIsDeleteModalVisible(false); // Fecha o modal
      setDeleteConfirmationInput(""); // Limpa o input
      setRecordToDelete(null); // Limpa o registro
    }
  };
  
  // Função para fechar o modal ao clicar em Cancelar ou no 'X'
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteConfirmationInput("");
    setRecordToDelete(null);
  };

  const columns = [
    // ... (suas colunas continuam as mesmas)
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

      {/* --- NOSSO NOVO MODAL DE CONFIRMAÇÃO --- */}
      {recordToDelete && (
        <Modal
          title="Confirmar Exclusão"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          // Propriedades do botão OK
          okText="Confirmar Exclusão"
          okType="danger"
          okButtonProps={{
            // AQUI ESTÁ A MÁGICA: o botão é desabilitado se o texto não for igual
            disabled: deleteConfirmationInput !== recordToDelete.title,
            loading: isConfirmingDelete,
          }}
          // Propriedades do botão Cancelar
          cancelText="Cancelar"
        >
          <p>
            Para confirmar a exclusão, por favor, digite o título completo do trabalho no campo abaixo:
          </p>
          <p>
            <strong>{recordToDelete.title}</strong>
          </p>
          <Input
            placeholder="Digite o título aqui"
            value={deleteConfirmationInput}
            onChange={(e) => setDeleteConfirmationInput(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TCCListTable;