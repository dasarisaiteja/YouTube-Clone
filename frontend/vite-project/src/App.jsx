import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';
import Channel from './pages/Channel';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <div className="main-content">
                  <Sidebar isOpen={sidebarOpen} />
                  <div className={`page-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/watch/:id" element={<Watch />} />
                      <Route path="/channel/:id" element={<Channel />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}