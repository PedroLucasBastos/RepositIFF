import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Select,
  // DatePicker, // <-- MUDANÇA: Removido
  Form,
  Button,
  Upload,
  message,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InboxOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
// import moment from "moment"; // <-- MUDANÇA: Removido
import PropTypes from "prop-types";
import "./formEditTCC.css";
import DatePickerEstilizado from "@/components/datepicker/DatePickerEstilizado";
import Cookies from "js-cookie";


const { Option } = Select;
const { Dragger } = Upload;

const FormEditTCC = ({ tccData, onClose }) => {
  const [form] = Form.useForm();
  const [orientadores, setOrientadores] = useState([]);
  const [currentMainAdvisor, setCurrentMainAdvisor] = useState(null);
  const [currentCoAdvisor, setCurrentCoAdvisor] = useState(null);
  const [availableAdvisors, setAvailableAdvisors] = useState([]);
  const [selectedAdvisorForDropdown, setSelectedAdvisorForDropdown] = useState(null);
  const [selectedCoadvisorForDropdown, setSelectedCoadvisorForDropdown] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
      authors:
        typeof tccData.authors === "string"
          ? tccData.authors.split(",").map((nome) => ({ nome: nome.trim() }))
          : Array.isArray(tccData.authors)
          ? tccData.authors.map((nome) => ({ nome }))
          : [],
      title: tccData.title,
      typeWork: String(tccData.workType || tccData.typeWork || ""),
      cddCode: tccData.cddCode,
      cduCode: tccData.cduCode,
      idCourse: tccData.course?.id,
      // <-- MUDANÇA: Usa new Date() para criar um objeto de data nativo
      year: tccData.year ? new Date(tccData.year, 0) : null,
      qtdPag: tccData.pageCount || tccData.qtdPag,
      description: tccData.description,
      ilustration: tccData.ilustration,
      references: tccData.references || [],
      keyWords: tccData.keyWords || [],
    });

    let main = null;
    let co = null;
    if (Array.isArray(tccData.advisors) && tccData.advisors.length > 0) {
      main = tccData.advisors[0];
      if (tccData.advisors.length > 1) {
        co = tccData.advisors[1];
      }
    }
    setCurrentMainAdvisor(main || null);
    setCurrentCoAdvisor(co || null);
  }, [tccData, form]);

  useEffect(() => {
    async function loadLists() {
      try {
        const [aRes, cRes] = await Promise.all([
          fetch("http://localhost:3333/advisor/list"),
          fetch("http://localhost:3333/course/list"),
        ]);
        const aJson = await aRes.json();
        const cJson = await cRes.json();
        setOrientadores(aJson.Advisors || []);
        setCursos(cJson.Courses || []);
      } catch (err) {
        console.error(err);
        message.error("Erro ao carregar listas de orientadores e cursos.");
      }
    }
    loadLists();
  }, []);

  useEffect(() => {
    console.log("dados trabalho", tccData);
    const assignedAdvisorIds = [];
    if (currentMainAdvisor) assignedAdvisorIds.push(currentMainAdvisor.id);
    if (currentCoAdvisor) assignedAdvisorIds.push(currentCoAdvisor.id);

    const filtered = orientadores.filter((o) => !assignedAdvisorIds.includes(o._id));
    setAvailableAdvisors(filtered);
    setSelectedAdvisorForDropdown(null);
    setSelectedCoadvisorForDropdown(null);
  }, [orientadores, currentMainAdvisor, currentCoAdvisor]);

  const handleSubmit = async (values) => {
    const parsedQtdPag = Number(values.qtdPag);
    if (isNaN(parsedQtdPag)) {
      message.error("Número de Páginas deve ser um valor numérico válido.");
      return;
    }

    const modifiedFields = {};
    const originalData = tccData;

    const areSimpleArraysEqual = (arr1, arr2) => {
      if (!arr1 || !arr2) return arr1 === arr2;
      if (arr1.length !== arr2.length) return false;
      const sorted1 = [...arr1].sort();
      const sorted2 = [...arr2].sort();
      return sorted1.every((value, index) => value === sorted2[index]);
    };

    if (values.title !== originalData.title) {
      modifiedFields.title = values.title;
    }
    if (String(values.typeWork || "") !== String(originalData.workType || originalData.typeWork || "")) {
      modifiedFields.workType = String(values.typeWork || "");
    }
    if (values.cddCode !== originalData.cddCode) {
      modifiedFields.cddCode = values.cddCode;
    }
    if (values.cduCode !== originalData.cduCode) {
      modifiedFields.cduCode = values.cduCode;
    }
    if (values.idCourse !== originalData.course?.id) {
      modifiedFields.courseId = values.idCourse;
    }
    // <-- MUDANÇA: Usa .getFullYear() para comparar o ano
    if (values.year?.getFullYear() !== originalData.year) {
      // <-- MUDANÇA: Usa .getFullYear() para obter o ano
      modifiedFields.year = values.year.getFullYear();
    }
    if (Number(values.qtdPag) !== (originalData.pageCount || originalData.qtdPag)) {
      modifiedFields.pageCount = Number(values.qtdPag);
    }
    if (values.description !== originalData.description) {
      modifiedFields.description = values.description;
    }
    if (values.ilustration !== originalData.ilustration) {
      modifiedFields.ilustration = values.ilustration;
    }

    const newAuthors = (values.authors || []).map(a => a.nome.trim()).filter(Boolean);
    const originalAuthors = Array.isArray(originalData.authors) ? originalData.authors : (originalData.authors || '').split(",").map(a => a.trim()).filter(Boolean);
    if (!areSimpleArraysEqual(newAuthors, originalAuthors)) {
      modifiedFields.authors = newAuthors;
    }

    const newReferences = (values.references || []).map(Number).filter(n => !isNaN(n));
    if (!areSimpleArraysEqual(newReferences, originalData.references || [])) {
        modifiedFields.references = newReferences;
    }
    
    const newKeyWords = (values.keyWords || []).filter(kw => kw && kw.trim());
    if (!areSimpleArraysEqual(newKeyWords, originalData.keyWords || [])) {
      modifiedFields.keyWords = newKeyWords;
    }

    if (Object.keys(modifiedFields).length === 0) {
      message.info("Nenhuma alteração detectada para salvar.");
      onClose();
      return;
    }
    
    const payloadFields = { ...modifiedFields };

    if (!payloadFields.hasOwnProperty('authors')) {
        payloadFields.authors = originalAuthors;
    }
    
    
    const payload = {
        id: tccData.id,
        fields: payloadFields
    };
    const authToken = Cookies.get("authToken");
    console.log("Token de autenticação:", authToken);
    if (!authToken) {
      message.error("Sessão expirada. Faça login novamente.");
      onClose();
      return;
    }
    console.log("Payload para basicUpdate:", payload);
    console.log("Token de autenticação:", authToken);
    try {
      const resp = await fetch("http://localhost:3333/academicWork/basicUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${authToken}`},
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ message: "Erro desconhecido do servidor." }));
        const errorMessage = errorData.error || errorData.detail || errorData.Error?.details || errorData.message || "Falha ao atualizar dados.";
        throw new Error(errorMessage);
      }

      message.success("Dados atualizados com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro no handleSubmit:", err);
      message.error(err.message);
    }
  };

  const handleAddAdvisorRole = async (advisorId, isMainRole) => {
    if (!advisorId) {
      message.error("Selecione um orientador antes de adicionar.");
      return;
    }
    if (!isMainRole && !currentMainAdvisor) {
      message.error("Não é possível adicionar um co-orientador sem um orientador principal.");
      return;
    }
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      message.error("Sessão expirada. Faça login novamente.");
      onClose();
      return;
    }

    try {
      const addResp = await fetch("http://localhost:3333/academicWork/addAdvisor", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({ academicWorkId: tccData.id, advisorId: advisorId}),
      });
      if (!addResp.ok) throw new Error("Erro ao associar orientador.");

      const addedAdvisor = orientadores.find(o => o._id === advisorId);
    if (addedAdvisor) {
      if (isMainRole) {
        setCurrentMainAdvisor({
          id: addedAdvisor._id,
          name: addedAdvisor._props.name,
          surname: addedAdvisor._props.surname,
        });
      } else {
        setCurrentCoAdvisor({
          id: addedAdvisor._id,
          name: addedAdvisor._props.name,
          surname: addedAdvisor._props.surname,
        });
      }
    }

      message.success(`Orientador adicionado com sucesso!`);
      
    } catch (error) {
      console.error("Erro ao adicionar orientador:", error);
      message.error(error.message || "Falha ao adicionar orientador.");
    }
  };

  const handleRemoveAdvisorRole = async (advisorId) => {
    console.log("--- DEBUG: REMOVENDO ORIENTADOR ---");
  console.log("ID enviado pelo clique:", advisorId);
  console.log("ID do Orientador Principal (antes):", currentMainAdvisor?.id);
  console.log("ID do Co-Orientador (antes):", currentCoAdvisor?.id);
  console.log("------------------------------------");

    const authToken = Cookies.get("authToken");
    if (!authToken) {
      message.error("Sessão expirada. Faça login novamente.");
      onClose();
      return;
    }
    

    try {
      const removeResp = await fetch("http://localhost:3333/academicWork/deleteAdvisor", {
        method: "POST",
        headers: { "Content-Type": "application/json","Authorization ": `Bearer ${authToken}` },
        body: JSON.stringify({ academicWorkId: tccData.id, advisorId: advisorId }),
      });
      if (!removeResp.ok) throw new Error("Erro ao remover orientador.");

      message.success("Orientador removido com sucesso!");
      if (currentMainAdvisor && currentMainAdvisor.id === advisorId) {
      setCurrentMainAdvisor(null);
    } 
    
    // Verifica se o ID removido corresponde ao co-orientador
    if (currentCoAdvisor && currentCoAdvisor.id === advisorId) {
      setCurrentCoAdvisor(null);
    }
      
    } catch (error) {
      console.error("Erro ao remover orientador:", error);
      message.error(error.message || "Falha ao remover orientador.");
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (f) => {
      setFile(f);
      return false;
    },
    onRemove: () => setFile(null),
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Card title="Dados dos Autores" className="mb-4">
        <Form.List name="authors" initialValue={[]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, idx) => (
                <Card
                  key={key}
                  title={`Autor ${idx + 1}`}
                  className="mb-3"
                  extra={
                    fields.length > 1 && (
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
                    rules={[{ required: true, message: "Obrigatório" }]}
                  >
                    <Input placeholder="Nome do autor" />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
              >
                Adicionar autor
              </Button>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="Dados dos Orientadores" className="mb-4">
        <div className="mb-3">
          <h5>Orientador Principal:</h5>
          {currentMainAdvisor ? (
            <Space>
              <span>
                {currentMainAdvisor.name} {currentMainAdvisor.surname}
              </span>
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => handleRemoveAdvisorRole(currentMainAdvisor?.id)}
              />
            </Space>
          ) : (
            <Space style={{ width: "100%" }}>
              <Select
                placeholder="Selecione o orientador principal"
                value={selectedAdvisorForDropdown}
                onChange={setSelectedAdvisorForDropdown}
                style={{ flexGrow: 1 }}
              >
                {availableAdvisors.map((o) => (
                  <Option key={o._id} value={o._id}>
                    {o._props.name} {o._props.surname}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => handleAddAdvisorRole(selectedAdvisorForDropdown, true)}
              >
                Adicionar
              </Button>
            </Space>
          )}
        </div>

        <div className="mb-3">
          <h5>Co-Orientador:</h5>
          {currentCoAdvisor ? (
            <Space>
              <span>
                {currentCoAdvisor.name} {currentCoAdvisor.surname}
              </span>
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => handleRemoveAdvisorRole(currentCoAdvisor?.id)}
              />
            </Space>
          ) : (
            <Space style={{ width: "100%" }}>
              <Select
                placeholder="Selecione o co-orientador"
                value={selectedCoadvisorForDropdown}
                onChange={setSelectedCoadvisorForDropdown}
                style={{ flexGrow: 1 }}
                disabled={!currentMainAdvisor}
              >
                {availableAdvisors.map((o) => (
                  <Option key={o._id} value={o._id}>
                    {o._props.name} {o._props.surname}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => handleAddAdvisorRole(selectedCoadvisorForDropdown, false)}
                disabled={!currentMainAdvisor}
              >
                Adicionar
              </Button>
            </Space>
          )}
        </div>
      </Card>

      <Card title="Dados do Trabalho" className="mb-4">
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "O título é obrigatório" }]}
        >
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item
          name="typeWork"
          label="Tipo de Trabalho"
          rules={[{ required: true, message: "O tipo de trabalho é obrigatório" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cddCode"
          label="CDD"
          rules={[{ required: true, message: "O código CDD é obrigatório" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cduCode"
          label="CDU"
          rules={[{ required: true, message: "O código CDU é obrigatório" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="idCourse"
          label="Curso"
          rules={[{ required: true, message: "O curso é obrigatório" }]}
        >
          <Select placeholder="Selecione o curso">
            {cursos.map((c) => (
              <Option key={c._id} value={c._id}>
                {c._props.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <-- MUDANÇA: Substituição do DatePicker aqui --> */}
        <Form.Item
          name="year"
          label="Ano"
          rules={[{ required: true, message: "O ano é obrigatório" }]}
        >
          <DatePickerEstilizado showYearPicker />
        </Form.Item>
        <Form.Item
          name="qtdPag"
          label="Número de Páginas"
          rules={[{ required: true, message: "O número de páginas é obrigatório" }]}
        >
          <Input type="number" min={1} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: "A descrição é obrigatória" }]}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
        </Form.Item>
        <Form.Item
          name="ilustration"
          label="Ilustrações"
          rules={[{ required: true, message: "A seleção de ilustração é obrigatória" }]}
        >
          <Select placeholder="Selecione se possui ilustrações">
            <Option value="Colorful">Colorido</Option>
            <Option value="nao">Não possui</Option>
            <Option value="pretoEBranco">Preto e Branco</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Referências">
          <Space.Compact style={{width: "100%"}}>
            <Form.Item
              name={["references", 0]}
              noStyle
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input placeholder="De (página inicial)" type="number" min={1} />
            </Form.Item>
            <Form.Item
              name={["references", 1]}
              noStyle
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input placeholder="Até (página final)" type="number" min={1} />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item label="Palavras-chave">
          <Space.Compact direction="vertical" style={{ width: "100%" }}>
            {[...Array(5)].map((_, i) => (
              <Form.Item key={i} name={["keyWords", i]} noStyle>
                <Input placeholder={`Palavra-chave ${i + 1}`} className="mb-2" />
              </Form.Item>
            ))}
          </Space.Compact>
        </Form.Item>
      </Card>

      <Card title="Upload de Arquivos" className="mb-4">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Clique ou arraste o arquivo PDF aqui.</p>
        </Dragger>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Salvar Alterações
        </Button>
      </Form.Item>
    </Form>
  );
};

FormEditTCC.propTypes = {
  tccData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    authors: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    title: PropTypes.string,
    workType: PropTypes.string,
    typeWork: PropTypes.string,
    year: PropTypes.number,
    pageCount: PropTypes.number,
    qtdPag: PropTypes.number,
    description: PropTypes.string,
    course: PropTypes.shape({ id: PropTypes.string }),
    keyWords: PropTypes.array,
    ilustration: PropTypes.string,
    references: PropTypes.array,
    cddCode: PropTypes.string,
    cduCode: PropTypes.string,
    advisors: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FormEditTCC;