import { useState, useEffect } from "react";
import "./EditQuyHoach.css";
import { Table, Input, Button, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  handleSelectAllChange,
  handleDelete,
} from "./functions/EditQuyHoachHelper";
import { getColumns } from "./columns";

const { Option } = Select;

function EditQuyHoach() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [checkedRows, setCheckedRows] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const [districtData, setDistrictData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");

  const [formData, setFormData] = useState({
    description: "",
    idDistrict: "",
    idProvince: "28", // default value
    nam_het_han: "2021", // default value
    type: "Quy hoạch xây dựng", // default value
    location: "",
    huyen_image: "D:\\QuyHoach\\HaNoi\\HoangMai",
    zoom: 18 // default value
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quyhoach.xyz/allquyhoach_type/quanhuyen?fbclid=IwY2xjawHIix5leHRuA2FlbQIxMAABHRzNtOl88ZQyi_VcvJhJvXo-up4Tj0FDkt48_dmcyG6GUzlr-iAmJC1r5A_aem_I5_TCC5Std2uDekYaUNR1Q"
        );
        const data = response.data;

        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp cho bảng
        const formattedData = data.Posts.map((item, index) => ({
          key: item.id,
          stt: index + 1,
          description: item.description || "N/A",
          idDistrict: item.idDistrict || "N/A",
          nam_het_han: item.nam_het_han || "N/A",
          idProvince: item.idProvince || "N/A",
          type: item.type || "N/A",
          coordinates: item.coordinates || "",
          huyen_image: item.huyen_image || "N/A",
          location: item.location || "N/A",
        }));

        setDataSource(formattedData);
        setFilteredData(formattedData); // Khởi tạo dữ liệu lọc
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const response = await axios.get(
          "https://api.quyhoach.xyz/ma_quan_huyen_tinh"
        );
        console.log(response.data.quanhuyen);

        setDistrictData(response.data.quanhuyen);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
      }
    };

    fetchDistrictData();
  }, []);

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);

    const selectedDistrictData = districtData.find(
      (item) => item.DistrictID === value
    );
    if (selectedDistrictData) {
      // Tạo danh sách mã tỉnh từ dữ liệu API
      setSelectedProvince(selectedDistrictData.ProvinceID);
    } else {
      setSelectedProvince("");
    }
  };

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
    selectedRecord,
    setSelectedRecord
  });

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const normalizedValue = removeVietnameseTones(value);
      const filtered = dataSource.filter((item) =>
        removeVietnameseTones(item.description).includes(normalizedValue)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataSource);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSave = async () => {

    if (!formData.description || !selectedDistrict || !selectedProvince || !formData.nam_het_han || !formData.type || !formData.huyen_image) {
      message.error("Vui lòng điền đầy đủ thông tin vào các trường bắt buộc!");
      return;
    }
    const updatedFormData = {
      ...formData,
      idDistrict: selectedDistrict, // Gán mã huyện đã chọn
      idProvince: selectedProvince, // Gán mã tỉnh đã chọn
    };
    console.log("Form Data Saved: ", formData);
    try {
      // Tạo form-data để gửi lên server
      const insertData = new FormData();
      insertData.append("description", updatedFormData.description);
      insertData.append("idDistrict", updatedFormData.idDistrict);
      insertData.append("idProvince", updatedFormData.idProvince);
      insertData.append("huyen_image", updatedFormData.huyen_image);
      insertData.append("nam_het_han", updatedFormData.nam_het_han);
      insertData.append("type", updatedFormData.type);
      insertData.append("zoom", updatedFormData.zoom);
      insertData.append("location", updatedFormData.location);

      const response = await axios.post(
        `https://api.quyhoach.xyz/insert_quyhoach_quanhuyen`,
        insertData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo header đúng
          },
        }
      );

      console.log(response.data);
      message.success("Dữ liệu đã được lưu!");
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
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
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowClassName={(record) => (checkedRows[record.key] ? "checked-row" : "")}
        style={{ minHeight: "400px" }}
        className="custom-table"
      />

      <div className="layout-container">
        <div className="layout-row-1">
          <Input
            onChange={(e) => handleChange("description", e.target.value)}
            className="input-large"
            placeholder="Tên quy hoạch" />

          <Select
            onChange={handleDistrictChange}
            className="select-small"
            placeholder="Mã quận/huyện"
            value={selectedDistrict}
          >
            {districtData.map((item) => (
              <Option key={item.DistrictID} value={item.DistrictID}>
                {item.DistrictID}
              </Option>
            ))}
          </Select>

          <Select
            className="select-small"
            placeholder="Mã tỉnh"
            value={selectedProvince}
            onChange={(value) => setSelectedProvince(value)}
            disabled
            style={{ backgroundColor: 'white', borderRadius: 6 }}
          >
            {selectedProvince && (
              <Option key={selectedProvince} value={selectedProvince}>
                {selectedProvince}
              </Option>
            )}
          </Select>

          <Button type="primary" className="button-green">Chọn thư mục</Button>
        </div>

        <div className="layout-row-2">

          <Select
            onChange={(value) => handleChange("nam_het_han", value)}
            className="select-medium"
            defaultValue="2024">
            <Option value="202">2024</Option>
            <Option value="2025">2025</Option>
            <Option value="2030">2030</Option>
          </Select>

          <Select

            onChange={(value) => handleChange("type", value)}
            className="select-medium"
            defaultValue="Quy hoạch xây dựng">
            <Option value="Quy hoạch xây dựng">Quy hoạch xây dựng</Option>
            <Option value="Bản đồ địa chính">Bản đồ địa chính</Option>
            <Option value="Kế hoạch sử dụng đất 2024">Kế hoạch sử dụng đất 2024</Option>
            <Option value="Quy hoạch 2030">Quy hoạch 2030</Option>
            <Option value="Quy hoạch tỉnh 2030">Quy hoạch tỉnh 2030</Option>

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
            <Button type="primary" className="button-green" onClick={handleSave}>Sửa</Button>
          </div>
        </div>

        <div className="layout-row-3">
          <Input
            onChange={(e) => handleChange("location", e.target.value)}
            className="input-large"
            placeholder="Nhập tọa độ..." />
          <Button type="primary" className="button-green">Tìm trên bản đồ</Button>
          <Input
            className="input-path"
            defaultValue="D:\\QuyHoach\\HaNoi\\HoangMai"
            onChange={(e) => handleChange("huyen_image", e.target.value)}
          />
        </div>
        <span className="note">* Chỉ quy hoạch 1:500 dự án.</span>
      </div>
    </div>
  );
}

export default EditQuyHoach;