import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

// Você pode usar os componentes de UI que já tem no projeto se preferir
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

const PasswordRecovery = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Efeito para pegar o token da URL assim que a página carregar
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error('Token de recuperação não encontrado. Por favor, solicite um novo link.');
      // Opcional: redirecionar para o login se não houver token
      // setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (!token) {
      toast.error('Token inválido ou ausente. Não é possível redefinir a senha.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3333/librarian/reset-password',
        {
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            // O backend espera o token no cabeçalho de autorização
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      const errorMessage = error.response?.data?.msg || 'Erro ao redefinir a senha. O link pode ter expirado.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster richColors position="top-right" />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Redefinir Senha</h1>
          <p className="mt-2 text-gray-600">Digite sua nova senha abaixo.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nova Senha
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-iffEscuro"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-iffEscuro"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 font-semibold rounded-md bg-botaoIFF text-white hover:bg-green-500"
            >
              Salvar Nova Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;