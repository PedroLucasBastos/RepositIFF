import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const AdvisorForm = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [backendErrors, setBackendErrors] = useState({
    registrationNumber: "",
  });

  // Função para traduzir erros do back-end
  const translateBackendError = (errorDetails) => {
    if (errorDetails === "Advisor already exists on the platform") {
      return "Número de matrícula já cadastrada. Verifique e tente novamente.";
    }
    return "Erro ao cadastrar orientador. Tente novamente.";
  };

  // Função chamada ao enviar o formulário
  const onFinish = async (values) => {
    setLoading(true);
    setBackendErrors({ registrationNumber: "" });

    try {
      // 1. Pega o token do cookie
      const token = Cookies.get("authToken");

      if (!token) {
        message.error("Sessão expirada. Faça login novamente.");
        setLoading(false);
        return;
      }

      // 2. Constrói o corpo da requisição com os valores do formulário
      const { name, surname, registrationNumber } = values;
      const payload = { name, surname, registrationNumber };

      // 3. Usa a API fetch com o método POST e o token no cabeçalho
      const response = await fetch("http://localhost:3333/advisor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // 4. Trata a resposta
      if (!response.ok) {
        const errorData = await response.json();
        const errorDetails = errorData.Error?.details;
        const errorMessage = translateBackendError(errorDetails);

        if (errorDetails === "Advisor already exists on the platform") {
          setBackendErrors({ registrationNumber: errorMessage });
          form.setFields([
            { name: "registrationNumber", errors: [errorMessage] },
          ]);
          form.scrollToField("registrationNumber", {
            behavior: "smooth",
            block: "center",
          });
        } else {
          message.error(errorMessage);
        }
        throw new Error("Erro na resposta da API");
      }

      message.success("Orientador cadastrado com sucesso!");
      form.resetFields();

      if (handleCancel) {
        handleCancel();
      }
    } catch (error) {
      console.error(error);
      if (error.message !== "Erro na resposta da API") {
        message.error("Erro ao conectar com o servidor. Tente novamente.");
      }
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
        label="Nome"
        name="name"
        rules={[{ required: true, message: "Por favor, insira o nome!" }]}
      >
        <Input placeholder="Nome" />
      </Form.Item>

      <Form.Item
        label="Sobrenome"
        name="surname"
        rules={[{ required: true, message: "Por favor, insira o sobrenome!" }]}
      >
        <Input placeholder="Sobrenome" />
      </Form.Item>

      <Form.Item
        label="Matrícula"
        name="registrationNumber"
        rules={[
          {
            required: true,
            message: "Por favor, insira o número de matrícula!",
          },
        ]}
        help={
          backendErrors.registrationNumber && (
            <span style={{ color: "red" }}>
              {backendErrors.registrationNumber}
            </span>
          )
        }
        validateStatus={backendErrors.registrationNumber ? "error" : ""}
      >
        <Input placeholder="Número de matrícula" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full"
        >
          Cadastrar Orientador
        </Button>
      </Form.Item>
    </Form>
  );
};

AdvisorForm.defaultProps = {
  handleCancel: () => {},
};

AdvisorForm.propTypes = {
  handleCancel: PropTypes.func.isRequired,
};

export default AdvisorForm;