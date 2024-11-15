import {
  FaXTwitter,
  FaFacebookF,
  FaSquareInstagram,
  FaYoutube,
} from "react-icons/fa6";

const rolarAte = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

import "./rodape.css";

function Rodape() {
  return (
    <footer className="text-green-900 text-sm ">
      {/* Seção de Redes Sociais */}
      <div className="bg-iffEscuro text-white py-4">
        <div className="container mx-auto flex justify-center space-x-4">
          <a
            href="https://www.youtube.com/ifftubeoficial"
            aria-label="YouTube"
            className="cursor-pointer"
          >
            <FaYoutube size={25} />
          </a>
          <a
            href="https://www.facebook.com/iffbomjesus"
            aria-label="Facebook"
            className="cursor-pointer"
          >
            <FaFacebookF size={25} />
          </a>
          <a
            href="https://x.com/iffluminense"
            aria-label="Twitter(X)"
            className="cursor-pointer"
          >
            <FaXTwitter size={25} />
          </a>
          <a
            href="https://www.instagram.com/iffbomjesus"
            aria-label="Instagram"
            className="cursor-pointer"
          >
            <FaSquareInstagram size={25} />
          </a>
        </div>
      </div>

      {/* Seção de Links e Logos */}
      <div className="bg-white py-6">
        <div className="container mx-auto flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:justify-between px-4">
          {/* Links de Navegação */}
          <div className="flex flex-wrap justify-center space-x-4 md:space-x-8 text-center">
            <a href="#" className="hover:underline cursor-pointer">
              INÍCIO
            </a>
            <a
              onClick={() => rolarAte("sobre")}
              className="hover:underline cursor-pointer"
            >
              SOBRE
            </a>
            <a href="#" className="hover:underline cursor-pointer">
              FONTES COLETADAS
            </a>
            <a href="#" className="hover:underline cursor-pointer">
              INDICADORES
            </a>
            <a href="#" className="hover:underline cursor-pointer">
              CONTATO
            </a>
          </div>

          {/* Logos */}
          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <img
              src="./logos/logoIFF.png"
              alt="Instituto Federal Fluminense"
              className="w-[150px] md:w-[170px] h-[50px] md:h-[60px]"
            />
            <img
              src="./logos/repositIffLogo.svg"
              alt="Instituto Federal Fluminense"
              className="w-[150px] md:w-[170px] h-[50px] md:h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="bg-white text-center py-4 text-gray-500 mt-[-20px] px-4">
        &copy; 2024 REPOSITIFF - Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Rodape;
