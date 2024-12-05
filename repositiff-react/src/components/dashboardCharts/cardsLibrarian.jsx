import React from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Dados simulados
const yearlyData = [
  { year: "2021", EngComp: 30, CTA: 20 },
  { year: "2022", EngComp: 40, CTA: 35 },
  { year: "2023", EngComp: 50, CTA: 25 },
  { year: "2024", EngComp: 60, CTA: 30 },
];

const CardsLibrarian = () => {
  // Dados para total de TCCs cadastrados neste ano (fictício)
  const currentYearTCCs = 90;

  // Dados para total de TCCs cadastrados no sistema (fictício)
  const totalTCCs = 450;

  return (
    <div className="flex justify-between mx-12 gap-12 mt-10">
      {/* Card 1: Gráfico de barras duplas */}
      <Card
        className="flex-1 bg-gray-100 border-2 border-gray-400 rounded-lg"
        title={
          <div className="border-b border-gray-400 pb-2">
            TCCs Cadastrados por Ano e Curso
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={yearlyData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="EngComp"
              fill="#32CD32"
              name="Engenharia da Computação"
            />
            <Bar
              dataKey="CTA"
              fill="#FFD700"
              name="Ciência e Tecnologia dos Alimentos"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Card 2: Total de TCCs cadastrados neste ano */}
      <Card
        className="flex-1 bg-sky-100 border-2 border-sky-300 rounded-lg text-center flex flex-col justify-center items-center"
        title={
          <div className="border-b border-sky-300 pb-2 text-xl font-semibold">
            TCCs Cadastrados em 2024
          </div>
        }
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-6xl font-extrabold text-green-500">
            {currentYearTCCs}
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Total de TCCs cadastrados neste ano
          </p>
        </div>
      </Card>

      {/* Card 3: Total de TCCs cadastrados no sistema */}
      <Card
        className="flex-1 bg-green-100 border-2 border-green-300 rounded-lg text-center flex flex-col justify-center items-center"
        title={
          <div className="border-b border-green-300 pb-2 text-xl font-semibold">
            TCCs Cadastrados no Sistema
          </div>
        }
      >
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-6xl font-extrabold text-blue-500">{totalTCCs}</p>
          <p className="text-lg text-gray-600 mt-4">Total de TCCs no sistema</p>
        </div>
      </Card>
    </div>
  );
};

export default CardsLibrarian;
