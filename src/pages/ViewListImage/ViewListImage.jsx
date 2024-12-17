import { useEffect, useState } from "react";
import axios from "axios";
import imgFolder from "../../assets/folder.png";
import Search from "../../components/Search/Search.jsx";
import "./ViewListImage.css";
import { useNavigate } from "react-router-dom";

const ImageListFolder = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append("duongdan", ""); // Thay thế đường dẫn ở đây

                const response = await axios.post(
                    "https://api.quyhoach.xyz/view_quyhoach_tinh_image_all",
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                console.log(response.data);


                if (response.data) {
                    const { full_path, quyhoach } = response.data;

                    const quyhoachData = quyhoach.map(item => `${item}`);
                    setData(quyhoachData);

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
        // Lọc dữ liệu quy hoạch 2024 khi có tìm kiếm
        if (searchTerm) {
            const filtered = data.filter((item) => {
                const parts = item.split("/");
                const province = parts[5]?.toLowerCase() || "";
                const district = parts[6]?.toLowerCase() || "";
                const searchLower = searchTerm.toLowerCase();
                return province.includes(searchLower) || district.includes(searchLower);
            });
            setFilteredData(filtered || []);
        } else {
            setFilteredData(data || []);
        }
    }, [searchTerm, data]);


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
                        {item}
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="folder-list-container">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="folder-items-container">
                {renderContent(filteredData)} {/* Luôn hiển thị dữ liệu quy hoạch 2024 */}
            </div>
        </div>
    );
};

export default ImageListFolder;
