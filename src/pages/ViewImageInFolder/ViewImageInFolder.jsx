import { useEffect, useState } from "react";
import axios from "axios";
import Search from "../../components/Search/Search.jsx";
import "./ViewImageInFolder.css";
import { useNavigate, useParams } from "react-router-dom";

const ViewImageInFolder = () => {
    const { city, level, id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [full_path, setFullPath] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append("duongdan", `${city}/${level}/${id}`); // Thay thế đường dẫn ở đây

                const response = await axios.post(
                    "https://api.quyhoach.xyz/view_quyhoach_tinh_image_all",
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );


                if (response.data) {
                    const { full_path, png_list } = response.data;
                    setData(png_list);
                    setFullPath(full_path)
                } else {
                    setError("Dữ liệu không hợp lệ hoặc không có dữ liệu.");
                }
            } catch (error) {
                setError("Lỗi khi lấy dữ liệu: " + error.message);
            } finally {
                setLoading(true);
            }
        };

        fetchData();
    }, [city, level, id]);

    useEffect(() => {
        const fetchImages = async () => {
            const urls = [];
            const promises = [];

            for (const item of data) {
                const formData = new FormData();
                formData.append("link_folder", full_path);
                formData.append("name_anh", `${item}`);


                const promise = axios.post(
                    "https://api.quyhoach.xyz/load_image_in_folder",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        responseType: "blob",
                    }
                ).then(response => {
                    const url = URL.createObjectURL(response.data);
                    urls.push(url);
                }).catch(error => {
                    console.error("Lỗi khi lấy hình ảnh: " + error.message);
                });

                promises.push(promise);
            }


            await Promise.all(promises);
            setImageUrls(urls);
            setLoading(false);
        };

        if (data.length > 0) {
            setLoading(true);
            fetchImages();
        }
    }, [data]);

    useEffect(() => {
        // Lọc dữ liệu khi có tìm kiếm
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
                        console.log(item);

                    }}
                    className="folder-item"
                >
                    <img src={imageUrls[index]} alt={`Image ${item}`} className="folder-icon" />
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

export default ViewImageInFolder;
