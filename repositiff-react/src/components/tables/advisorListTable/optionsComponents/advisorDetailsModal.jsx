import React, { useEffect, useState } from "react";
import { Form, Input, Spin, Modal, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const AdvisorDetailsModal = ({ advisorId, isVisible, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [advisor, setAdvisor] = useState(null);

  // Carregar dados do orientador
  useEffect(() => {
    const fetchAdvisorDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3333/advisor/list");
        const advisorData = response.data.Advisors.find(
          (item) => item._id === advisorId
        );

        if (advisorData) {
          setAdvisor(advisorData._props);
        } else {
          message.error("Orientador não encontrado.");
          handleCancel(); // Fechar o modal caso o orientador não seja encontrado
        }
      } catch (error) {
        message.error("Erro ao buscar dados do orientador.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (advisorId && isVisible) fetchAdvisorDetails();
  }, [advisorId, isVisible, handleCancel]);

  return (
    <Modal
      visible={isVisible}
      title="Detalhes do Orientador"
      onCancel={handleCancel}
      footer={null} // Remove os botões padrão
    >
      <Spin spinning={loading}>
        {advisor ? (
          <Form layout="vertical" autoComplete="off" className="space-y-4">
            <Form.Item label="Nome">
              <Input value={advisor.name} disabled />
            </Form.Item>

            <Form.Item label="Sobrenome">
              <Input value={advisor.surname} disabled />
            </Form.Item>

            <Form.Item label="Matrícula">
              <Input value={advisor.registrationNumber} disabled />
            </Form.Item>
          </Form>
        ) : (
          <p>Carregando informações do orientador...</p>
        )}
      </Spin>
    </Modal>
  );
};

AdvisorDetailsModal.defaultProps = {
  handleCancel: () => {},
};

AdvisorDetailsModal.propTypes = {
  advisorId: PropTypes.string.isRequired, // ID do orientador a ser exibido
  isVisible: PropTypes.bool.isRequired, // Controle de visibilidade do modal
  handleCancel: PropTypes.func.isRequired, // Função para fechar o modal
};

export default AdvisorDetailsModal;
