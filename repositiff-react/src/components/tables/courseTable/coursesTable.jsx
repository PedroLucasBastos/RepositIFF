import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const CoursesTable = () => {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Função para buscar os cursos do banco
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3333/course/list");
      console.log(response.data); // Verifica a estrutura no console

      // Acessando o array correto e pegando os _props de cada curso
      const courses = response.data.Courses.map((course) => ({
        key: course._id, // Usando o _id como chave única
        name: course._props.name,
        courseCode: course._props.courseCode,
        degreeType: course._props.degreeType,
      }));

      setDataSource(courses);
    } catch (error) {
      console.error("Erro ao buscar os cursos:", error);
      message.error("Erro ao buscar os cursos: " + error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Função para filtrar os cursos
  const handleSearch = () => {
    const filtered = dataSource.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Definição das colunas
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
      sorter: (a, b) => a.degreeType.localeCompare(b.degreeType),
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
              style={{ color: "#ff4d4f", cursor: "pointer" }}
              onClick={() =>
                message.success(`Curso "${record.name}" removido!`)
              }
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
          placeholder="Pesquisar Curso"
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
        rowKey="courseCode"
      />
    </div>
  );
};

export default CoursesTable;
