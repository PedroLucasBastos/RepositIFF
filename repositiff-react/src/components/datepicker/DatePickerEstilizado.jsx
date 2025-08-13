import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerEstilizado.css'; // Nosso CSS customizado

registerLocale('pt-BR', ptBR);

// Componente aceita 'value' e 'onChange' para ser compatível com o <Form.Item> do AntD
const DatePickerEstilizado = ({ value, onChange, showYearPicker = false }) => {
  return (
    <div className="datepicker-wrapper">
      <DatePicker
        selected={value}
        onChange={onChange}
        locale="pt-BR"
        dateFormat={showYearPicker ? "yyyy" : "dd/MM/yyyy"}
        showYearPicker={showYearPicker}
        className="input-estilo-antd"
        placeholderText={showYearPicker ? "Selecione um ano" : "Selecione uma data"}
      />
    </div>
  );
};

export default DatePickerEstilizado;