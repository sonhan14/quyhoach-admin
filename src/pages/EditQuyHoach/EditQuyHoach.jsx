import React, { useState } from "react";
import "./EditQuyHoach.css";
import { Table, Input, Checkbox, Form, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  handleSelectAllChange,
  handleDelete,
} from "./functions/EditQuyHoachHelper";
import { getColumns } from "./columns";
import { Link } from "react-router-dom";

const { Option } = Select;

function EditQuyHoach() {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      stt: "01",
      name: "Quy Hoạch Quận Hà Đông 2025",
      districtCode: "22",
      expiryYear: "2030",
      provinceCode: "28",
      type: "Quy hoạch quận/huyện",
      coordinates: "",
      path: "D:\\QuyHoach\\HaNoi\\HaDong",
    },
    {
      key: "2",
      stt: "02",
      name: "Dự án vinhomes ocean park 2",
      districtCode: "02",
      expiryYear: "2027",
      provinceCode: "28",
      type: "Quy hoạch 1:500 dự án",
      coordinates: "20.96525095094934, 105.75677753887503",
      path: "D:\\QuyHoach\\duan1:500\\ocean park",
    },
    {
      key: "3",
      stt: "03",
      name: "Quy Hoạch Tỉnh Hòa Bình 2021",
      districtCode: "2021",
      expiryYear: "28",
      provinceCode: "28",
      type: "Quy hoạch xây dựng",
      coordinates: "",
      path: "D:\\QuyHoach\\HaNoi\\HoangMai",
    },
  ]);
  const [filteredData, setFilteredData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [checkedRows, setCheckedRows] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const columns = getColumns({
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
  });

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa chuỗi để tách các ký tự đặc biệt
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Thay thế chữ "đ" thường
      .replace(/Đ/g, "D") // Thay thế chữ "Đ" hoa
      .toLowerCase(); // Chuyển tất cả về chữ thường
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const normalizedValue = removeVietnameseTones(value);
      const filtered = dataSource.filter((item) =>
        removeVietnameseTones(item.name).includes(normalizedValue)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataSource);
    }
  };

  return (
    <div className="container">
      <h2>SỬA - XÓA QUY HOẠCH</h2>
      <Input
        placeholder="Tìm kiếm quy hoạch..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 500 }}
        pagination={{ pageSize: 5 }}
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowClassName={(record) =>
          checkedRows[record.key] ? "checked-row" : ""
        }
        style={{ minHeight: "400px" }}
        className="custom-table"
      />
      <div className="layout-container">
        <div className="layout-row-1">
          <Input className="input-large" placeholder="Tên quy hoạch" />
          <Select className="select-small" placeholder="Mã quận/huyện">
            <Option value="">---</Option>
          </Select>
          <Select className="select-small" placeholder="Mã tỉnh">
            <Option value="28">28</Option>
          </Select>
          <Button type="primary" className="button-green">
            <Link to={"/listfolders"}>Chọn thư mục</Link>
          </Button>
        </div>

        <div className="layout-row-2">
          <Select className="select-medium" defaultValue="2021">
            <Option value="2021">2021</Option>
          </Select>
          <Select className="select-medium" defaultValue="Quy hoạch xây dựng">
            <Option value="Quy hoạch xây dựng">Quy hoạch xây dựng</Option>
          </Select>
          <div className="button-group">
            <Button
              type="primary"
              danger
              className="button-red"
              onClick={() =>
                handleDelete(
                  filteredData,
                  checkedRows,
                  setFilteredData,
                  setCheckedRows,
                  setSelectAllChecked
                )
              }
            >
              Xóa
            </Button>
            <Button type="primary" className="button-green">
              Sửa
            </Button>
          </div>
        </div>

        <div className="layout-row-3">
          <Input className="input-large" placeholder="Nhập tọa độ..." />
          <Button type="primary" className="button-green">
            Tìm trên bản đồ
          </Button>
          <Input
            className="input-path"
            defaultValue="D:\\QuyHoach\\HaNoi\\HoangMai"
          />
        </div>
        <span className="note">* Chỉ quy hoạch 1:500 dự án.</span>
      </div>
    </div>
  );
}

export default EditQuyHoach;
