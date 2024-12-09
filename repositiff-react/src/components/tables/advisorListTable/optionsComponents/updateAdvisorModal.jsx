import React, { useEffect, useState } from "react";
import { Form, Input, Spin, Modal, Button, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const UpdateAdvisorModal = ({
  advisorId,
  isVisible,
  handleCancel,
  fetchAdvisors,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  // Carregar os dados do orientador
  useEffect(() => {
    const fetchAdvisorDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3333/advisor/list");
        const advisorData = response.data.Advisors.find(
          (item) => item._id === advisorId
        );

        if (advisorData) {
          form.setFieldsValue({
            name: advisorData._props.name,
            surname: advisorData._props.surname,
            registrationNumber: advisorData._props.registrationNumber,
          });
        } else {
          message.error("Orientador não encontrado.");
          handleCancel();
        }
      } catch (error) {
        message.error("Erro ao buscar os dados do orientador.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (advisorId && isVisible) fetchAdvisorDetails();
  }, [advisorId, isVisible, handleCancel, form]);

  // Salvar as alterações
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Estrutura correta para o envio para a API
      const updateFields = {};
      if (values.name) updateFields.name = values.name;
      if (values.surname) updateFields.surname = values.surname;
      if (values.registrationNumber)
        updateFields.registrationNumber = values.registrationNumber;

      const dataToSend = {
        advisorIdentification: advisorId,
        updateFields,
      };

      await axios.put("http://localhost:3333/advisor/update", dataToSend);

      message.success("Dados do orientador atualizados com sucesso!");
      handleCancel(); // Fechar o modal após salvar
      fetchAdvisors(); // Atualizar a lista de orientadores
    } catch (error) {
      message.error("Erro ao salvar os dados: " + error.message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      title="Editar Orientador"
      onCancel={handleCancel}
      footer={null} // Botões customizados
    >
      <Spin spinning={loading || saving}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Por favor, insira o nome." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sobrenome"
            name="surname"
            rules={[
              { required: true, message: "Por favor, insira o sobrenome." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Matrícula"
            name="registrationNumber"
            rules={[
              { required: true, message: "Por favor, insira a matrícula." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button type="primary" onClick={handleSave} loading={saving}>
                Salvar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

UpdateAdvisorModal.defaultProps = {
  handleCancel: () => {},
  fetchAdvisors: () => {},
};

UpdateAdvisorModal.propTypes = {
  advisorId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  fetchAdvisors: PropTypes.func.isRequired, // Atualizar a lista após salvar
};

export default UpdateAdvisorModal;
