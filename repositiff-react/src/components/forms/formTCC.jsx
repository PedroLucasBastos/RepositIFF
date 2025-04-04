import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Select,
  DatePicker,
  Form,
  Button,
  Upload,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import moment from "moment";
import "./formTCC.css";

const { Option } = Select;
const { Dragger } = Upload;

const FormTCC = () => {
  const [orientadores, setOrientadores] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState();
  const [selectedCoadvisor, setSelectedCoadvisor] = useState();
  const [file, setFile] = useState(null);
  const [cursos, setCursos] = useState([]);

  // Busca os orientadores na API e extrai o array "Advisors"
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch("http://localhost:3333/advisor/list");
        if (!response.ok) throw new Error("Erro ao buscar orientadores");
        const data = await response.json();
        setOrientadores(data.Advisors || []);
      } catch (error) {
        console.error(error);
        message.error("Falha ao carregar orientadores");
      }
    };

    fetchAdvisors();
  }, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("http://localhost:3333/course/list");
        if (!response.ok) throw new Error("Erro ao buscar cursos");
        const data = await response.json();
        setCursos(data.Courses || []);
      } catch (error) {
        console.error(error);
        message.error("Erro ao carregar cursos");
      }
    };

    fetchCursos();
  }, []);

  // Handler de submissão do formulário
  const handleSubmit = (values) => {
    const formData = new FormData();

    const authorsArray = values.authors.map((author) => author.nome);
    const authorsJson = JSON.stringify(authorsArray);
    formData.append("authors", authorsJson);

    const advisors = [];
    if (selectedAdvisor) advisors.push(selectedAdvisor);
    if (selectedCoadvisor) advisors.push(selectedCoadvisor);
    formData.append("idAdvisors", JSON.stringify(advisors));

    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("year", moment(values.year).year());
    formData.append("qtdPag", values.qtdPag);
    formData.append("description", values.description);
    formData.append("idCourse", values.idCourse);
    formData.append(
      "keyWords",
      JSON.stringify(values.keyWords.filter((kw) => kw && kw.trim()))
    );
    formData.append("ilustration", values.ilustration);

    const referencesArray = values.references.map(Number);
    formData.append("references", JSON.stringify(referencesArray));

    if (file) {
      formData.append("file", file);
    } else {
      message.error("Selecione um arquivo para upload");
      return;
    }

    fetch("http://localhost:3333/academicWork/create", {
      method: "POST",
      body: formData,
    })
      .then((resp) => {
        if (resp.ok) {
          message.success("TCC cadastrado com sucesso!");
        } else {
          resp.text().then((text) => {
            console.error("Erro do backend:", text);
            message.error("Erro ao cadastrar TCC: " + text);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Erro inesperado");
      });
  };

  // Configurações do componente Dragger para captura do arquivo
  const uploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onRemove: () => {
      setFile(null);
    },
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit}>
        {/* Dados dos Autores */}
        <Card title="Dados dos Autores" className="mb-4">
          <Form.List name="authors" initialValue={[{ nome: "" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    title={`Dados do Autor ${index + 1}`}
                    className="mb-4"
                    extra={
                      index > 0 && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined style={{ color: "red" }} />}
                          onClick={() => remove(name)}
                        />
                      )
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "nome"]}
                      label="Nome"
                      rules={[{ required: true, message: "Obrigatório" }]}
                    >
                      <Input placeholder={`Digite o nome do autor ${index + 1}`} />
                    </Form.Item>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="mb-4 w-full"
                >
                  Adicionar mais um autor
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Dados dos Orientadores */}
        <Card title="Dados dos Orientadores" className="mb-4">
          <Form.Item label="Orientador">
            <Select
              placeholder="Selecione o orientador"
              value={selectedAdvisor}
              onChange={(value) => {
                setSelectedAdvisor(value);
                if (value === selectedCoadvisor) {
                  setSelectedCoadvisor(undefined);
                }
              }}
            >
              {orientadores.map((orientador) => (
                <Option key={orientador._id} value={orientador._id}>
                  {`${orientador._props.name} ${orientador._props.surname}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Coorientador">
            <Select
              placeholder="Selecione o coorientador (se houver)"
              value={selectedCoadvisor}
              onChange={(value) => setSelectedCoadvisor(value)}
            >
              {orientadores
                .filter((o) => o._id !== selectedAdvisor)
                .map((o) => (
                  <Option key={o._id} value={o._id}>
                    {`${o._props.name} ${o._props.surname}`}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Card>

        {/* Dados do Trabalho */}
        <Card title="Dados do Trabalho" className="mb-4">
          <Form.Item
            label="Título"
            name="title"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input.TextArea placeholder="Digite o título do trabalho" />
          </Form.Item>

          <Form.Item
            label="Tipo"
            name="type"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Ex: Undergraduate thesis" />
          </Form.Item>

          <Form.Item
            label="Curso"
            name="idCourse"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Select placeholder="Selecione o curso">
              {cursos.map((curso) => (
                <Option key={curso._id} value={curso._id}>
                  {curso._props.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ano"
            name="year"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <DatePicker picker="year" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Número de Páginas"
            name="qtdPag"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Digite o número de páginas" />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="description"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input.TextArea placeholder="Descrição do trabalho acadêmico" />
          </Form.Item>

          <Form.Item
            label="Ilustrações"
            name="ilustration"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Select placeholder="Selecione a opção">
              <Option value="Colorful">Colorido</Option>
              <Option value="nao">Não possui</Option>
              <Option value="pretoEBranco">Preto e Branco</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Referências" name="references">
            <Input.Group compact>
              <Form.Item
                name={["references", 0]}
                noStyle
                rules={[{ required: true, message: "Obrigatório" }]}
              >
                <Input style={{ width: "50%" }} placeholder="De" />
              </Form.Item>
              <Form.Item
                name={["references", 1]}
                noStyle
                rules={[{ required: true, message: "Obrigatório" }]}
              >
                <Input style={{ width: "50%" }} placeholder="Até" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="Palavras-chave" name="keyWords">
            <Input.Group>
              {[...Array(5)].map((_, index) => (
                <Form.Item key={index} name={["keyWords", index]} noStyle>
                  <Input
                    placeholder={`Palavra-chave ${index + 1}`}
                    style={{ marginBottom: 8 }}
                  />
                </Form.Item>
              ))}
            </Input.Group>
          </Form.Item>
        </Card>

        {/* Upload de Arquivos */}
        <Card title="Upload de Arquivos" className="mb-4">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste os arquivos para esta área.
            </p>
            <p className="ant-upload-hint">Suporte para upload de arquivos.</p>
          </Dragger>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormTCC;
