import { useEffect, useState } from "react";
import axios from "axios";
import imgFolder from "../../assets/folder.png";
import Search from "../../components/Search/Search.jsx";
import "./ViewListId.css";
import { useNavigate, useParams } from "react-router-dom";

const IDListFolder = () => {
    const { city, level } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const formData = new FormData();
            formData.append("duongdan", city + '/' + level);


            const response = await axios.post(
                "https://api.quyhoach.xyz/view_quyhoach_tinh_image_all",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data) {
                const { full_path, quyhoach } = response.data;
                const quyhoachData = quyhoach.map((item) => `${item}`);
                quyhoachData.sort((a, b) => parseFloat(a) - parseFloat(b));

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
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = data.filter((item) => {
                return item.toLowerCase().includes(searchTerm.toLowerCase());
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
                        navigate(`/imagefolderlist/${city}/${level}/${item}`);
                    }}
                    className="folder-item"
                >
                    <img src={imgFolder} alt="Folder Icon" className="folder-icon" />
                    <span className="folder-text">{item}</span>
                </div>
            );
        });
    };


    return (
        <div className="folder-list-container">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="folder-items-container">
                {renderContent(filteredData)}{" "}
                {/* Luôn hiển thị dữ liệu quy hoạch 2024 */}
            </div>
        </div>
    );
};

export default IDListFolder;
