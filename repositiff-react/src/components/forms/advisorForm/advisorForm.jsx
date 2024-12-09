import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const AdvisorForm = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [backendErrors, setBackendErrors] = useState({
    registrationNumber: "",
  });

  // Função para traduzir erros do back-end
  const translateBackendError = (error) => {
    if (error.details === "Advisor already exists on the platform") {
      return "Número de matrícula já cadastrada. Verifique e tente novamente.";
    }
    return "Erro ao cadastrar orientador. Tente novamente.";
  };

  // Função chamada ao enviar o formulário
  const onFinish = async (values) => {
    setLoading(true);
    setBackendErrors({ registrationNumber: "" }); // Limpar erros anteriores

    try {
      // Enviando os dados no formato correto
      const { name, surname, registrationNumber } = values;
      const payload = { name, surname, registrationNumber };

      await axios.post("http://localhost:3333/advisor/register", payload);
      message.success("Orientador cadastrado com sucesso!");
      form.resetFields(); // Limpar campos do formulário

      if (handleCancel) {
        handleCancel(); // Fechar modal após o cadastro com sucesso
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data?.Error; // Usando 'Error' com maiúscula
        const details = errorData?.details;

        if (details) {
          const backendMessage = translateBackendError(errorData);
          if (details === "Advisor already exists on the platform") {
            setBackendErrors({
              registrationNumber: backendMessage,
            });
            form.setFields([
              {
                name: "registrationNumber",
                errors: [backendMessage], // Definir a mensagem de erro no campo
              },
            ]);
            form.scrollToField("registrationNumber", {
              behavior: "smooth",
              block: "center",
            });
          } else {
            message.error(backendMessage);
          }
        } else {
          message.error("Erro inesperado no servidor. Verifique os logs.");
        }
      } else if (error.request) {
        message.error("Nenhuma resposta do servidor. Tente novamente.");
      } else {
        message.error(
          "Erro na configuração da requisição. Verifique o console."
        );
        console.error("Erro na configuração da requisição:", error.message);
      }
    } finally {
      setLoading(false); // Garantir que o botão não fique travado
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

// Definir valores padrão para props
AdvisorForm.defaultProps = {
  handleCancel: () => {}, // Função vazia caso não seja passada
};

AdvisorForm.propTypes = {
  handleCancel: PropTypes.func.isRequired,
};

export default AdvisorForm;
