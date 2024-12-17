import { Button } from "antd";
import "./Home.css";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="home">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "40px",
        }}
      >
        <Button>
          <Link to="/listfolders">Danh sách thư mực</Link>
        </Button>
        <Button>
          <Link to="/editquyhoach">Sửa quy hoạch</Link>
        </Button>
        <Button>
          <Link to="/imagefolderlist">Danh sách thư mục ảnh</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
