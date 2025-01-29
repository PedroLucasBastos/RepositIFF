import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const RegisterCourse = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Estado para armazenar os erros do backend
  const [backendErrors, setBackendErrors] = useState({
    name: "",
    courseCode: "",
    degreeType: "",
  });

  const onFinish = async (values) => {
    setLoading(true);
    setBackendErrors({ name: "", courseCode: "", degreeType: "" }); // Limpa erros antigos antes de cada requisição

    const emptyFields = Object.entries(values).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      message.error("Por favor, preencha todos os campos.");
      const firstEmptyField = emptyFields[0][0];
      form.scrollToField(firstEmptyField, {
        behavior: "smooth",
        block: "center",
      });
      setLoading(false);
      return;
    }
    console.log("Dados que serão enviados:", values); // Exibe os dados no console

    try {
      await axios.post("http://localhost:3333/course/register", values);
      message.success("Curso cadastrado com sucesso!");
      form.resetFields(); // Limpa os campos do formulário
      handleCancel(); // Fecha o modal
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        const { statusCode } = error.response.data;

        // Erro no nome do curso
        if (message === "Course name already in use") {
          setBackendErrors({
            name: "Nome do curso já cadastrado. Tente outro nome.",
            courseCode: "", // Garante que código do curso não receba erro neste caso
            degreeType: "", // Garante que tipo de grau não receba erro neste caso
          });
          form.scrollToField("name", { behavior: "smooth", block: "center" });
        }

        // Erro no código do curso
        if (statusCode === 400) {
          setBackendErrors({
            name: "", // Garante que nome do curso não receba erro neste caso
            courseCode:
              "Código do curso já cadastrado. Verifique e tente novamente.",
            degreeType: "", // Garante que tipo de grau não receba erro neste caso
          });
          form.scrollToField("courseCode", {
            behavior: "smooth",
            block: "center",
          });
        }
      }
      message.error("Erro ao cadastrar o curso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      className="space-y-4"
    >
      <Form.Item
        label="Nome do Curso"
        name="name"
        rules={[
          { required: true, message: "Por favor, insira o nome do curso!" },
        ]}
        help={backendErrors.name}
        validateStatus={backendErrors.name ? "error" : ""}
      >
        <Input placeholder="Nome completo do curso" />
      </Form.Item>

      <Form.Item
        label="Código do Curso"
        name="courseCode"
        rules={[
          { required: true, message: "Por favor, insira o código do curso!" },
        ]}
        help={backendErrors.courseCode}
        validateStatus={backendErrors.courseCode ? "error" : ""}
      >
        <Input placeholder="Código único do curso" />
      </Form.Item>

      <Form.Item
        label="Tipo de Grau"
        name="degreeType"
        rules={[
          { required: true, message: "Por favor, insira o tipo de grau!" },
        ]}
        help={backendErrors.degreeType}
        validateStatus={backendErrors.degreeType ? "error" : ""}
      >
        <Select placeholder="Selecione o tipo de grau">
          <Select.Option value="BACHELOR">Bacharelado</Select.Option>
          <Select.Option value="LICENTIATE">Licenciatura</Select.Option>
        </Select>
      </Form.Item>

      <div className="flex justify-between">
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setBackendErrors({ name: "", courseCode: "", degreeType: "" });
            handleCancel();
          }}
          className="bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Cadastrar
        </Button>
      </div>
    </Form>
  );
};

RegisterCourse.propTypes = {
  handleCancel: PropTypes.func.isRequired,
};

export default RegisterCourse;
