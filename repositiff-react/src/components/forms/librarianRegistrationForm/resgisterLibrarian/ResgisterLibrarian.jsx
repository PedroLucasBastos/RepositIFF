import React, { useState } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { green, red } from "@ant-design/colors";
import axios from "axios";
import PropTypes from "prop-types";

const RegisterLibrarian = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
  });

  //Função de validar email
  const validateEmail = (value) => {
    if (!value) {
      setEmailError(""); // Limpa o erro se o campo estiver vazio
      return;
    }

    // Regex para validar o formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("E-mail inválido!");
    } else {
      setEmailError(""); // Limpa o erro se o e-mail for válido
    }
  };

  // Estado para armazenar os erros do backend
  const [backendErrors, setBackendErrors] = useState({
    email: "",
    registrationNumber: "",
  });

  // Função para verificar os critérios da senha
  const checkPasswordStrength = (value) => {
    setPassword(value);

    let newCriteria = { ...criteria };
    let strength = 0;

    // Verificar se a senha tem 8 ou mais caracteres
    if (value.length >= 8) {
      newCriteria.length = true;
      strength += 40; // 40% do total de pontos
    } else {
      newCriteria.length = false;
    }

    // Verificar se a senha contém número
    if (/\d/.test(value)) {
      newCriteria.number = true;
      strength += 20; // 20% do total de pontos
    } else {
      newCriteria.number = false;
    }

    // Verificar se contém letra minúscula
    if (/[a-z]/.test(value)) {
      newCriteria.lowercase = true;
      strength += 15; // 15% do total de pontos
    } else {
      newCriteria.lowercase = false;
    }

    // Verificar se contém letra maiúscula
    if (/[A-Z]/.test(value)) {
      newCriteria.uppercase = true;
      strength += 15; // 15% do total de pontos
    } else {
      newCriteria.uppercase = false;
    }

    // Verificar se contém caractere especial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      newCriteria.specialChar = true;
      strength += 10; // 10% do total de pontos
    } else {
      newCriteria.specialChar = false;
    }

    setCriteria(newCriteria);
    setPasswordStrength(strength);
  };

  const onFinish = async (values) => {
    setLoading(true);
    setBackendErrors({ email: "", registrationNumber: "" }); // Limpa erros antigos antes de cada requisição

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

    try {
      await axios.post("http://localhost:3333/librarian/register", values);
      message.success("Bibliotecário cadastrado com sucesso!");
      form.resetFields(); // Limpa os campos do formulário
      handleCancel(); // Fecha o modal
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        const { statusCode } = error.response.data;
        console.log(statusCode);

        // Erro no e-mail
        if (message === "Email already in use") {
          setBackendErrors({
            email: "E-mail já cadastrado. Tente outro e-mail.",
            registrationNumber: "", // Garante que matrícula não receba erro neste caso
          });
          form.scrollToField("email", { behavior: "smooth", block: "center" });
        }

        // Erro na matrícula
        if (statusCode === 400) {
          setBackendErrors({
            email: "", // Garante que e-mail não receba erro neste caso
            registrationNumber:
              "Matrícula já cadastrada. Verifique e tente novamente.",
          });
          form.scrollToField("registrationNumber", {
            behavior: "smooth",
            block: "center",
          });
        }
      }
      message.error("Erro ao cadastrar bibliotecário. Tente novamente.");
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
        <Input placeholder="Nome completo" />
      </Form.Item>

      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: "Por favor, insira o e-mail!" },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value)
                ? Promise.resolve()
                : Promise.reject(new Error("E-mail inválido!"));
            },
          },
        ]}
        help={emailError || backendErrors.email} // Mostra erro local ou do backend
        validateStatus={emailError || backendErrors.email ? "error" : ""} // Aplica estilo de erro
      >
        <Input
          placeholder="exemplo@dominio.com"
          onChange={(e) => {
            const { value } = e.target;
            form.setFieldsValue({ email: value }); // Atualiza o valor no formulário
            validateEmail(value); // Valida o e-mail
          }}
        />
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
          backendErrors.registrationNumber && backendErrors.registrationNumber
        } // Exibe a mensagem de erro do backend para matrícula
        validateStatus={backendErrors.registrationNumber ? "error" : ""} // Aplica o estilo de erro para matrícula
      >
        <Input placeholder="Número de matrícula" />
      </Form.Item>

      <Form.Item
        label="Senha"
        name="password"
        rules={[
          { required: true, message: "Por favor, insira a senha!" },
          { min: 8, message: "A senha deve ter no mínimo 8 caracteres!" },
        ]}
      >
        <Input.Password
          placeholder="Senha"
          value={password}
          onChange={(e) => checkPasswordStrength(e.target.value)}
        />
      </Form.Item>

      {/* Barra de progresso com segurança */}
      {password && (
        <div className="mb-4">
          <Progress
            percent={passwordStrength}
            steps={5}
            size="small"
            strokeColor={passwordStrength === 100 ? green[6] : red[5]}
          />
        </div>
      )}

      {/* Lista de critérios */}
      <div className="text-sm">
        <ul>
          <li className={criteria.length ? "text-green-500" : "text-red-500"}>
            Pelo menos 8 caracteres
          </li>
          <li className={criteria.number ? "text-green-500" : "text-red-500"}>
            Pelo menos um número
          </li>
          <li
            className={criteria.lowercase ? "text-green-500" : "text-red-500"}
          >
            Pelo menos uma letra minúscula
          </li>
          <li
            className={criteria.uppercase ? "text-green-500" : "text-red-500"}
          >
            Pelo menos uma letra maiúscula
          </li>
          <li
            className={criteria.specialChar ? "text-green-500" : "text-red-500"}
          >
            Pelo menos um caractere especial
          </li>
        </ul>
      </div>

      <Form.Item
        label="Confirmação de Senha"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Por favor, confirme a senha!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("As senhas não coincidem!"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirme a senha" />
      </Form.Item>

      <div className="flex justify-between">
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setBackendErrors({ email: "", registrationNumber: "" });
            setPassword(""); // Limpa o valor da senha
            setCriteria({
              length: false,
              number: false,
              lowercase: false,
              uppercase: false,
              specialChar: false,
            }); // Reseta os critérios da senha
            setPasswordStrength(0); // Reseta a força da senha
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

export default RegisterLibrarian;
