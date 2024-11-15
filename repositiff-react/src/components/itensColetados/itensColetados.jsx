import "./itensColetados.css";

function ItensColetados() {
  return (
    <div className="itens-container mt-20">
      <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] mx-auto text-center text-gray-500">
        Itens Coletados
      </p>
      <div className="overflow-x-auto mt-20 px-4">
        {" "}
        {/* Adicione padding lateral aqui */}
        <div className="flex space-x-[100px] justify-center min-w-max">
          {" "}
          {/* Adicione `min-w-max` */}
          <div className="flex flex-col items-center">
            <button className="bg-iffClaro hover:bg-green-500 text-white font-bold w-[149px] h-[149px] rounded-full flex items-center justify-center">
              <img
                src="/images/livros.svg"
                title="livros"
                className="max-w-[100px]"
              />
            </button>
            <span className="mt-2 text-center text-gray-700">
              <p>Trabalhos de Conclusão de Curso</p>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-iffClaro hover:bg-green-500 text-white font-bold w-[149px] h-[149px] rounded-full flex items-center justify-center">
              <img
                src="/images/logoEngenhariaComputacao.svg"
                title="logoEngenharia"
                className="max-w-[100px]"
              />
            </button>
            <span className="mt-2 text-center text-gray-700">
              <p>Engenharia de Computação</p>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-iffClaro hover:bg-green-500 text-white font-bold w-[149px] h-[149px] rounded-full flex items-center justify-center">
              <img
                src="/images/alimentos.svg"
                title="logoEngenharia"
                className="max-w-[100px]"
              />
            </button>
            <span className="mt-2 text-center text-gray-700">
              <p>Ciência e Tecnologia de Alimentos</p>
            </span>
          </div>
          {/* Adicione mais itens conforme necessário */}
        </div>
      </div>
    </div>
  );
}

export default ItensColetados;
