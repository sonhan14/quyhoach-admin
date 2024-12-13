import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EditQuyHoach from "./pages/EditQuyHoach/EditQuyHoach";
import ViewListFolder from "./pages/ViewListFolder/ViewListFolder";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditQuyHoach />} />
        <Route path="/listfolders" element={<ViewListFolder />} />
      </Routes>
    </Router>
  );
};

export default App;
