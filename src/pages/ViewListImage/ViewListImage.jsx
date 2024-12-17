import { useEffect, useState } from "react";
import axios from "axios";
import imgFolder from "../../assets/folder.png";
import Search from "../../components/Search/Search.jsx";
import "./ViewListImage.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";

const ImageListFolder = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const fetchData = async (url = "") => {
        try {
            const formData = new FormData();
            formData.append("duongdan", url); // Thay thế đường dẫn ở đây

            const response = await axios.post(
                "https://api.quyhoach.xyz/view_quyhoach_tinh_image_all",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response.data);

            if (response.data) {
                const { full_path, quyhoach } = response.data;

                const quyhoachData = quyhoach.map((item) => `${item}`);
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


    useEffect(() => {
        const tinh = searchParams.get("tinh");
        const quyhoach = searchParams.get("quyhoach");
        // const folder = searchParams.get("folder");
        if (tinh) {
            fetchData(tinh);
            if (quyhoach) {
                fetchData(`${tinh}/${quyhoach}`);
                // if (folder) {
                //     fetchData(`${tinh}/${quyhoach}/${folder}`);
                // }
            }
        } else {
            fetchData();
        }
    }, [searchParams]);


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
                        if (searchParams.get("quyhoach")) {
                            searchParams.set("folder", item);
                            navigate(`/viewimageinfolder/${searchParams.get("tinh")}/${searchParams.get("quyhoach")}/${searchParams.get("folder")}`);
                        } else if (searchParams.get("tinh")) {
                            searchParams.set("quyhoach", item);
                            setSearchParams(searchParams);
                        } else {
                            searchParams.set("tinh", item);
                            setSearchParams(searchParams);
                        }
                    }}
                    className="folder-item"
                >
                    <img src={imgFolder} alt="Folder Icon" className="folder-icon" />
                    <span className="folder-text">{item}</span>
                </div>
            );
        });
    };
    useEffect(() => {
        if (searchParams.get("tinh")) {
            fetchData(searchParams.get("tinh"));
        } else {
            fetchData();
            setSearchParams([]);
        }
    }, []);
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

export default ImageListFolder;