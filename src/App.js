import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPreview from './components/ProductsPreview';
import NoMatch from "./components/NoMatch";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProductsPreview/>} />
          <Route path="*" element={<NoMatch/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
