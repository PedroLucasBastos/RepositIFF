import { Menu, Dropdown, Button } from "antd";
import {
  DownOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./loggedInHeader.css";
import { Link, useNavigate } from "react-router-dom"; // Importando o useNavigate
import Cookies from "js-cookie";

const LoggedInHeader = () => {
  const navigate = useNavigate(); // Usando useNavigate para navegação

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      // Remove o cookie e redireciona para a página de login
      Cookies.remove("authToken");
      console.log("Logging out...");
      navigate("/login"); // Redirecionando para a página de login
    } else if (e.key === "editProfile") {
      console.log("Editing profile...");
    }
  };
  const handleLogout = () => {
    // Remove o cookie e redireciona para a página de login
    Cookies.remove("authToken");
    console.log("Logging out...");
    navigate("/login"); // Redirecionando para a página de login
  };

  // Menu para o dropdown em telas menores
  const dropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="inicio" className="flex items-center space-x-2">
        <HomeOutlined />
        <Link to="/bibliotecario">Início</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="flex items-center space-x-2">
        <LogoutOutlined />
        <a onClick={handleLogout}>LogOut</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="container-Header">
      {/* Logo e informações */}
      <div className="logo-IFF">
        <img src="/logos/logoIFF.png" alt="logo-IFF" />
        <div className="text-info">
          <p>Instituto Federal Fluminense</p>
          <p>Campus Bom Jesus do Itabapoana</p>
        </div>
      </div>

      {/* Menu de navegação para telas grandes e dropdown para telas menores */}
      <div className="navbar-Header">
        <ul className="navbar-menu hidden md:flex">
          <li>
            <HomeOutlined />
            <Link to="/bibliotecario"> Início</Link>
          </li>
          <li>
            <LogoutOutlined />
            <a onClick={handleLogout}> LogOut</a>
          </li>
        </ul>

        {/* Dropdown para dispositivos móveis */}
        <div className="md:hidden">
          <Dropdown
            overlay={dropdownMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
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
};

export default LoggedInHeader;
