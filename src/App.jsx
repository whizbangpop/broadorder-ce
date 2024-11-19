// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CafePage from './pages/CafePage';
// import MenuEditor from './pages/MenuEditor';
import OrderPage from './pages/OrderPage';
import ModifiersEditor from './pages/ModifiersEditor';
import MenuEditor from './pages/MenuEditorNew';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cafe" element={ <CafePage /> } />
        <Route path="/edit" element={ <MenuEditor /> } />
        <Route path="/order" element={ <OrderPage /> } />
        <Route path="/mods" element={ <ModifiersEditor /> } />
      </Routes>
    </Router>
  );
}

export default App;
