import React, { useState } from "react";
import { Dropdown, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import FormTCC from "../../components/formTCC/formTCC"; // Ajuste do import para maiúscula no nome do componente
import plusAnimation from "../../assets/lotties/plusAnimation.json";
import editAnimation from "../../assets/lotties/editAnimation.json";
import deleteAnimation from "../../assets/lotties/binAnimation.json";

const LibrarianDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null); // Hover state for each button
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      console.log("Logging out...");
    } else if (e.key === "editProfile") {
      console.log("Editing profile...");
    }
  };

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

      <div className="min-h-screen">
        <h1 className="text-3xl font-semibold text-center mt-8">
          Painel de Controle
        </h1>

        <div className="flex justify-center mt-8 gap-4">
          <button
            className="w-48 aspect-square bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("plus")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsModalOpen(true)} // Open modal
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "plus"}
              />
            </div>
            Registrar TCC
          </button>

          <button
            className="w-48 aspect-square bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("edit")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={editAnimation}
                loop={hoveredButton === "edit"}
              />
            </div>
            Editar TCC's
          </button>

          <button
            className="w-48 aspect-square bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("delete")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={deleteAnimation}
                loop={hoveredButton === "delete"}
              />
            </div>
            Apagar TCC
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Registrar novo TCC</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <FormTCC />
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;
