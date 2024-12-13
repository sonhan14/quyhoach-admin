// EditableCell.js
import React from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

const EditableCell = ({
  text,
  record,
  field,
  isEditing,
  editingText,
  setEditingText,
  handleSave
}) => {
  // Lựa chọn cho các trường select
  const provinces = ["28", "30", "31"];
  const districts = ["01", "02", "03"];
  const expiryYears = ["2027", "2028", "2030"];
  const type = ["Quy hoạch quận/huyện", "Quy hoạch 1:500 dự án"];

  if (field === "provinceCode" || field === "districtCode" || field === "expiryYear" || field === "type") {
    return isEditing ? (
      <Select
        value={editingText}
        onChange={(value) => setEditingText(value)}
        onBlur={handleSave}
        autoFocus
      >
        {(field === "provinceCode" ? provinces : field === "districtCode" ? districts : field === 'type' ? type : expiryYears).map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    ) : (
      <div>{text}</div>
    );
  }

  if (field === "path") {
    return isEditing ? (
      <Input
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onBlur={handleSave}
        autoFocus
      />
    ) : (
      <div>{text}</div>
    );
  }

  return isEditing ? (
    <Input
      value={editingText}
      onChange={(e) => setEditingText(e.target.value)}
      onPressEnter={handleSave}
      onBlur={handleSave}
      autoFocus
    />
  ) : (
    <div>{text}</div>
  );
};

export default EditableCell;
