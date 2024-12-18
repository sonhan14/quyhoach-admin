// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FolderList from "./pages/ViewListFolder/ViewListFolder.jsx";
import EditQuyHoach from "./pages/EditQuyHoach/EditQuyHoach.jsx";
import ManagerAccount from "./pages/managerAccount/ManagerAccount.jsx";
import VipUpgrade from "./pages/VipUpgrade/VipUpgrade.jsx";

import ImageListFolder from "./pages/ViewListImage/ViewListImage.jsx";
import Home from "./pages/Home/index.jsx";
import ViewImageInFolder from "./pages/ViewImageInFolder/ViewImageInFolder.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listfolders" element={<FolderList />} />
        <Route path="/editquyhoach" element={<EditQuyHoach />} />
        <Route path="/manageraccount" element=<ManagerAccount /> />
        <Route path="/vipupgrade" element={<VipUpgrade />} />
        <Route path="/imagefolderlist" element={<ImageListFolder />} />
        <Route
          path="/viewimageinfolder/:city/:level/:id"
          element={<ViewImageInFolder />}
        />
      </Routes>
    </Router>
  );
}

export default App;
