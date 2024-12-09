import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";

const EditProfile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Amélie");
  const [lastName, setLastName] = useState("Laurent");
  const [email, setEmail] = useState("amelie@untitledui.com");
  const [username, setUsername] = useState("amelie");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModified, setIsModified] = useState(false);

  const handleSaveChanges = () => {
    if (password !== confirmPassword) {
      message.error("As senhas não coincidem!");
      return;
    }
    message.success("Alterações salvas com sucesso!");
  };

  const handleCancel = () => {
    message.info("Edição cancelada!");
    navigate("/bibliotecario");
  };

  const handleInputChange = (setter, value, originalValue) => {
    setter(value);
    setIsModified(
      value !== originalValue || password !== "" || confirmPassword !== ""
    );
  };

  const passwordMismatch =
    password && confirmPassword && password !== confirmPassword;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-72 mt-32">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mt-2">{`${firstName} ${lastName}`}</h2>
        <p className="text-gray-500">{email}</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Email */}
        <Input
          placeholder="Email"
          value={email}
          prefix={<MailOutlined />}
          onChange={(e) =>
            handleInputChange(setEmail, e.target.value, "amelie@untitledui.com")
          }
        />

        {/* Senha */}
        <Input.Password
          placeholder="Senha"
          value={password}
          prefix={<KeyOutlined />}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsModified(true);
          }}
          className={passwordMismatch ? "border-red-500" : ""}
        />

        {/* Confirmar Senha */}
        <Input.Password
          placeholder="Confirmar Senha"
          value={confirmPassword}
          prefix={<KeyOutlined />}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setIsModified(true);
          }}
          className={passwordMismatch ? "border-red-500" : ""}
        />
      </div>

      <div className="mt-6 flex justify-between">
        <div className="space-x-2">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            disabled={!isModified}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
