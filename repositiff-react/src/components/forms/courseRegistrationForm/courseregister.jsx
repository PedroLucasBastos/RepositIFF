import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// Recebe a nova prop 'onCourseRegistered'
const RegisterCourse = ({ handleCancel, onCourseRegistered }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [backendErrors, setBackendErrors] = useState({
    name: "",
    courseCode: "",
    degreeType: "",
  });

  const onFinish = async (values) => {
    setLoading(true);
    setBackendErrors({ name: "", courseCode: "", degreeType: "" });

    try {
      // Pega o token do cookie
      const token = Cookies.get("authToken");

      // Cria a configuração de headers com o token
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      console.log('Headers:', headers);
      console.log('Values:', values);
      // Passa os headers na requisição POST
      await axios.post("http://localhost:3333/course/register", values, { headers });
      
      message.success("Curso cadastrado com sucesso!");

      // Avisa o componente pai que um novo curso foi registrado
      onCourseRegistered();

      form.resetFields();
      handleCancel(); // Fecha o modal
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // CORREÇÃO: Renomeia 'message' para 'backendMessage' para evitar conflito
        const { message: backendMessage, statusCode } = error.response.data;

        if (backendMessage === "Course name already in use") {
          setBackendErrors({ name: "Nome do curso já cadastrado.", courseCode: "", degreeType: "" });
          form.scrollToField("name");
        } else if (backendMessage === "Course code already in use") {
           setBackendErrors({ name: "", courseCode: "Código do curso já cadastrado.", degreeType: "" });
           form.scrollToField("courseCode");
        } else if (statusCode === 401) {
            message.error("Não autorizado. Você precisa ser um administrador para cadastrar um curso.");
        } else {
           message.error("Erro ao cadastrar o curso. Tente novamente.");
        }
      } else {
        message.error("Erro ao conectar com o servidor. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item
        label="Nome do Curso"
        name="name"
        rules={[{ required: true, message: "Por favor, insira o nome do curso!" }]}
        help={backendErrors.name}
        validateStatus={backendErrors.name ? "error" : ""}
      >
        <Input placeholder="Nome completo do curso" />
      </Form.Item>

      <Form.Item
        label="Código do Curso"
        name="courseCode"
        rules={[{ required: true, message: "Por favor, insira o código do curso!" }]}
        help={backendErrors.courseCode}
        validateStatus={backendErrors.courseCode ? "error" : ""}
      >
        <Input placeholder="Código único do curso" />
      </Form.Item>

      <Form.Item
        label="Tipo de Grau"
        name="degreeType"
        rules={[{ required: true, message: "Por favor, insira o tipo de grau!" }]}
        help={backendErrors.degreeType}
        validateStatus={backendErrors.degreeType ? "error" : ""}
      >
        <Select placeholder="Selecione o tipo de grau">
          <Select.Option value="BACHELOR">Bacharelado</Select.Option>
          <Select.Option value="LICENTIATE">Licenciatura</Select.Option>
        </Select>
      </Form.Item>

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="default"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Cadastrar
        </Button>
      </div>
    </Form>
  );
};

RegisterCourse.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  onCourseRegistered: PropTypes.func.isRequired,
};

export default RegisterCourse;