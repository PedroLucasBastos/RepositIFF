import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./cabecalho.css";
import { Link } from "react-router-dom";

const rolarAte = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

// Menu para o dropdown em telas menores
const menu = (
  <Menu>
    <Menu.Item key="inicio">
      <Link to="/">Início</Link>
    </Menu.Item>
    <Menu.Item key="sobre" onClick={() => rolarAte("sobre")}>
      Sobre
    </Menu.Item>
    <Menu.Item key="indicadores">
      <a href="#indicadores">Indicadores</a>
    </Menu.Item>
    <Menu.Item key="contato">
      <a href="#contato">Contato</a>
    </Menu.Item>
    <Menu.Item key="faq">
      <a href="#faq">FAQ</a>
    </Menu.Item>
  </Menu>
);

function Cabecalho() {
  return (
    <div className="container-cabecalho">
      {/* Logo e informações */}
      <div className="logo-IFF">
        <img src="./logos/logoIFF.png" alt="logo-IFF" />
        <div className="text-info">
          <p>Instituto Federal Fluminense</p>
          <p>Campus Bom Jesus do Itabapoana</p>
        </div>
      </div>

      {/* Menu de navegação para telas grandes e dropdown para telas menores */}
      <div className="navbar-cabecalho">
        <ul className="navbar-menu hidden md:flex">
          <li>
            <Link to="/">Início</Link>
          </li>
          <li onClick={() => rolarAte("sobre")}>Sobre</li>
          <li>
            <a href="#indicadores">Indicadores</a>
          </li>
          <li>
            <a href="#contato">Contato</a>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>

        {/* Dropdown para dispositivos móveis */}
        <div className="md:hidden">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              className="flex items-center space-x-1 text-black"
            >
              <span>Menu</span> <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Cabecalho;
