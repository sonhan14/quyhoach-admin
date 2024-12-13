import { useEffect, useState } from "react";
import axios from "axios";
import imgFolder from "../../assets/folder.png";
import Search from "../../components/Search/Search.jsx";
import "./ViewListFolder.css";
import { useNavigate } from "react-router-dom";

const FolderList = () => {
  const [data, setData] = useState({
    2024: [],
    2030: [],
    quyhoach_tinh: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state tìm kiếm
  const [filteredData, setFilteredData] = useState([]); // Thêm state để lưu dữ liệu đã lọc
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quyhoach.xyz/liet_ke_thu_muc_chua_add_quyhoach"
        );

        console.log("API Response: ", response.data);

        if (response.data) {
          const quyhoach2024 = response.data["2024"];
          const quyhoach2030 = response.data["2030"];
          const quyhoach_tinh = response.data["quyhoach_tinh"];

          console.log("Quy hoach 2024: ", quyhoach2024);
          console.log("Quy hoach 2030: ", quyhoach2030);
          console.log("Quy hoach tinh: ", quyhoach_tinh);

          setData({
            2024: Array.isArray(quyhoach2024?.quyhoach_quanhuyen)
              ? quyhoach2024.quyhoach_quanhuyen
              : [],
            2030: Array.isArray(quyhoach2030?.quyhoach_quanhuyen)
              ? quyhoach2030.quyhoach_quanhuyen
              : [],
            quyhoach_tinh: Array.isArray(quyhoach_tinh?.quyhoach_quanhuyen)
              ? quyhoach_tinh.quyhoach_quanhuyen
              : [],
          });
        } else {
          setError("Dữ liệu không hợp lệ hoặc không có dữ liệu.");
        }
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Lọc dữ liệu khi có tìm kiếm
      const filtered = data[selectedType]?.filter((item) => {
        const parts = item.split("/");
        const province = parts[5]?.toLowerCase() || "";
        const district = parts[6]?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();
        return province.includes(searchLower) || district.includes(searchLower);
      });
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data[selectedType] || []);
    }
  }, [searchTerm, selectedType, data]);

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const renderContent = (data) => {

    if (loading) {
      return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return <p>Không có dữ liệu để hiển thị.</p>;
    }

    return data.map((item, index) => {
      const parts = item.split("/");

      if (selectedType === "quyhoach_tinh") {
        const province = parts[5]; // Tỉnh (theo đường dẫn của bạn)
        const district = parts[6];

        return (
          <div
            key={index}
            onClick={() => {
              // console.log(`Đường dẫn API: ${item}, Loại: quyhoach_tinh`)
              navigate('/editquyhoach');
            }}
            className="folder-item"
          >
            <img src={imgFolder} alt="Folder Icon" className="folder-icon" />
            <span className="folder-text">
              Quy hoạch {province} {district}
            </span>
          </div>
        );
      } else if (selectedType === "2024" || selectedType === "2030") {
        const province = parts[5];
        const district = parts[6];

        return (
          <div
            key={index}
            onClick={() => {
              navigate('/editquyhoach', { state: { path: item } })
            }}
            className="folder-item"
          >
            <img src={imgFolder} alt="Folder Icon" className="folder-icon" />
            <span className="folder-text">
              Quy hoạch {province} - {district}
            </span>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="folder-list-container">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="type-selector">
        <button onClick={() => handleTypeClick("2024")}>Quy hoạch 2024</button>
        <button onClick={() => handleTypeClick("2030")}>Quy hoạch 2030</button>
        <button onClick={() => handleTypeClick("quyhoach_tinh")}>
          Quy hoạch Tỉnh
        </button>
      </div>

      <div className="folder-items-container">
        {selectedType && <>{renderContent(filteredData)}</>}
      </div>
    </div>
  );
};

export default FolderList;
