// src/components/dashboardCharts/CardsAdmin.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const CardsAdmin = ({ data }) => {
  const [totalLibs, setTotalLibs] = useState(0);
  const [currentYearLibs, setCurrentYearLibs] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // total no sistema
    setTotalLibs(data.length);

    // admitidos neste ano
    const year = new Date().getFullYear();
    const admittedThisYear = data.filter(item =>
      new Date(item.admissionDate).getFullYear() === year
    ).length;
    setCurrentYearLibs(admittedThisYear);

    // agrupamento por ano
    const grouping = {};
    data.forEach(item => {
      const admYear = new Date(item.admissionDate).getFullYear();
      grouping[admYear] = (grouping[admYear] || 0) + 1;
    });
    const sortedYears = Object.keys(grouping).sort();
    const chartArr = sortedYears.map(y => ({ year: y, count: grouping[y] }));
    setChartData(chartArr);
  }, [data]);

  return (
    <div className="flex justify-between mx-12 gap-12 mt-10">
      {/* gráfico por ano */}
      <Card
        className="flex-1 bg-gray-100 border rounded-lg"
        title={<div className="border-b pb-2">TCC's por curso</div>}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Cursos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* admitidos no ano */}
      <Card
        className="flex-1 bg-sky-100 border-sky-300 border rounded-lg text-center flex flex-col items-center justify-center"
        title={<div className="border-b pb-2 text-xl font-semibold">Total de bibliotecários</div>}
      >
        <p className="text-6xl font-extrabold text-green-500">{currentYearLibs}</p>
        <p className="mt-2">Total de bibliotecários cadastrados</p>
      </Card>

      {/* total bibliotecários */}
      <Card
        className="flex-1 bg-green-100 border-green-300 border rounded-lg text-center flex flex-col items-center justify-center"
        title={<div className="border-b pb-2 text-xl font-semibold">Cusos no Sistema</div>}
      >
        <p className="text-6xl font-extrabold text-blue-500">{totalLibs}</p>
        <p className="mt-2">Total de curso cadastrados</p>
      </Card>
    </div>
  );
};

CardsAdmin.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CardsAdmin;
