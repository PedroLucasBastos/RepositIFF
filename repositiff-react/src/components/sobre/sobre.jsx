import "./sobre.css";

function Sobre() {
  return (
    <div
      id="sobre"
      className="flex flex-col md:flex-row items-center justify-center md:space-x-[350px] space-y-6 md:space-y-0 p-8 mt-20 mb-96"
    >
      {/* Imagem à esquerda */}
      <img
        src="/images/computadorLivro.svg"
        className="w-[200px] md:w-[300px] h-auto"
        alt="Computador com Livro"
      />

      {/* Texto à direita */}
      <div className="max-w-md p-4 md:p-6 bg-transparent rounded-lg shadow-md border-gray-200 border-2">
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          O Repositório Institucional do Instituto Federal Fluminense Campus Bom
          Jesus do Itabapoana (REPOSITIFF) é uma plataforma multidisciplinar que
          disponibiliza acesso gratuito à produção científica gerada pelos
          alunos vinculados à instituição.
        </p>
        <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
          Através do REPOSITIFF, é possível buscar trabalhos de conclusão de
          curso de forma gratuita.
        </p>
        <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          ut enim eget arcu porttitor cursus. Phasellus nec metus vitae ex
          iaculis posuere sit amet ut nisi. Sed congue urna in turpis semper,
          vel molestie sapien dapibus. Curabitur tempor, neque quis fermentum
          bibendum, nulla urna tempor nisl, ac commodo orci metus vitae felis.
          Praesent ac convallis lectus. Phasellus quis diam consectetur,
          scelerisque ex id, volutpat elit. Aliquam eget quam magna. Aliquam
          ultrices mi a urna cursus, sed semper lectus iaculis. Nam eget massa
          lacus.
        </p>
      </div>
    </div>
  );
}

export default Sobre;
