import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const CardsAdmin = ({ librarians, courses, academicWorks }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log("AcademicWorks recebidos no CardsAdmin:", academicWorks);
    // agrupa TCCs por ano
    const grouping = {};
    academicWorks.forEach((work) => {
      const year = work.year || new Date().getFullYear();
      grouping[year] = (grouping[year] || 0) + 1;
    });

    const sortedYears = Object.keys(grouping).sort();
    const chartArr = sortedYears.map((y) => ({
      year: y,
      count: grouping[y],
    }));

    setChartData(chartArr);
  }, [academicWorks]);

  return (
    <div className="flex justify-between mx-12 gap-12 mt-10">
      {/* Trabalhos Acadêmicos por ano */}
      <Card
        className="flex-1 bg-gray-100 border rounded-lg"
        title={<div className="border-b pb-2">TCC's por Ano</div>}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="TCCs" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Total Bibliotecários */}
      <Card
        className="flex-1 bg-sky-100 border-sky-300 border rounded-lg text-center flex flex-col items-center justify-center"
        title={
          <div className="border-b pb-2 text-xl font-semibold">
            Total de Bibliotecários
          </div>
        }
      >
        <p className="text-6xl font-extrabold text-green-500">
          {librarians.length}
        </p>
        <p className="mt-2">Cadastrados no sistema</p>
      </Card>

      {/* Total Cursos */}
      <Card
        className="flex-1 bg-green-100 border-green-300 border rounded-lg text-center flex flex-col items-center justify-center"
        title={
          <div className="border-b pb-2 text-xl font-semibold">
            Cursos no Sistema
          </div>
        }
      >
        <p className="text-6xl font-extrabold text-blue-500">
          {courses.length}
        </p>
        <p className="mt-2">Total cadastrados</p>
      </Card>
    </div>
  );
};

CardsAdmin.propTypes = {
  librarians: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  academicWorks: PropTypes.array.isRequired,
};

export default CardsAdmin;
