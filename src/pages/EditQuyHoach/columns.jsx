// columns.js
import React from "react";
import { Checkbox, Input, Select } from "antd";
import {
  handleCheckboxChange,
  handleEdit,
  handlePathDoubleClick,
  handleSave,
} from "./functions/EditQuyHoachHelper";

const { Option } = Select;

export const getColumns = ({
  filteredData,
  setFilteredData,
  editingKey,
  setEditingKey,
  editingField,
  setEditingField,
  editingText,
  setEditingText,
  checkedRows,
  setCheckedRows,
  selectAllChecked,
  setSelectAllChecked,
  handleSelectAllChange,
}) => {
  const renderEditableCell = (text, record, field) => {
    const isEditing = record.key === editingKey && editingField === field;

    const provinces = ["28", "30", "31"];
    const districts = ["01", "02", "03"];
    const expiryYears = ["2027", "2028", "2030"];
    const types = ["Quy hoạch quận/huyện", "Quy hoạch 1:500 dự án"];

    if (
      ["provinceCode", "districtCode", "expiryYear", "type"].includes(field)
    ) {
      return isEditing ? (
        <Select
          value={editingText}
          onChange={(value) => setEditingText(value)}
          onBlur={() =>
            handleSave(
              editingKey,
              filteredData,
              editingField,
              editingText,
              setFilteredData,
              setEditingKey,
              setEditingField,
              setEditingText
            )
          }
          autoFocus
        >
          {(field === "provinceCode"
            ? provinces
            : field === "districtCode"
            ? districts
            : field === "type"
            ? types
            : expiryYears
          ).map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ) : (
        <div
          onDoubleClick={() =>
            handleEdit(
              record.key,
              field,
              text,
              setEditingKey,
              setEditingField,
              setEditingText
            )
          }
        >
          {text}
        </div>
      );
    }

    if (field === "path") {
      return isEditing ? (
        <Input
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() =>
            handleSave(
              editingKey,
              filteredData,
              editingField,
              editingText,
              setFilteredData,
              setEditingKey,
              setEditingField,
              setEditingText
            )
          }
          autoFocus
        />
      ) : (
        <div
          onDoubleClick={() =>
            handlePathDoubleClick(
              record,
              setEditingKey,
              setEditingField,
              setEditingText
            )
          }
        >
          {text}
        </div>
      );
    }

    return isEditing ? (
      <Input
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onPressEnter={() =>
          handleSave(
            editingKey,
            filteredData,
            editingField,
            editingText,
            setFilteredData,
            setEditingKey,
            setEditingField,
            setEditingText
          )
        }
        onBlur={() =>
          handleSave(
            editingKey,
            filteredData,
            editingField,
            editingText,
            setFilteredData,
            setEditingKey,
            setEditingField,
            setEditingText
          )
        }
        autoFocus
      />
    ) : (
      <div
        onDoubleClick={() =>
          handleEdit(
            record.key,
            field,
            text,
            setEditingKey,
            setEditingField,
            setEditingText
          )
        }
      >
        {text}
      </div>
    );
  };

  return [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (text, record) => renderEditableCell(text, record, "stt"),
    },
    {
      title: "Tên quy hoạch",
      dataIndex: "name",
      key: "name",
      width: 320,
      render: (text, record) => renderEditableCell(text, record, "name"),
    },
    {
      title: "Mã quận/huyện",
      dataIndex: "districtCode",
      key: "districtCode",
      width: 120,
      render: (text, record) =>
        renderEditableCell(text, record, "districtCode"),
    },
    {
      title: "Năm hết hạn",
      dataIndex: "expiryYear",
      key: "expiryYear",
      width: 120,
      render: (text, record) => renderEditableCell(text, record, "expiryYear"),
    },
    {
      title: "Mã tỉnh",
      dataIndex: "provinceCode",
      key: "provinceCode",
      width: 100,
      render: (text, record) =>
        renderEditableCell(text, record, "provinceCode"),
    },
    {
      title: "Loại quy hoạch",
      dataIndex: "type",
      key: "type",
      width: 200,
      render: (text, record) => renderEditableCell(text, record, "type"),
    },
    {
      title: "Tọa độ (nếu có)",
      dataIndex: "coordinates",
      key: "coordinates",
      width: 200,
      render: (text, record) => renderEditableCell(text, record, "coordinates"),
    },
    {
      title: "Đường dẫn",
      dataIndex: "path",
      key: "path",
      width: 350,
      render: (text, record) => renderEditableCell(text, record, "path"),
    },
    {
      title: (
        <Checkbox
          checked={selectAllChecked}
          onChange={(e) =>
            handleSelectAllChange(
              e,
              filteredData,
              setCheckedRows,
              setSelectAllChecked
            )
          }
        />
      ),
      dataIndex: "select",
      key: "select",
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={checkedRows[record.key]}
          onChange={(e) =>
            handleCheckboxChange(record, e.target.checked, setCheckedRows)
          }
        />
      ),
    },
  ];
};
