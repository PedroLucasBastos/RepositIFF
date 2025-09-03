import React, { useState } from "react";
import Lottie from "lottie-react";
import Cookies from "js-cookie";
import axios from "axios";
import animationData from "../../assets/lotties/animacaoLogin.json";
// ALTERADO: Adicionado Switch
import { Alert, Switch } from "antd"; 
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

function Login() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [userType, setUserType] = useState("librarian");

  // NOVO: Função para lidar com a mudança do Switch
  const handleUserTypeChange = (checked) => {
    // Se 'checked' for true, o usuário é admin, senão é bibliotecário
    setUserType(checked ? "admin" : "librarian");
  };

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

    // ALTERADO: URLs dinâmicas baseadas no userType
    const apiUrl =
      userType === "admin"
        ? "http://localhost:3333/librarian/login"
        : "http://localhost:3333/librarian/login";

    const redirectPath = userType === "admin" ? "/admin" : "/bibliotecario";

    try {
      const payload = { registrationNumber, password };
      
      // ALTERADO: Usa a apiUrl dinâmica
      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { token } = response.data;

      if (token) {
        Cookies.set("authToken", token, { expires: 0.5, path: "/" });
        setMessage("Login bem-sucedido!");
        
        // ALTERADO: Usa o redirectPath dinâmico
        navigate(redirectPath);
      } else {
        setErrorMessage("Erro ao processar a resposta do servidor.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response && error.response.data.msg) {
        setErrorMessage(error.response.data.msg);
      } else {
        setErrorMessage("Erro ao conectar-se ao servidor.");
      }
    }
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* ... (Coluna da animação - sem alterações) ... */}
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

          {/* NOVO: Componente Switch para selecionar o tipo de usuário */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className={`font-medium ${userType === 'librarian' ? 'text-iffEscuro' : 'text-gray-500'}`}>
              Bibliotecário 📚
            </span>
            <Switch onChange={handleUserTypeChange} />
            <span className={`font-medium ${userType === 'admin' ? 'text-iffEscuro' : 'text-gray-500'}`}>
              Administrador 👨‍💼
            </span>
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

          {/* ... (Restante do formulário - sem alterações) ... */}
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
                <div className="relative">
                <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 pr-10 border rounded-md text-gray-700 dark:text-gray-800 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-iffEscuro"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 font-semibold rounded-md bg-botaoIFF text-white hover:bg-green-500"
              >
                Entrar
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