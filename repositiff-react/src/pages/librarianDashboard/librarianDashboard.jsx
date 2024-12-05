import React, { useState } from "react";
import { Dropdown, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie"; // Importar js-cookie
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import FormTCC from "../../components/formTCC/formTCC";
import plusAnimation from "../../assets/lotties/plusAnimation.json";
//import editAnimation from "../../assets/lotties/editAnimation.json";
//import addAnimation from "../../assets/lotties/addAnimation.json"; // Lottie para adicionar orientador
//import deleteAnimation from "../../assets/lotties/binAnimation.json";

import CardsLibrarian from "@/components/dashboardCharts/cardsLibrarian";
import TCCListTable from "@/components/tccListTable/tccListTable";

const LibrarianDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null); // Hover state for each button
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false); // Modal para registrar TCC
  const [isOrientadorModalOpen, setIsOrientadorModalOpen] = useState(false); // Modal para adicionar orientador

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-3xl font-semibold text-center mt-8">
          Painel de Controle
        </h1>
        {/* Container para botões */}
        <div className="flex justify-center gap-12 mt-8 px-12">
          {/* Botão de Registrar TCC */}
          <button
            className="flex-1 h-25 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("plus")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsTCCModalOpen(true)} // Abre modal para TCC
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "plus"}
              />
            </div>
            <p>Registrar TCC</p>
          </button>

          {/* Botão de Adicionar Orientador */}
          <button
            className="flex-1 h-25 bg-sky-500 hover:bg-blue-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center"
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setIsOrientadorModalOpen(true)} // Abre modal para Orientador
          >
            <div className="w-10 h-10">
              <Lottie
                animationData={plusAnimation}
                loop={hoveredButton === "add"}
              />
            </div>
            <p>Gerenciar Orientadores</p>
          </button>
        </div>

        {/* Cards e Tabela */}
        <div>
          <CardsLibrarian />
        </div>
        <div>
          <TCCListTable />
        </div>
      </div>

      {/* Modal Registrar TCC */}
      {isTCCModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Registrar novo TCC</h2>
              <button
                onClick={() => setIsTCCModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <FormTCC />
          </div>
        </div>
      )}

      {/* Modal Adicionar Orientador */}
      {isOrientadorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[50vw] max-h-[70vh] overflow-y-auto rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Adicionar Orientador</h2>
              <button
                onClick={() => setIsOrientadorModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* Formulário ou funcionalidade de adicionar orientador */}
            <p>Formulário para adicionar orientador vai aqui.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;
