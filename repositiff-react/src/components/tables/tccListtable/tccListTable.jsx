import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


const TCCListTable = ({ data, loading, onRefresh, onEdit }) => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState(data);
  const [filteredData, setFilteredData] = useState(data);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

  // --- 👇 FUNÇÃO DE CONFIRMAÇÃO COM A NOVA LÓGICA DO MODAL DE SUCESSO 👇 ---
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    setIsConfirmingDelete(true);
    try {
      const response = await fetch(
        `http://localhost:3333/academicWork/${recordToDelete.id}/delete`,
        {
          method: "DELETE",
        }
      );
      
      const result = await response.json(); 

      if (!response.ok || !result.isRight) {
        const errorMessage = result.Message || `Erro ao excluir trabalho.`;
        throw new Error(errorMessage);
      }
      
      // PASSO 1: Fecha o modal de confirmação
      setIsDeleteModalVisible(false);

      // PASSO 2: Mostra o modal de sucesso estático do Ant Design
      Modal.success({
        title: 'Excluído com Sucesso!',
        content: result.Message || 'O trabalho acadêmico foi removido.',
        okText: 'Concluir',
        // PASSO 3: A atualização SÓ acontece quando o usuário clica em "Concluir"
        async onOk() {
          if (onRefresh) {
            await onRefresh();
          }
        },
      });

    } catch (error) {
      console.error("Falha ao excluir trabalho acadêmico:", error);
      message.error("Falha ao excluir trabalho acadêmico: " + error.message);
    } finally {
      // Limpa os estados, independentemente de sucesso ou falha
      setIsConfirmingDelete(false); 
      setDeleteConfirmationInput("");
      setRecordToDelete(null);
    }
  };
  
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
        rowKey={(record) => record.id} // Recomendo usar o 'id' como chave
        loading={loading}
      />

      {recordToDelete && (
        <Modal
          title="Confirmar Exclusão"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Confirmar Exclusão"
          okType="danger"
          okButtonProps={{
            disabled: deleteConfirmationInput !== recordToDelete.title,
            loading: isConfirmingDelete,
          }}
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