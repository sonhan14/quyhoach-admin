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
import { useNavigate, useLocation } from "react-router-dom";
import MapModal from './Modals/MapModal';

const { Option } = Select;

function EditQuyHoach() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Quy hoạch xây dựng");
  const [selectedTypeInsert, setSelectedTypeInsert] = useState("Quy hoạch xây dựng");
  const isDistrictDisabled = selectedTypeInsert === "Quy hoạch xây dựng" || selectedType === "Bản đồ địa chính" || selectedType === "Quy hoạch tỉnh 2030";
  const [uniqueProvinces, setUniqueProvinces] = useState([]);

  const [formData, setFormData] = useState({
    description: "abc",
    idDistrict: "14",
    idProvince: "28", // default value
    nam_het_han: "2021", // default value
    type: "Quy hoạch xây dựng", // default value
    location: "",
    huyen_image: "",
    zoom: 18 // default value
  });

  useEffect(() => {
    console.log(formData);

  }, [formData]);

  useEffect(() => {
    if (location.state && location.state.path) {
      setFormData((prevData) => ({
        ...prevData,
        huyen_image: location.state.path, // Gán giá trị vào huyen_image
      }));
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      let response

      if (selectedType === "Quy hoạch 2030" || selectedType === "Kế hoạch sử dụng đất 2024") {
        response = await axios.get(
          "https://api.quyhoach.xyz/allquyhoach_type/quanhuyen?fbclid=IwY2xjawHIix5leHRuA2FlbQIxMAABHRzNtOl88ZQyi_VcvJhJvXo-up4Tj0FDkt48_dmcyG6GUzlr-iAmJC1r5A_aem_I5_TCC5Std2uDekYaUNR1Q"
        );
      }

      if (selectedType === "Bản đồ địa chính") {
        response = await axios.get(
          "https://api.quyhoach.xyz/allquyhoach_type/diachinh?fbclid=IwY2xjawHKBI1leHRuA2FlbQIxMAABHa9tym2ejnKHb6JNl1drJEsGm2W2u7w9Q1Icgc3UhgDo7AWDmxmKzlFclQ_aem_l_Tyv1Af6t17O77KY2sR5Q"
        );
      }

      if (selectedType === "Quy hoạch xây dựng") {
        response = await axios.get(
          "https://api.quyhoach.xyz/allquyhoach_type/quyhoach_xaydung?fbclid=IwY2xjawHKBKhleHRuA2FlbQIxMAABHT_gRYYSbejsr3xDZmyk0hmTGHiExfPJYTRmVq3yOXat06EMDKHdcQ_YDw_aem_YvWXxCMoC17Mp85mUS6MLA"
        );
      }

      if (selectedType === "Quy hoạch tỉnh 2030") {
        response = await axios.get(
          "https://api.quyhoach.xyz/allquyhoach_type/tinh?fbclid=IwY2xjawHKA_NleHRuA2FlbQIxMAABHarkUZ_YhK-Zh2mMRP8FCEm7N7RGDMqkIPM9WBM4MWBK0GeAp7fc4qZ9Nw_aem_Pe_DsGDQWuGrsAENh7oQ3A"
        );
      }

      const data = response.data;

      console.log(response.data);


      // Chuyển đổi dữ liệu từ API sang định dạng phù hợp cho bảng
      const formattedData = data.Posts.map((item) => ({
        key: item.id,
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
  // Fetch data from API
  useEffect(() => {


    fetchData();
  }, [selectedType]);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const response = await axios.get(
          "https://api.quyhoach.xyz/ma_quan_huyen_tinh"
        );
        console.log(response.data);

        setDistrictData(response.data.quanhuyen);

        setUniqueProvinces(response.data.tinhthanh);
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
    setSelectedRecord,
    districtData,
    fetchData,
    setSelectedType,
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


    try {

      if (selectedTypeInsert === "Quy hoạch xây dựng") {
        const insertData = new FormData();
        insertData.append("description", formData.description);
        insertData.append("idProvince", selectedProvince);
        insertData.append("tinh_image", formData.huyen_image);
        insertData.append("type", formData.type);
        insertData.append("location", formData.location);

        await axios.post(
          `https://api.quyhoach.xyz/insert_quyhoach_xaydung`,
          insertData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (selectedTypeInsert === "Quy hoạch tỉnh 2030") {
        const insertData = new FormData();
        insertData.append("description", formData.description);
        insertData.append("idProvince", selectedProvince);
        insertData.append("tinh_image", formData.huyen_image);
        insertData.append("type", formData.type);
        insertData.append("location", formData.location);
        await axios.post(
          `https://api.quyhoach.xyz/insert_quyhoach_tinh`,
          insertData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (selectedTypeInsert === "Bản đồ địa chính") {
        const insertData = new FormData();
        insertData.append("description", formData.description);
        insertData.append("idProvince", selectedProvince);
        insertData.append("tinh_image", formData.huyen_image);
        insertData.append("type", formData.type);
        insertData.append("location", formData.location);
        await axios.post(
          `https://api.quyhoach.xyz/insert_bando_diachinh`,
          insertData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }


      if (selectedType === "Quy hoạch 2030" || selectedType === "Kế hoạch sử dụng đất 2024") {
        const insertData = new FormData();
        insertData.append("description", formData.description);
        insertData.append("idDistrict", selectedDistrict);
        insertData.append("idProvince", selectedProvince);
        insertData.append("huyen_image", formData.huyen_image);
        insertData.append("nam_het_han", formData.nam_het_han);
        insertData.append("type", formData.type);
        insertData.append("zoom", formData.zoom);
        insertData.append("location", formData.location);
        await axios.post(
          `https://api.quyhoach.xyz/insert_quyhoach_quanhuyen`,
          insertData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }


      message.success("Dữ liệu đã được lưu!");
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  const handleSelectFolder = () => {
    navigate('/listfolders'); // Chuyển hướng đến màn /listfolders
  };

  const openModal = () => {
    setIsMapModalVisible(true);
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
        pagination={{ pageSize: 1000 }}
        rowClassName={(record) => (checkedRows[record.key] ? "checked-row" : "")}
        style={{ minHeight: "400px" }}
        className="custom-table"
      />

      <div className="layout-container">
        <div className="layout-row-1">
          <Input
            onChange={(e) => handleChange("description", e.target.value)}
            className="input-large"
            value={formData.description}
            placeholder="Tên quy hoạch" />

          <Select
            onChange={handleDistrictChange}
            className="select-small"
            placeholder="Mã quận/huyện"
            value={selectedDistrict}
            disabled={isDistrictDisabled}
            style={{ backgroundColor: 'white', borderRadius: 6, color: 'black' }}
          >
            {districtData.map((item) => (
              <Option key={item.DistrictID} value={item.DistrictID}>
                {item.DistrictID} - {item.DistrictName}
              </Option>
            ))}
          </Select>

          <Select
            className="select-small"
            placeholder="Mã tỉnh"
            value={selectedProvince}
            onChange={(value) => setSelectedProvince(value)}
            disabled={!isDistrictDisabled}
            style={{ backgroundColor: 'white', borderRadius: 6, color: 'black' }}
          >
            {selectedProvince && !isDistrictDisabled && (
              <Option key={selectedProvince} value={selectedProvince}>
                {selectedProvince}
              </Option>
            )}
            {isDistrictDisabled && uniqueProvinces.map((item) => (
              <Option key={item.ProvinceID} value={item.ProvinceID}>
                {item.ProvinceID} - {item.ProvinceName}
              </Option>
            ))}
          </Select>

          <Button type="primary"
            onClick={handleSelectFolder}
            className="button-green">Chọn thư mục</Button>
        </div>

        <div className="layout-row-2">

          <Select
            onChange={(value) => handleChange("nam_het_han", value)}
            className="select-medium"
            defaultValue={formData.nam_het_han}
          >
            <Option value="2024">2024</Option>
            <Option value="2025">2025</Option>
            <Option value="2030">2030</Option>
          </Select>

          <Select
            onChange={(value) => { handleChange("type", value); setSelectedTypeInsert(value) }}
            className="select-medium"
            defaultValue={formData.type}
            value={selectedTypeInsert}
          >

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
                  setSelectAllChecked,
                  selectedType
                )
              }
            >
              Xóa
            </Button>
            <Button type="primary" className="button-green" onClick={handleSave}>Thêm</Button>
          </div>
        </div>

        <div className="layout-row-3">
          <Input
            onChange={(e) => handleChange("location", e.target.value)}
            className="input-large"
            placeholder="Nhập tọa độ..." />
          <Button
            onClick={openModal}
            type="primary" className="button-green">Tìm trên bản đồ</Button>
          <Input
            className="input-path"
            disabled
            value={formData.huyen_image}
            style={{ backgroundColor: 'white', color: 'black' }}
          />
        </div>
        <span className="note">* Chỉ quy hoạch 1:500 dự án.</span>
      </div>
      <MapModal
        isVisible={isMapModalVisible}
        setIsMapModalVisible={setIsMapModalVisible}
        setFormData={setFormData}
        setSelectedDistrict={setSelectedDistrict}
        setSelectedProvince={setSelectedProvince}
      />


    </div>
  );
}

export default EditQuyHoach;