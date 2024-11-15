import React, { useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lotties/animacaoLogin.json";
import { Alert } from "antd";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate

function Login() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagem de erro
  const navigate = useNavigate(); // Crie a instância do useNavigate

  // Função de simulação para o envio do formulário
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const matricula = e.target.matricula.value;
    const password = e.target.password.value;

    setMessage(""); // Limpa a mensagem de sucesso anterior
    setErrorMessage(""); // Limpa a mensagem de erro anterior

    // Verificação se os campos estão preenchidos
    if (!matricula || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return; // Não permite continuar se algum campo estiver vazio
    }

    // Simulação de resposta do backend
    setTimeout(() => {
      if (matricula === "1234" && password === "senha") {
        console.log(matricula, password);
        setMessage("Login bem-sucedido!");
        navigate("/administrador"); // Redireciona para a página do administrador
      } else {
        setErrorMessage("Credenciais inválidas!");
      }
    }, 1000); // Simula um atraso de 1 segundo
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Coluna esquerda com animação */}
      <div className="lg:w-1/2 w-full bg-transparent flex items-center justify-center relative">
        <Lottie
          animationData={animationData}
          className="lg:w-3/4 w-1/2 h-auto object-contain"
        />
        {/* Linha de separação verde com gradiente, visível em telas grandes */}
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

          {/* Exibe a mensagem de sucesso */}
          {message && (
            <Alert message={message} type="success" showIcon className="mb-4" />
          )}

          {/* Exibe a mensagem de erro */}
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Formulário de login */}
          <form
            onSubmit={handleFormSubmit}
            noValidate
            className="space-y-8 w-full"
          >
            <div className="space-y-8">
              <div>
                <label
                  htmlFor="matricula"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Matrícula
                </label>
                <input
                  type="text"
                  name="matricula"
                  id="matricula"
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

      {/* Linha de separação verde com gradiente em telas menores */}
      <div className="lg:hidden w-full h-1 bg-gradient-to-r from-iffClaro to-iffEscuro"></div>
    </div>
  );
}

export default Login;
