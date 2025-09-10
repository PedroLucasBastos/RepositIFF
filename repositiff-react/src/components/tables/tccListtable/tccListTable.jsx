import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UnlockFilled, // Novo ícone
  LockFilled, // Novo ícone
} from "@ant-design/icons";
import Cookies from "js-cookie";

const TCCListTable = ({ data, loading, onRefresh, onEdit }) => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState(data);
  const [filteredData, setFilteredData] = useState(data);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const [isVisibilityModalVisible, setIsVisibilityModalVisible] = useState(false);
  const [recordToChangeVisibility, setRecordToChangeVisibility] = useState(null);

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
            {/* O campo de visibilidade é agora um booleano (academicWorkStatus) */}
            <strong>Visibilidade:</strong> {record.academicWorkStatus ? "Público" : "Privado"}
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

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      message.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setIsConfirmingDelete(true);
    try {
      const response = await fetch(
        `http://localhost:3333/academicWork/${recordToDelete.id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${authToken}`
          },
        }
      );
      
      const result = await response.json(); 

      if (!response.ok ) {
        const errorMessage = result.Message || `Erro ao excluir trabalho.`;
        throw new Error(errorMessage);
      }
      
      setIsDeleteModalVisible(false);

      Modal.success({
        title: 'Excluído com Sucesso!',
        content: result.Message || 'O trabalho acadêmico foi removido.',
        okText: 'Concluir',
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

  const handleChangeVisibility = async () => {
    if (!recordToChangeVisibility) return;

    const authToken = Cookies.get("authToken");
    if (!authToken) {
      message.error("Sessão expirada. Faça login novamente.");
      return;
    }


    try {
      const response = await fetch(
        `http://localhost:3333/academicWork/changeVisibility`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({ id: recordToChangeVisibility.id }),
        }
      );
     

      // Verifica apenas o status da resposta, que é o que o back-end retorna
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.Message || "Erro ao alterar visibilidade.";
        throw new Error(errorMessage);
      }

      // Se a resposta for OK, exibe a mensagem de sucesso
      const result = await response.json();
      message.success(result.Message || "Visibilidade alterada com sucesso!");
      setIsVisibilityModalVisible(false);
      
      // Recarrega os dados para que o cadeado mude de cor
      if (onRefresh) {
        onRefresh();
      }

    } catch (error) {
      console.error("Falha ao alterar a visibilidade:", error);
      message.error("Falha ao alterar a visibilidade: " + error.message);
    } finally {
      setRecordToChangeVisibility(null);
    }
    
  };
  
  const handleOpenVisibilityModal = (record) => {
    setRecordToChangeVisibility(record);
    setIsVisibilityModalVisible(true);
  };

  // Ajuste nas colunas para refletir a nova lógica
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
    // Coluna de Visibilidade: agora usa a propriedade booleana `academicWorkStatus`
    {
      title: "Visibilidade",
      key: "visibility",
      render: (_, record) => (
        <Tooltip
          title={
            record.academicWorkStatus // Verifica a propriedade booleana
              ? "Trabalho Público"
              : "Trabalho Privado"
          }
        >
          <Space>
            {record.academicWorkStatus ? ( // Renderiza o ícone com base no booleano
              <UnlockFilled
                style={{ color: "green", fontSize: "1.2em", cursor: "pointer" }}
                onClick={() => handleOpenVisibilityModal(record)}
              />
            ) : (
              <LockFilled
                style={{ color: "red", fontSize: "1.2em", cursor: "pointer" }}
                onClick={() => handleOpenVisibilityModal(record)}
              />
            )}
          </Space>
        </Tooltip>
      ),
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
        rowKey={(record) => record.id}
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

      {recordToChangeVisibility && (
        <Modal
          title={`Alterar Visibilidade para ${recordToChangeVisibility.academicWorkStatus ? "Privado" : "Público"}`}
          visible={isVisibilityModalVisible}
          onOk={handleChangeVisibility}
          onCancel={() => setIsVisibilityModalVisible(false)}
          okText="Confirmar"
          cancelText="Cancelar"
        >
          <p>
            Você tem certeza que deseja alterar a visibilidade do trabalho **"{recordToChangeVisibility.title}"**?
          </p>
          <p>
            Essa ação irá tornar o trabalho{" "}
            <strong>
              {recordToChangeVisibility.academicWorkStatus ? "privado" : "público"}
            </strong>{" "}
            para os usuários.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default TCCListTable;