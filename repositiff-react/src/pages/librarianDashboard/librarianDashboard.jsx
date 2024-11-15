import React, { useState } from "react";
import { Dropdown, Menu, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const LibrarianDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Controlo de login

  // Função para abrir o menu do Avatar
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      // Lógica de logout
      console.log("Logging out...");
      setIsLoggedIn(false); // Exemplo de lógica para simular o logout
    } else if (e.key === "editProfile") {
      // Lógica para editar perfil
      console.log("Editing profile...");
    }
  };

  // Menu de opções para o Avatar
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="editProfile"
        icon={<UserOutlined />}
        className="flex items-center"
      >
        Edit Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        className="flex items-center"
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="absolute top-7 right-4">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar size={40} icon={<UserOutlined />} />
        </Dropdown>
      </div>
      <div className="min-h-screen  relative">
        {/* Avatar no canto superior direito */}

        {/* Título da página */}
        <h1 className="text-3xl font-semibold text-center mt-8">
          Painel de controle
        </h1>

        {/* Botões Centralizados */}
        <div className="flex justify-center items-center mt-8 space-x-6">
          <Button className="w-36 h-14 text-white bg-blue-500 hover:bg-blue-600">
            Cadastrar novo TCC
          </Button>
          <Button className="w-36 h-14 text-white bg-green-500 hover:bg-green-600">
            Editar TCC
          </Button>
          <Button className="w-36 h-14 text-white bg-red-500 hover:bg-red-600">
            Deletar TCC
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
