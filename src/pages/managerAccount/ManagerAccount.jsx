import { useState } from "react";
import "./ManagerAccount.css";
import { LuRefreshCw } from "react-icons/lu";
import { TbExclamationMark } from "react-icons/tb";
import Search from "../../components/Search/Search.jsx";

const ManagerAccount = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="container">
      <div className="col-8">
        <div className="search-container">
          <Search />
          <button className="refresh-btn">
            <LuRefreshCw />
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="User Avatar"
              className="avatar"
            />
            <div className={`status ${isOnline ? "online" : "offline"}`} />
          </div>
          <div className="user-details">
            <h4>User name</h4>
            <p>Abcd1423@mail.com</p>
          </div>
          <div className="notifications">
            <button className="notification-btn">
              <TbExclamationMark />
            </button>
          </div>
        </div>
      </div>

      <div className="col-4">
        <div>
          <div className="new-register">Đăng ký mới</div>
          <div>
            <input type="checkbox" />
            <label>Tuần</label>
            <input type="checkbox" />
            <label>Ngày</label>
            <input type="checkbox" />
            <label>Giờ</label>
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="User Avatar"
              className="avatar"
            />
            <div className={`status ${isOnline ? "online" : "offline"}`} />
          </div>
          <div className="user-details">
            <h4>User name</h4>
            <p>Abcd1423@mail.com</p>
            <i>3/12/2024</i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAccount;
