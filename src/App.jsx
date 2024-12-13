// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FolderProvider } from "./context/FolderContext";
import FolderList from "./pages/ViewListFolder/ViewListFolder.jsx";
import EditQuyHoach from "./pages/EditQuyHoach/EditQuyHoach.jsx";

function App() {
  return (
    <FolderProvider>
      <Router>
        <Routes>
          <Route path="/listfolders" element={<FolderList />} />
          <Route path="/" element={<EditQuyHoach />} />
        </Routes>
      </Router>
    </FolderProvider>
  );
}

export default App;
