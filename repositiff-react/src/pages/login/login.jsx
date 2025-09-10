// Em: src/pages/login/login.jsx

import React, { useState } from "react";
import Lottie from "lottie-react";
import Cookies from "js-cookie";
import axios from "axios";
import animationData from "../../assets/lotties/animacaoLogin.json";
import { Alert, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// Importações para o Modal e Notificações
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


function Login() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userType, setUserType] = useState("librarian");

  // ALTERADO: Estados para o modal de recuperação de senha (agora para ID)
  const [resetId, setResetId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserTypeChange = (checked) => {
    setUserType(checked ? "admin" : "librarian");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // ... (sua função de login continua a mesma)
    const registrationNumber = e.target.registrationNumber.value;
    const password = e.target.password.value;
    setMessage("");
    setErrorMessage("");
    if (!registrationNumber || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }
    const apiUrl = userType === "admin" ? "http://localhost:3333/user/login" : "http://localhost:3333/user/login";
    const redirectPath = userType === "admin" ? "/admin" : "/bibliotecario";
    try {
      const payload = { registrationNumber, password };
      const response = await axios.post(apiUrl, payload, { headers: { "Content-Type": "application/json" } });
      const { token } = response.data;
      if (token) {
        Cookies.set("authToken", token, { expires: 0.5, path: "/" });
        setMessage("Login bem-sucedido!");
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

  // ALTERADO: Função para enviar o pedido de recuperação de senha com MATRÍCULA
  const handlePasswordResetRequest = async () => {
    if (!resetId) {
      toast.error("Por favor, insira sua matrícula.");
      return;
    }
    try {
      // Envia a matrícula no corpo da requisição com o nome de campo correto
      await axios.post("http://localhost:3333/user/reset-password-request", {
        registrationNumber: resetId,
      });
      toast.success("Se a matrícula estiver correta, você receberá um link para redefinir sua senha no seu e-mail cadastrado.");
      setIsModalOpen(false); // Fecha o modal
      setResetId(""); // Limpa o campo
    } catch (error) {
      toast.error("Ocorreu um erro ao processar a solicitação.");
      console.error("Erro na solicitação de redefinição de senha:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Toaster richColors position="top-right" />
      
      <div className="lg:w-1/2 w-full bg-transparent flex items-center justify-center relative">
        <Lottie animationData={animationData} className="lg:w-3/4 w-1/2 h-auto object-contain" />
        <div className="absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:h-[400px] lg:w-1 lg:bg-gradient-to-b lg:from-iffClaro lg:to-iffEscuro lg:block hidden"></div>
      </div>

      <div className="lg:w-1/2 w-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col max-w-lg w-full p-10 mx-auto rounded-lg shadow-lg bg-iffClaro/50 ">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">Login</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Iniciar sessão para acessar sua conta</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative flex w-full max-w-[320px] p-1 bg-from-iffClaro rounded-full">
                  {/* Fundo deslizante da chave */}
                  <span
                    aria-hidden="true"
                    className={`absolute pointer-events-none top-1 h-8 w-1/2 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out
                               ${userType === 'admin' ? 'translate-x-full' : 'translate-x-0'}`}
                  ></span>

                  {/* Botão Bibliotecário */}
                  <button
                    type="button"
                    onClick={() => setUserType('librarian')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-iffEscuro focus-visible:ring-offset-2 ${
                      userType === 'librarian' ? 'text-iffEscuro' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span className={`font-medium ${userType === 'librarian' ? 'text-iffEscuro' : 'text-gray-500'}`}>Bibliotecário 📚</span>
                  </button>

                  {/* Botão Administrador */}
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-iffEscuro focus-visible:ring-offset-2 ${
                      userType === 'admin' ? 'text-iffEscuro' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span className={`font-medium ${userType === 'admin' ? 'text-iffEscuro' : 'text-gray-500'}`}>Administrador 👨‍💼</span>
                  </button>
                </div>
              </div>
          

          {message && <Alert message={message} type="success" showIcon className="mb-4" />}
          {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

          <form onSubmit={handleFormSubmit} noValidate className="space-y-8 w-full">
            <div className="space-y-8">
              <div>
                <label htmlFor="registrationNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Matrícula</label>
                <input type="text" name="registrationNumber" id="registrationNumber" placeholder="Digite sua matrícula" className="w-full px-4 py-3 border rounded-md text-gray-700 dark:text-gray-800 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-iffEscuro" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                  
                  {/* Modal de recuperação de senha */}
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-xs text-iffEscuro hover:underline dark:text-iffClaro">
                        Esqueceu a Senha?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Recuperar Senha</DialogTitle>
                        {/* ALTERADO: Descrição do modal */}
                        <DialogDescription>
                          Digite sua matricula para receber um link de recuperação no seu e-mail.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                           {/* ALTERADO: Label e Input para MATRÍCULA */}
                          <label htmlFor="id-reset" className="text-right">Matrícula</label>
                          <Input
                            id="id-reset"
                            type="text"
                            value={resetId}
                            onChange={(e) => setResetId(e.target.value)}
                            className="col-span-3"
                            placeholder="Digite sua matrícula"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handlePasswordResetRequest} className="bg-botaoIFF text-white hover:bg-green-500">
                          Enviar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
                <div className="relative">
                  <input type={passwordVisible ? "text" : "password"} name="password" id="password" placeholder="Digite sua senha" className="w-full px-4 py-3 pr-10 border rounded-md text-gray-700 dark:text-gray-800 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-iffEscuro" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button type="submit" className="w-full py-3 px-6 font-semibold rounded-md bg-botaoIFF text-white hover:bg-green-500">Entrar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="lg:hidden w-full h-1 bg-gradient-to-r from-iffClaro to-iffEscuro"></div>
    </div>
  );
}

export default Login;