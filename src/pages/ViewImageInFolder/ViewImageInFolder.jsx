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
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    let longPressTimer = null;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append("duongdan", `${city}/${level}/${id}`);

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

                    const sortedPngList = png_list.sort((a, b) => {
                        const numA = parseInt(a.split('.')[0], 10);
                        const numB = parseInt(b.split('.')[0], 10);
                        return numA - numB;
                    });

                    setData(sortedPngList);
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
        if (searchTerm) {
            const filtered = data.filter((item) => {
                return item.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setFilteredData(filtered || []);
        } else {
            setFilteredData(data || []);
        }
    }, [searchTerm, data]);

    const handleItemPressStart = (item) => {
        longPressTimer = setTimeout(() => {
            setIsSelecting(true);
            setSelectedItems((prev) => {
                if (!prev.includes(item)) {
                    return [...prev, item];
                }
                return prev;
            });
        }, 500); // Thời gian để xác định long press
    };

    const handleDeleteSelected = async () => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa ảnh?");
        if (!confirmDelete) {
            return;
        }

        try {
            for (const item of selectedItems) {
                const formData = new FormData();
                formData.append("duongdan", `${full_path}/${item}`);

                await axios.post("https://api.quyhoach.xyz/remove_anh_folder", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            setData((prev) => prev.filter(item => !selectedItems.includes(item)));
            setSelectedItems([]);
        } catch (error) {
            console.error("Lỗi khi xóa hình ảnh: " + error.message);
        }
    };

    const handleDeleteImage = async () => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa ảnh?");
        if (!confirmDelete) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("duongdan", `${full_path}/${selectedImage}`);

            await axios.post("https://api.quyhoach.xyz/remove_anh_folder", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setData((prev) => prev.filter(item => item !== selectedItem.split('/').pop()));
            closePopup();
        } catch (error) {
            console.error("Lỗi khi xóa hình ảnh: " + error.message);
        }
    };


    const handleExitSelection = () => {
        setIsSelecting(false);
        setSelectedItems([]);
    };

    const handleItemClick1 = (item, image) => {
        clearTimeout(longPressTimer);
        setSelectedItem(image);
        setIsPopupOpen(true);
        setSelectedImage(item)
    }

    const handleItemClick = (item) => {
        clearTimeout(longPressTimer);
        setSelectedItems((prev) => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item);
            } else {
                return [...prev, item];
            }
        });

    };


    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedItem(null);
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
            return (
                <div
                    key={index}
                    onMouseDown={() => handleItemPressStart(item)}
                    onMouseUp={() => { isSelecting ? handleItemClick(imageUrls[index]) : handleItemClick1(item, imageUrls[index]) }}
                    onMouseLeave={() => clearTimeout(longPressTimer)}
                    className="folder-item"
                >
                    <img src={imageUrls[index]} alt={`Image ${item}`} className="folder-icon" />
                    <span className="folder-text">
                        {item}
                    </span>
                    {isSelecting && (
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <div className="folder-list-container">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {isSelecting && (
                <div className="button-check-container">
                    <button className="delete-button-check" onClick={handleDeleteSelected}>Xóa</button>
                    <button className="exit-button" onClick={handleExitSelection}>Thoát</button>
                </div>
            )}
            <div className="folder-items-container">
                {renderContent(filteredData)} {/* Luôn hiển thị dữ liệu quy hoạch 2024 */}
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <img src={selectedItem} alt="Large View" className="large-image" />
                        <h2>{selectedItem}</h2>
                        <div className="popup-buttons">
                            <button className="delete-button" onClick={handleDeleteImage}>Xóa</button>
                            <button className="download-button">Tải về</button>
                            <button className="edit-button">Sửa</button>
                        </div>
                        <button className="close-popup" onClick={closePopup}>Đóng</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewImageInFolder;
