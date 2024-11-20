import React, { useState } from "react";
import Lottie from "lottie-react";
import Cookies from "js-cookie"; // Importar js-cookie
import axios from "axios"; // Importar axios
import animationData from "../../assets/lotties/animacaoLogin.json";
import { Alert } from "antd";
import { useNavigate } from "react-router-dom";

function Login() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const registrationNumber = e.target.registrationNumber.value;
    const password = e.target.password.value;

    setMessage("");
    setErrorMessage("");

    if (!registrationNumber || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Payload da requisição
      const payload = { registrationNumber, password };

      // Chamada à API usando Axios
      const response = await axios.post(
        "http://localhost:3333/librarian/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      if (token) {
        // Salvar o token nos cookies com expiração de 12 horas
        Cookies.set("authToken", token, { expires: 0.5, path: "/" });
        // Token expira em 12 horas
        setMessage("Login bem-sucedido!");
        navigate("/bibliotecario");
      } else {
        setErrorMessage("Erro ao processar a resposta do servidor.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Verificar se o erro tem uma mensagem vinda do servidor
      if (error.response && error.response.data.msg) {
        setErrorMessage(error.response.data.msg); // Exibe a mensagem de erro do servidor
      } else {
        setErrorMessage("Erro ao conectar-se ao servidor.");
      }
    }
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Coluna esquerda com animação */}
      <div className="lg:w-1/2 w-full bg-transparent flex items-center justify-center relative">
        <Lottie
          animationData={animationData}
          className="lg:w-3/4 w-1/2 h-auto object-contain"
        />
        <div className="absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:h-[400px] lg:w-1 lg:bg-gradient-to-b lg:from-iffClaro lg:to-iffEscuro lg:block hidden"></div>
      </div>

      {/* Coluna direita - Formulário de login */}
      <div className="lg:w-1/2 w-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col max-w-lg w-full p-10 mx-auto rounded-lg shadow-lg bg-iffClaro/50 ">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
              Login
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Iniciar sessão para acessar sua conta
            </p>
          </div>

          {message && (
            <Alert message={message} type="success" showIcon className="mb-4" />
          )}

          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <form
            onSubmit={handleFormSubmit}
            noValidate
            className="space-y-8 w-full"
          >
            <div className="space-y-8">
              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Matrícula
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                  placeholder="Digite sua matrícula"
                  className="w-full px-4 py-3 border rounded-md text-gray-700 dark:text-gray-800 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-iffEscuro"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    className="text-xs text-iffEscuro hover:underline dark:text-iffClaro"
                  >
                    Esqueceu a Senha?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border rounded-md text-gray-700 dark:text-gray-800 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-iffEscuro"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 font-semibold rounded-md bg-botaoIFF text-white hover:bg-green-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="lg:hidden w-full h-1 bg-gradient-to-r from-iffClaro to-iffEscuro"></div>
    </div>
  );
}

export default Login;
