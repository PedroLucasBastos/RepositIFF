import React, { useState } from "react";
import { Dropdown, Menu, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie"; // Importar js-cookie
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import FormTCC from "../../components/formTCC/formTCC";
import plusAnimation from "../../assets/lotties/plusAnimation.json";
import editAnimation from "../../assets/lotties/editAnimation.json";
import deleteAnimation from "../../assets/lotties/binAnimation.json";

import CardsLibrarian from "@/components/dashboardCharts/cardsLibrarian";
import TCCListTable from "@/components/tccListTable/tccListTable";

const LibrarianDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null); // Hover state for each button
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-3xl font-semibold text-center mt-8">
          Painel de Controle
        </h1>
        <div>
          <button
            className="w-full h-25 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-md flex flex-col justify-center items-center mt-5 "
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
            <p>Registrar TCC</p>
          </button>
        </div>
        <div>
          <CardsLibrarian />
        </div>
        <div>
          <TCCListTable />
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
