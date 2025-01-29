import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message, Modal } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

const CourseTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [codeToConfirm, setCodeToConfirm] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

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

  const handleCodeChange = (e) => {
    setCodeToConfirm(e.target.value);
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3333/course/delete", {
        data: { courseId: selectedCourseId },
      });

      message.success("Curso excluído com sucesso!");
      setConfirmDeleteVisible(false);
      fetchCourses();
    } catch (error) {
      message.error("Erro ao excluir o curso: " + error.message);
    }
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
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
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
          placeholder="Pesquisar Curso"
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
        <p>Você tem certeza que deseja excluir este curso?</p>
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
          disabled: codeToConfirm !== courseCode,
        }}
        cancelButtonProps={{ className: "bg-gray-200 border-none" }}
      >
        <p>
          Após confirmar, esta ação não poderá ser desfeita. Para confirmar,
          digite o código do curso:
        </p>
        <Input
          value={codeToConfirm}
          onChange={handleCodeChange}
          placeholder="Digite o código do curso"
        />
        <p>Código do Curso: {courseCode}</p>
      </Modal>
    </div>
  );
};

export default CourseTable;
