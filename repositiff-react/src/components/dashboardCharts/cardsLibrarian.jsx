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
      <Card className="flex-1" title="TCCs Cadastrados por Ano e Curso">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={yearlyData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
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
      <Card className="flex-1 text-center" title="TCCs Cadastrados em 2024">
        <p className="text-4xl font-bold text-green-500 flex justify-center ">
          {currentYearTCCs}
        </p>
        <p>Total de TCCs cadastrados neste ano</p>
      </Card>

      {/* Card 3: Total de TCCs cadastrados no sistema */}
      <Card className="flex-1 text-center" title="TCCs Cadastrados no Sistema">
        <p className="text-4xl font-bold text-blue-500">{totalTCCs}</p>
        <p>Total de TCCs no sistema</p>
      </Card>
    </div>
  );
};

export default CardsLibrarian;
