import React, { useEffect, useState } from "react";
import axios from "axios";
import imgFolder from "../../assets/folder.png";
import Search from "../../components/Search/Search.jsx";
import "./ViewListFolder.css";

const FolderList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.quyhoach.xyz/liet_ke_thu_muc_chua_add_quyhoach")
      .then((response) => {
        setData(response.data.quyhoach);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu: ", error);
      });
  }, []);

  const handleItemClick = (item) => {
    console.log("Đường dẫn API: ", item);
  };

  return (
    <div className="folder-list-container">
      <Search />
      <div className="folder-items-container">
        {data.map((item, index) => {
          const parts = item.split("/");
          const province = parts[5];
          const district = parts[6];
          return (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="folder-item"
            >
              <img src={imgFolder} alt="Folder Icon" className="folder-icon" />
              <span className="folder-text">
                Quy hoạch {province} - {district}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FolderList;
