import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

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
      // **IMPORTANTE**: Verifique se esta é a sua URL de cadastro correta
      await axios.post("http://localhost:3333/course/register", values);
      message.success("Curso cadastrado com sucesso!");

      // AQUI A MÁGICA ACONTECE!
      // Avisa o componente pai que um novo curso foi registrado
      onCourseRegistered();

      form.resetFields();
      handleCancel(); // Fecha o modal
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const { message, statusCode } = error.response.data;

        if (message === "Course name already in use") {
          setBackendErrors({ name: "Nome do curso já cadastrado.", courseCode: "", degreeType: "" });
          form.scrollToField("name");
        } else if (statusCode === 400) {
          setBackendErrors({ name: "", courseCode: "Código do curso já cadastrado.", degreeType: "" });
          form.scrollToField("courseCode");
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
  onCourseRegistered: PropTypes.func.isRequired, // Adiciona a nova prop
};

export default RegisterCourse;