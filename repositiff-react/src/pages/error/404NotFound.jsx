import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lotties/404NotFoundAnimation02.json"; // Importe a animação Lottie

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent">
      {/* Texto da página */}
      <h1 className="text-6xl font-bold text-gray-800 mb-8">
        Página não encontrada!
      </h1>

      {/* Animação Lottie */}
      <div className="w-3/4 max-w-lg">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  );
};

export default NotFound;
