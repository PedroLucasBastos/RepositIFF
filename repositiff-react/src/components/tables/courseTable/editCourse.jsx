import React, { useEffect, useState } from "react";
import { Form, Input, Select, Spin, Modal, Button, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const { Option } = Select;

const degreeOptions = [
  { label: "Bacharelado", value: "BACHELOR" },
  { label: "Licenciatura", value: "LICENTIATE" },
];

const EditCourse = ({ courseId, isVisible, handleCancel, fetchCourses }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  // Carregar os dados do curso
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3333/course/list");
        const courseData = response.data.Courses.find(
          (item) => item._id === courseId
        );

        if (courseData) {
          form.setFieldsValue({
            name: courseData._props.name,
            courseCode: courseData._props.courseCode,
            degreeType: courseData._props.degreeType, // Já vem no formato correto (BACHELOR ou LICENTIATE)
          });
        } else {
          message.error("Curso não encontrado.");
          handleCancel();
        }
      } catch (error) {
        message.error("Erro ao buscar os dados do curso.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) fetchCourseDetails();
  }, [courseId, isVisible, handleCancel, form]);

  // Salvar as alterações
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const updateFields = {
        name: values.name,
        courseCode: values.courseCode,
        degreeType: values.degreeType, // Já está no formato correto (BACHELOR ou LICENTIATE)
      };

      const dataToSend = {
        courseId,
        updateFields,
      };

      await axios.put("http://localhost:3333/course/update", dataToSend);

      message.success("Curso atualizado com sucesso!");
      handleCancel(); // Fechar o modal
      fetchCourses(); // Atualizar a lista de cursos
    } catch (error) {
      message.error("Erro ao salvar os dados: " + error.message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={isVisible}
      title="Editar Curso"
      onCancel={handleCancel}
      footer={null}
    >
      <Spin spinning={loading || saving}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            label="Nome do Curso"
            name="name"
            rules={[{ required: true, message: "Insira o nome do curso." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Código do Curso"
            name="courseCode"
            rules={[{ required: true, message: "Insira o código do curso." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tipo de Grau"
            name="degreeType"
            rules={[{ required: true, message: "Selecione o tipo de grau." }]}
          >
            <Select placeholder="Selecione o tipo">
              {degreeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
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

EditCourse.propTypes = {
  courseId: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  fetchCourses: PropTypes.func.isRequired,
};

export default EditCourse;
