import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Select,
  DatePicker,
  Form,
  Button,
  Upload,
  message,
  Space
} from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import moment from "moment";
import "../EditTCC/formEditTCC.css";
import PropTypes from "prop-types";

const { Option } = Select;
const { Dragger } = Upload;

const FormEditTCC = ({ onClose, tccData }) => {
  const [form] = Form.useForm();
  const [orientadoresDisponiveis, setOrientadoresDisponiveis] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [selectedCoadvisor, setSelectedCoadvisor] = useState(null);
  const [initialAdvisorIds, setInitialAdvisorIds] = useState([]);
  const [file, setFile] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [existingFileName, setExistingFileName] = useState(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch("http://localhost:3333/advisor/list");
        if (!response.ok) throw new Error("Erro ao buscar orientadores");
        const data = await response.json();
        const filteredAdvisors = (data.Advisors || []).filter(adv => adv._id !== null && adv._id !== undefined);
        setOrientadoresDisponiveis(filteredAdvisors);
        console.log("Orientadores carregados e filtrados (filtrados por _ID válido):", filteredAdvisors);
      } catch (error) {
        console.error("Falha ao carregar orientadores:", error);
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
        // <<<<<<<<<<<<<<< MUDANÇA CRÍTICA AQUI PARA CURSOS: PADRONIZANDO PARA _ID >>>>>>>>>>>>>>>>>
        // A API /course/list retorna _id, então usamos _id.
        const formattedCursos = (data.Courses || []).map(curso => ({
          _id: curso._id, // Usamos _id aqui para ser consistente com a API de listagem
          name: curso._props.name // Assume que o nome está em _props.name
        })).filter(curso => curso._id !== null && typeof curso._id !== 'undefined'); // Filtra cursos com _ID nulo
        setCursos(formattedCursos);
        console.log("Cursos carregados e formatados (filtrados por _ID válido):", formattedCursos);
        // <<<<<<<<<<<<<<< FIM DA MUDANÇA CRÍTICA >>>>>>>>>>>>>>>>>
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        message.error("Erro ao carregar cursos");
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    if (tccData) {
      console.log("------------------------------------");
      console.log("Dados completos do TCC recebidos para edição:", tccData);
      console.log("Tipo de tccData.authors:", typeof tccData.authors, tccData.authors);
      console.log("tccData.advisors (estrutura):", tccData.advisors);
      console.log("tccData.course (estrutura):", tccData.course);
      console.log("tccData.idCourse (do tccData):", tccData.idCourse);
      console.log("tccData.year:", tccData.year);
      console.log("tccData.qtdPag:", tccData.qtdPag);
      console.log("tccData.description:", tccData.description);
      console.log("tccData.ilustration:", tccData.ilustration);
      console.log("tccData.references:", tccData.references);
      console.log("tccData.keyWords:", tccData.keyWords);
      console.log("------------------------------------");

      let authorsToProcess = [];
      if (typeof tccData.authors === 'string') {
        try {
          const parsed = JSON.parse(tccData.authors);
          if (Array.isArray(parsed)) {
            authorsToProcess = parsed;
          } else {
            authorsToProcess = tccData.authors.split(',').map(name => name.trim()).filter(name => name);
          }
        } catch (e) {
          console.warn("tccData.authors não é JSON válido ou array, tratando como string simples:", tccData.authors);
          authorsToProcess = tccData.authors.split(',').map(name => name.trim()).filter(name => name);
        }
      } else if (Array.isArray(tccData.authors)) {
        authorsToProcess = tccData.authors;
      }

      const formattedAuthors = (authorsToProcess || []).map((authorName) => ({
        nome: authorName,
      }));

      // --- TRATAMENTO PARA ORIENTADORES: Comparando registrationNumber ---
      const currentAdvisorsInTCC = tccData.advisors || [];
      const identifiedAdvisorIds = []; 
      
      if (orientadoresDisponiveis.length > 0) {
        currentAdvisorsInTCC.forEach(tccAdvisor => {
          const regNumberFromTCC = tccAdvisor.registrationNumber; 
          const foundAdvisor = orientadoresDisponiveis.find(
            availableAdvisor => availableAdvisor._props.registrationNumber === regNumberFromTCC
          );
          if (foundAdvisor) {
            identifiedAdvisorIds.push(foundAdvisor._id); 
          }
        });
      }
      
      setInitialAdvisorIds(identifiedAdvisorIds);

      const initialAdvisorId = identifiedAdvisorIds[0] || null;
      const initialCoadvisorId = identifiedAdvisorIds[1] || null;

      setSelectedAdvisor(initialAdvisorId);
      setSelectedCoadvisor(initialCoadvisorId);
      console.log("Orientador ID inicial (identificado por registrationNumber e _id):", initialAdvisorId);
      console.log("Coorientador ID inicial (identificado por registrationNumber e _id):", initialCoadvisorId);

      // Define o nome do arquivo existente
      if (tccData.file && tccData.file.filename) {
        setExistingFileName(tccData.file.filename);
      } else {
        setExistingFileName(null);
      }

      // <<<<<<<<<<<<<<< MUDANÇA CRÍTICA AQUI PARA idCourse: PADRONIZANDO PARA _ID >>>>>>>>>>>>>>>>>
      let initialCourseId = undefined;
      if (cursos.length > 0 && tccData.course?.id) { // Se a lista de cursos e o ID do TCC estiverem disponíveis
        // Encontra o curso na lista de cursos disponíveis pelo ID
        const foundCourse = cursos.find(c => c.id === tccData.course.id);
        if (foundCourse) {
          initialCourseId = foundCourse._id; // Pega o _id da lista de cursos (padronizado)
        }
      } else if (tccData.idCourse) { // Fallback, se o idCourse vier direto e não como tccData.course?.id
         // Se idCourse vem direto e não aninhado, tenta encontrar ele na lista de cursos para padronizar
         const foundCourseById = cursos.find(c => c.id === tccData.idCourse);
         if(foundCourseById) {
            initialCourseId = foundCourseById._id;
         } else {
            initialCourseId = tccData.idCourse; // Se não encontrar na lista, usa o ID como está, mas pode ser inconsistente
         }
      }
      // <<<<<<<<<<<<<<< FIM DA MUDANÇA CRÍTICA >>>>>>>>>>>>>>>>>

      const fieldsToSet = {
        title: tccData.title || '',
        typeWork: tccData.typeWork || '',
        cddCode: tccData.cddCode || '',
        cduCode: tccData.cduCode || '',
        idCourse: initialCourseId, // Agora usa o ID padronizado para o curso
        year: tccData.year ? moment(String(tccData.year)) : undefined,
        qtdPag: tccData.qtdPag || '',
        description: tccData.description || '',
        ilustration: tccData.ilustration || undefined,
        
        references: Array.isArray(tccData.references) && tccData.references.length === 2
                      ? tccData.references
                      : [null, null],
        
        keyWords: Array.isArray(tccData.keyWords)
                    ? [...tccData.keyWords, ...Array(5 - tccData.keyWords.length).fill('')].slice(0, 5)
                    : ['', '', '', '', ''],
        
        authors: formattedAuthors.length > 0 ? formattedAuthors : [{ nome: "" }],
      };

      form.setFieldsValue(fieldsToSet);
      console.log("Valores definidos no formulário (ajustados para ID e registrationNumber):", fieldsToSet);
    }
  }, [tccData, form, orientadoresDisponiveis, cursos]); 

  const handleSubmit = async (values) => {
    try {
      message.loading({ content: "Salvando alterações...", key: "editTCC" });

      const formData = new FormData();

      formData.append("id", tccData.id);

      formData.append("title", values.title);
      formData.append("typeWork", values.typeWork);
      formData.append("cddCode", values.cddCode);
      formData.append("cduCode", values.cduCode);
      formData.append("year", moment(values.year).year());
      formData.append("qtdPag", values.qtdPag);
      formData.append("description", values.description);
      formData.append("idCourse", values.idCourse); // Envia o ID selecionado (que agora será _id)
      formData.append("ilustration", values.ilustration);

      formData.append("authors", JSON.stringify(values.authors.map((author) => author.nome)));
      formData.append("keyWords", JSON.stringify(values.keyWords.filter((kw) => kw && kw.trim())));
      formData.append("references", JSON.stringify(values.references));

      if (file) {
        formData.append("file", file);
      }

      const basicResponse = await fetch("http://localhost:3333/academicWork/basicUpdate", {
        method: "PUT",
        body: formData,
      });

      if (!basicResponse.ok) {
        const errorText = await basicResponse.text();
        throw new Error(`Erro ao atualizar dados básicos (incluindo PDF): ${errorText}`);
      }

      const currentSelectedAdvisorIds = [];
      if (selectedAdvisor) currentSelectedAdvisorIds.push(selectedAdvisor);
      if (selectedCoadvisor) currentSelectedCoadvisorIds.push(selectedCoadvisor);

      const advisorsToAdd = currentSelectedAdvisorIds.filter(
        (id) => !initialAdvisorIds.includes(id)
      );
      const advisorsToRemove = initialAdvisorIds.filter(
        (id) => !currentSelectedAdvisorIds.includes(id)
      );

      for (const advisorId of advisorsToAdd) {
        const addAdvisorResponse = await fetch("http://localhost:3333/academicWork/addAdvisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ academicWorkId: tccData.id, advisorId: advisorId }),
        });
        if (!addAdvisorResponse.ok) {
          const errorText = await addAdvisorResponse.text();
          console.warn(`Falha ao adicionar orientador ${advisorId}: ${errorText}`);
          message.warning(`Não foi possível adicionar um orientador. Pode ser que ele já esteja associado.`);
        }
      }

      for (const advisorId of advisorsToRemove) {
        const deleteAdvisorResponse = await fetch("http://localhost:3333/academicWork/deleteAdvisor", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ academicWorkId: tccData.id, advisorId: advisorId }),
        });
        if (!deleteAdvisorResponse.ok) {
          const errorText = await deleteAdvisorResponse.text();
          console.warn(`Falha ao remover orientador ${advisorId}: ${errorText}`);
          message.warning(`Não foi possível remover um orientador.`);
        }
      }

      message.success({ content: "TCC atualizado com sucesso!", key: "editTCC", duration: 2 });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erro na atualização do TCC:", error);
      message.error({ content: `Erro ao atualizar TCC: ${error.message}`, key: "editTCC", duration: 5 });
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    beforeUpload: (uploadedFile) => {
      setFile(uploadedFile);
      setExistingFileName(uploadedFile.name);
      return false;
    },
    onRemove: () => {
      setFile(null);
      setExistingFileName(tccData.file?.filename || null);
      return true;
    },
    fileList: file
      ? [{ uid: 'new-file', name: file.name, status: 'done', size: file.size }]
      : existingFileName
        ? [{ uid: 'existing-file', name: existingFileName, status: 'done', url: tccData.file?.url }]
        : [],
  };


  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card title="Dados dos Autores" className="mb-4">
          <Form.List name="authors">
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

        <Card title="Dados dos Orientadores" className="mb-4">
          <Form.Item label="Orientador">
            <Select
              placeholder="Selecione o orientador"
              value={selectedAdvisor}
              onChange={(value) => {
                setSelectedAdvisor(value);
                if (value === selectedCoadvisor) {
                  setSelectedCoadvisor(null);
                }
              }}
              allowClear
            >
              {orientadoresDisponiveis.map((orientador) => (
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
              allowClear
            >
              {orientadoresDisponiveis
                .filter((o) => o._id !== selectedAdvisor) 
                .map((o) => (
                  <Option key={o._id} value={o._id}>
                    {`${o._props.name} ${o._props.surname}`}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Card>

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
            name="typeWork"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Ex: Undergraduate thesis" />
          </Form.Item>

          <Form.Item
            label="CDD"
            name="cddCode"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Ex: 123.1" />
          </Form.Item>

          <Form.Item
            label="CDU"
            name="cduCode"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Ex: 123/456 ou 123.1" />
          </Form.Item>

          <Form.Item
            label="Curso"
            name="idCourse"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Select 
              placeholder="Selecione o curso"
              showSearch // Permite pesquisa
              optionFilterProp="children" // Filtra pelo texto da Option
              filterOption={(input, option) => // Função de filtro customizada
                (option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {cursos.map((curso) => (
                <Option key={curso._id} value={curso._id}> {/* AQUI: Chave e Valor são _id */}
                  {curso.name} {/* O texto exibido é o nome */}
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
            <Input type="number" placeholder="Digite o número de páginas" />
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
                name={[ "references", 0 ]}
                noStyle
              >
                <Input type="number" style={{ width: "50%" }} placeholder="Página inicial" />
              </Form.Item>
              <Form.Item
                name={[ "references", 1 ]}
                noStyle
              >
                <Input type="number" style={{ width: "50%" }} placeholder="Página final" />
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

        <Card title="Upload de Arquivos" className="mb-4">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste os arquivos para esta área.
            </p>
            <p className="ant-upload-hint">Suporte para upload de arquivos.</p>
            {existingFileName && !file && (
              <p className="ant-upload-list-item-name">Arquivo atual: {existingFileName}</p>
            )}
          </Dragger>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Salvar Alterações
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

FormEditTCC.propTypes = {
  onClose: PropTypes.func,
  tccData: PropTypes.object,
};

export default FormEditTCC;