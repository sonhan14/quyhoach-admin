// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FolderList from "./pages/ViewListFolder/ViewListFolder.jsx";
import EditQuyHoach from "./pages/EditQuyHoach/EditQuyHoach.jsx";
import ImageListFolder from "./pages/ViewListImage/ViewListImage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/editquyhoach" />} />
        <Route path="/listfolders" element={<FolderList />} />
        <Route path="/editquyhoach" element={<EditQuyHoach />} />
        <Route path="/imagefolderlist" element={<ImageListFolder />} />
      </Routes>
    </Router>
  );
}

export default App;
