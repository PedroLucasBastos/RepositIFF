import { useState, useEffect } from "react"; // Importa useState e useEffect
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

// O componente agora recebe tccsData como prop
const CardsLibrarian = ({ tccsData }) => {
  const [currentYearTCCs, setCurrentYearTCCs] = useState(0);
  const [totalTCCs, setTotalTCCs] = useState(0);
  const [yearlyChartData, setYearlyChartData] = useState([]); // Dados reais para o gráfico de barras
  const [chartCourses, setChartCourses] = useState([]); // Nomes dos cursos dinâmicos para a legenda

  useEffect(() => {
    if (tccsData && tccsData.length > 0) {
      // 1. Calcular Total de TCCs no Sistema
      setTotalTCCs(tccsData.length);

      // 2. Calcular Total de TCCs do Ano Atual
      const currentYear = new Date().getFullYear(); // Pega o ano atual
      const tccsThisYear = tccsData.filter(
        (tcc) => tcc.year === currentYear
      ).length;
      setCurrentYearTCCs(tccsThisYear);

      // 3. Preparar Dados para o Gráfico de Barras
      const aggregatedData = {}; // Para agregar por ano e curso
      const uniqueCourses = new Set(); // Para coletar todos os nomes de cursos únicos

      tccsData.forEach((tcc) => {
        const year = tcc.year;
        const courseName = tcc.course?.name || "Desconhecido"; // Pega o nome do curso

        if (!aggregatedData[year]) {
          aggregatedData[year] = { year: year.toString() }; // Inicializa o objeto do ano
        }

        // Incrementa a contagem para o curso naquele ano
        aggregatedData[year][courseName] =
          (aggregatedData[year][courseName] || 0) + 1;
        
        uniqueCourses.add(courseName); // Adiciona o nome do curso ao conjunto
      });

      // Converte o objeto agregado para um array de dados para o Recharts
      const sortedYears = Object.keys(aggregatedData).sort(); // Garante a ordem dos anos
      const finalChartData = sortedYears.map(year => aggregatedData[year]);
      
      setYearlyChartData(finalChartData);
      setChartCourses(Array.from(uniqueCourses)); // Converte o Set de cursos para um Array
    } else {
      // Reseta os estados se não houver dados
      setTotalTCCs(0);
      setCurrentYearTCCs(0);
      setYearlyChartData([]);
      setChartCourses([]);
    }
  }, [tccsData]); // Re-executa sempre que tccsData mudar

  // Cores dinâmicas para os cursos no gráfico (pode ser ajustado)
  const colors = [
    "#8884d8", // Roxo
    "#82ca9d", // Verde
    "#ffc658", // Amarelo
    "#ff7300", // Laranja
    "#00C49F", // Verde Água
    "#FFBB28", // Dourado
    "#0088FE", // Azul
    "#FF8042", // Salmão
    // Adicione mais cores conforme necessário
  ];

  return (
    <div className="flex justify-between mx-12 gap-12 mt-10">
      {/* Card 1: Gráfico de barras duplas (agora com dados reais) */}
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
            data={yearlyChartData} // Dados reais
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} /> {/* Garante que o eixo Y mostre apenas números inteiros */}
            <Tooltip />
            <Legend />
            {/* Renderiza as Barras dinamicamente para cada curso único */}
            {chartCourses.map((courseName, index) => (
              <Bar
                key={courseName} // Chave única para cada barra
                dataKey={courseName}
                fill={colors[index % colors.length]} // Atribui cores da lista
                name={courseName} // Nome do curso para a legenda
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Card 2: Total de TCCs cadastrados neste ano (agora real) */}
      <Card
        className="flex-1 bg-sky-100 border-2 border-sky-300 rounded-lg text-center flex flex-col justify-center items-center"
        title={
          <div className="border-b border-sky-300 pb-2 text-xl font-semibold">
            TCCs Cadastrados em {new Date().getFullYear()} {/* Ano atual dinâmico */}
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

      {/* Card 3: Total de TCCs cadastrados no sistema (agora real) */}
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

import PropTypes from "prop-types";

CardsLibrarian.propTypes = {
  tccsData: PropTypes.array.isRequired,
};

export default CardsLibrarian;