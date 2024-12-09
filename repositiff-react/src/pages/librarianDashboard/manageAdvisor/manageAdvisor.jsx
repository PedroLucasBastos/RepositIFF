import Lottie from "lottie-react";
import React, { useState } from "react";
import AdvisorForm from "../../../components/forms/advisorForm/advisorForm";
import plusAnimation from "../../../assets/lotties/plusAnimation.json";
import CardsLibrarian from "@/components/dashboardCharts/cardsLibrarian";
import TCCListTable from "@/components/tables/tccListtable/tccListTable";
import AdvisorListTable from "@/components/tables/advisorListTable/advisorListtable";

const ManageAdvisor = () => {
  const [hoveredButton, setHoveredButton] = useState(null); // Hover state for each button
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false); // Modal para registrar TCC

  return (
    <div>
      <div className="min-h-screen">
        <h1 className="text-3xl font-semibold text-center mt-8">
          Gerenciar Orientadores
        </h1>
        {/* Container para botões */}
        <div className="flex justify-center gap-12 mt-8 px-12">
          {/* Botão de Registrar Orientador */}
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
            <p>Cadastrar Orientador</p>
          </button>
        </div>

        {/* Modal Registrar TCC */}
        {isTCCModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[80vw] max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  Registrar novo orientador
                </h2>
                <button
                  onClick={() => setIsTCCModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <AdvisorForm />
            </div>
          </div>
        )}
        <div>
          <AdvisorListTable />
        </div>
      </div>
    </div>
  );
};

export default ManageAdvisor;
