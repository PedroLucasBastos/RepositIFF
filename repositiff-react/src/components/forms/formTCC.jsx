import React, { useState } from "react";
import {
  Card,
  Input,
  Select,
  DatePicker,
  Form,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import "./formTCC.css"; // Importação do arquivo de estilos

const { Option } = Select;
const { Dragger } = Upload;

const FormTCC = () => {
  const [autores, setAutores] = useState([{ id: 1 }]); // Lista de autores com um autor inicial

  const adicionarAutor = () => {
    setAutores([...autores, { id: autores.length + 1 }]); // Adiciona um novo autor com ID único
  };

  const removerAutor = (id) => {
    Modal.confirm({
      title: "Confirmar exclusão",
      content: "Tem certeza que deseja remover este autor?",
      okText: "Sim",
      cancelText: "Não",
      onOk: () => {
        setAutores(autores.filter((autor) => autor.id !== id)); // Remove o autor pelo ID
      },
    });
  };

  // Configurações do Upload
  const uploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} enviado com sucesso.`);
      } else if (status === "error") {
        message.error(`${info.file.name} falha ao enviar.`);
      }
    },
    onDrop(e) {
      console.log("Arquivos arrastados", e.dataTransfer.files);
    },
  };
  return (
    <div>
      <Form layout="vertical">
        {/* Renderizar múltiplos cards para Dados do Autor */}
        {autores.map((autor, index) => (
          <Card
            key={autor.id}
            title={`Dados do Autor ${index + 1}`}
            className="mb-4"
            extra={
              index > 0 && (
                <Button
                  type="text"
                  icon={<DeleteOutlined style={{ color: "red" }} />}
                  onClick={() => removerAutor(autor.id)}
                />
              )
            }
          >
            <Form.Item label="Nome">
              <Input placeholder={`Digite o nome do autor ${index + 1}`} />
            </Form.Item>
            <Form.Item label="Sobrenome">
              <Input placeholder={`Digite o sobrenome do autor ${index + 1}`} />
            </Form.Item>
          </Card>
        ))}

        {/* Botão para adicionar mais autores */}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={adicionarAutor}
          className="mb-4 w-full "
        >
          Adicionar mais um autor
        </Button>

        {/* Card para Dados do Orientador */}
        <Card title="Dados do Orientador" className="mb-4">
          <Form.Item label="Nome do Orientador">
            <Input placeholder="Digite o nome do orientador" />
          </Form.Item>
          <Form.Item label="Sobrenome do Orientador">
            <Input placeholder="Digite o sobrenome do orientador" />
          </Form.Item>
          <Form.Item label="Nome do Coorientador">
            <Input placeholder="Digite o nome do coorientador (se houver)" />
          </Form.Item>
          <Form.Item label="Sobrenome do Coorientador">
            <Input placeholder="Digite o sobrenome do coorientador (se houver)" />
          </Form.Item>
        </Card>

        {/* Card para Dados do Trabalho */}
        <Card title="Dados do Trabalho" className="mb-4">
          <Form.Item label="Título">
            <Input.TextArea placeholder="Digite o título do trabalho" />
          </Form.Item>

          <div className="flex gap-4">
            <div style={{ width: "25%" }}>
              <Form.Item label="Curso">
                <Select placeholder="Selecione o curso">
                  <Option value="engenharia">Engenharia da Computação</Option>
                  <Option value="alimentos">
                    Ciência e Tecnologia dos Alimentos
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ width: "25%" }}>
              <Form.Item label="Ano">
                <DatePicker
                  picker="year"
                  placeholder="Selecione o ano"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <div style={{ width: "25%" }}>
              <Form.Item label="Número de Páginas">
                <Input placeholder="Digite o número de páginas" />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4">
            <div style={{ width: "25%" }}>
              <Form.Item label="Ilustrações">
                <Select placeholder="Selecione a opção de ilustrações">
                  <Option value="nao">Não possui</Option>
                  <Option value="pretoEBranco">Preto e Branco</Option>
                  <Option value="colorido">Colorido</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ width: "25%" }}>
              <Form.Item label="Referências">
                <div className="flex items-center gap-2">
                  <Input placeholder="De" style={{ flex: 1 }} />
                  <span>à</span>
                  <Input placeholder="Até" style={{ flex: 1 }} />
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div style={{ width: "25%" }}>
              <Form.Item label="CDD">
                <Input placeholder="Digite o codigo CDD" />
              </Form.Item>
            </div>
            <div style={{ width: "25%" }}>
              <Form.Item label="CDU">
                <Input placeholder="Digite o codigo CDU" />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div style={{ width: "25%" }}>
              <Form.Item label="Código Cutter">
                <Input placeholder="Digite o código Cutter" />
              </Form.Item>
            </div>
            <div>
              <Button type="primary" htmlType="submit" className="w-full">
                Gerar codigo
              </Button>
            </div>
          </div>
        </Card>

        {/* Card para Palavras-chave */}
        <Card title="Palavras-chave" className="mb-4">
          <div style={{ width: "40%" }}>
            <Form.Item label="Assuntos (Mínimo 1, Máximo 5)">
              {[...Array(5)].map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  placeholder={`Palavra-chave ${index + 1}`}
                  className="mb-2"
                />
              ))}
            </Form.Item>
          </div>
        </Card>

        {/* Seção de upload de arquivos */}
        <Card title="Upload de Arquivos" className="mb-4">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste os arquivos para esta área
            </p>
            <p className="ant-upload-hint">
              Suporte para upload de múltiplos arquivos.
            </p>
          </Dragger>
        </Card>

        {/* Botão de Salvar */}
        <Button type="primary" htmlType="submit" className="w-full">
          Salvar
        </Button>
      </Form>
    </div>
  );
};

export default FormTCC;
