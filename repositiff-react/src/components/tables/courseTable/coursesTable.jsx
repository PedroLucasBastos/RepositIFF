import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import EditCourse from "./editCourse";
import Cookies from "js-cookie";

const CourseTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [codeToConfirm, setCodeToConfirm] = useState("");

  useEffect(() => {
    if (!searchText) {
      setFilteredData(dataSource);
      return;
    }
    const filtered = dataSource.filter(
      (course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, dataSource]);
  // ==================================================================

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3333/course/list");
      const courses = response.data.Courses.map((course) => ({
        key: course._id,
        name: course._props.name,
        courseCode: course._props.courseCode,
        degreeType: course._props.degreeType,
      }));
      setDataSource(courses);
    } catch (error) {
      message.error("Erro ao buscar os cursos: " + error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ... (Restante do seu código: showEditModal, handleDelete, etc. continua igual)

  const showEditModal = (courseId) => {
    setSelectedCourseId(courseId);
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedCourseId(null);
  };

  const showDeleteModal = (courseId, code) => {
    setSelectedCourseId(courseId);
    setCourseCode(code);
    setDeleteModalVisible(true);
    setCodeToConfirm("");
  };

  const showConfirmDeleteModal = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteVisible(false);
    setCourseCode("");
    setCodeToConfirm("");
  };

  const handleDelete = async () => {
    const authToken = Cookies.get("authToken");
              if (!authToken) {
                message.error("Sessão expirada. Faça login novamente.");
                return;
              }
    try {
      await axios.delete("http://localhost:3333/course/delete", {
        data: { courseId: selectedCourseId },headers: {
                    Authorization: `Bearer ${authToken}`,
                },
      });

      message.success("Curso excluído com sucesso!");
      handleCancelDelete(); // Fecha os modais
      fetchCourses(); // Recarrega os cursos
    } catch (error) {
      message.error("Erro ao excluir o curso: " + error.message);
    }
  };

  const degreeTypeMapping = {
    BACHELOR: "Bacharelado",
    LICENTIATE: "Licenciatura",
  };

  const columns = [
    {
      title: "Nome do Curso",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Código do Curso",
      dataIndex: "courseCode",
      key: "courseCode",
      sorter: (a, b) => a.courseCode.localeCompare(b.courseCode),
    },
    {
      title: "Tipo de Grau",
      dataIndex: "degreeType",
      key: "degreeType",
      render: (text) => degreeTypeMapping[text] || text,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined
              style={{ color: "#52c41a", cursor: "pointer" }}
              onClick={() => showEditModal(record.key)}
            />
          </Tooltip>
          <Tooltip title="Apagar">
            <DeleteOutlined
              className="text-red-500 cursor-pointer"
              onClick={() => showDeleteModal(record.key, record.courseCode)}
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
          placeholder="Pesquisar por nome ou código do curso"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
        <Button type="primary" icon={<SearchOutlined />}>
          Pesquisar
        </Button>
      </div>

      <Table
        // ✅ ATUALIZAÇÃO FINAL: A tabela agora usa APENAS a lista filtrada
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <EditCourse
        courseId={selectedCourseId}
        isVisible={isEditModalVisible}
        handleCancel={handleCancelEdit}
        fetchCourses={fetchCourses}
      />

      <Modal
        title="Deseja Deletar?"
        open={isDeleteModalVisible}
        onOk={showConfirmDeleteModal}
        onCancel={handleCancelDelete}
        okText="Sim"
        cancelText="Cancelar"
      >
        <p>Você tem certeza que deseja excluir este curso?</p>
      </Modal>

      <Modal
        title="Confirmação de Exclusão"
        open={isConfirmDeleteVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Confirmar Exclusão"
        cancelText="Cancelar"
        okButtonProps={{ disabled: codeToConfirm !== courseCode }}
      >
        <p>
          Após confirmar, esta ação não poderá ser desfeita. Para confirmar,
          digite o código do curso:
        </p>
        <Input
          value={codeToConfirm}
          onChange={(e) => setCodeToConfirm(e.target.value)}
          placeholder="Digite o código do curso"
        />
        <p>Código do Curso: {courseCode}</p>
      </Modal>
    </div>
  );
};

export default CourseTable;