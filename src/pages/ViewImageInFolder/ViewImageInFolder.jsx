import { useEffect, useState, useRef } from "react";
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
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
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
        }, 500);
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

    const handleDownloadImage = () => {
        const link = document.createElement('a');
        link.href = selectedItem;
        link.download = selectedImage.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        const newImageUrl = URL.createObjectURL(event.target.files[0]);
        setSelectedItem(newImageUrl);
    };

    const handleUploadImage = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn một file ảnh để tải lên.");
            return;
        }
        const formData = new FormData();
        formData.append("duongdan", `${full_path}/${selectedImage}`); // Đường dẫn đến ảnh cần sửa
        formData.append("file", selectedFile); // File ảnh mới

        try {
            const response = await axios.post("https://api.quyhoach.xyz/upload_image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const updatedImageUrls = imageUrls.map((url, index) => {
                    return index === data.indexOf(selectedImage) ? URL.createObjectURL(selectedFile) : url;
                });
                setImageUrls(updatedImageUrls);
                closePopup()
            } else {
                alert("Có lỗi xảy ra khi sửa ảnh.");
            }
        } catch (error) {
            console.error("Lỗi khi tải lên ảnh: " + error.message);
            alert("Có lỗi xảy ra khi tải lên ảnh.");
        }
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
                {renderContent(filteredData)}
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <img src={selectedItem} alt="Large View" className="large-image" />
                        <h2>{selectedItem}</h2>
                        <div className="popup-buttons">
                            <button className="delete-button" onClick={handleDeleteImage}>Xóa</button>
                            <button className="download-button" onClick={handleDownloadImage}>Tải về</button>
                            <button className="choose-file-button" onClick={() => fileInputRef.current.click()}>Chọn file</button>
                            <button className="edit-button" onClick={handleUploadImage}>Sửa</button>
                        </div>
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} />
                        <button className="close-popup" onClick={closePopup}>Đóng</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewImageInFolder;
