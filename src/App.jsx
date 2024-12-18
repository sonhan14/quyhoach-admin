// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FolderList from "./pages/ViewListFolder/ViewListFolder.jsx";
import EditQuyHoach from "./pages/EditQuyHoach/EditQuyHoach.jsx";
import ManagerAccount from "./pages/managerAccount/ManagerAccount.jsx";
import VipUpgrade from "./pages/VipUpgrade/VipUpgrade.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/editquyhoach" />} />
        <Route path="/listfolders" element={<FolderList />} />
        <Route path="/editquyhoach" element={<EditQuyHoach />} />
        <Route path="/manageraccount" element=<ManagerAccount /> />
        <Route path="/vipupgrade" element={<VipUpgrade />} />
      </Routes>
    </Router>
  );
}

export default App;
