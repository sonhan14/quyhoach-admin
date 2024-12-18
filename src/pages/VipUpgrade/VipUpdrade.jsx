import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./VipUpgrade.css";

const VipUpgrade = () => {
  const features = [
    "Không giới hạn các tính năng trên App và Website landInvest",
    "Kiểm tra quy hoạch đất đai trên 63 tỉnh thành.",
    "Xem vị trí số thửa đất, xem quy hoạch thửa đất.",
    "Đề xuất diện tích và kích thước thửa đất.",
    "Tìm thửa đất theo góc nhìn.",
    "Tìm thửa đất trên sổ theo số thửa.",
    "Xem các dạng đất đai như: QH 2030, QH 2024, QH kế hoạch, QH phân khu,…",
    "Được yêu cầu thông tin về bản đồ và các bên có nhu cầu.",
    "Được nhận VIP 30 ngày cho tài khoản đăng ký trên landInvest.",
    "Được khai thác thông tin từ tài khoản khách hàng như: cho thuê, mua và thừa đất trên landInvest.",
    "Đăng kiểm tra quyền sử dụng vị trí thửa đất và thuê chuyển viên landInvest tư vấn.",
    "Tặng tài khoản VIP cho thành viên đưa 100 thửa đất công khai trên bản đồ landInvest.",
  ];

  const packages = [
    { duration: "1 tháng", price: "150.000 VND", color: "green" },
    { duration: "3 tháng", price: "400.000 VND", color: "red" },
    { duration: "6 tháng", price: "600.000 VND", color: "blue" },
    { duration: "1 năm", price: "1.000.000 VND", color: "purple" },
  ];

  const highlightLand = (text) => {
    return text.split("land").map((part, index, arr) => (
      <React.Fragment key={index}>
        {part}
        {index < arr.length - 1 && <span className="land-highlight">land</span>}
      </React.Fragment>
    ));
  };

  return (
    <div className="upgrade-container">
      <h2 className="upgrade-title">
        Nâng cấp VIP để sử dụng tất cả tính năng của{" "}
        <span>
          <span className="land">land</span>
          <span className="invest">Invest</span>
        </span>
      </h2>
      <div className="col">
        <div className="upgrade-description-container">
          <h3 className="upgrade-description">
            Với gói VIP của{" "}
            <span>
              <span className="land">land</span>
              <span className="invest">Invest</span>
            </span>
            , bạn sẽ được:
          </h3>
          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index} className="feature-item">
                <FaCheckCircle
                  className="icon-check"
                  style={{ color: "#19c719" }}
                />
                <span> {highlightLand(feature)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="package-container">
          {packages.map((pkg, index) => (
            <div key={index} className={`package package-${pkg.color}`}>
              <div className="package-content">
                <h3>{pkg.duration}</h3>
                <p className="price">{pkg.price}</p>
              </div>
              <button className="vip-button">Nạp VIP</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipUpgrade;
