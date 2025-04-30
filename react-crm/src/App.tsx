import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route
            path='/'
            element={
              isLoggedIn ? (hasSelectedCompany ? (<Home />) : (<Navigate to='/company' />)) : (<Login />)
            }
          /> */}
          {/* <Route path='*' element={isLoggedIn ? <Home /> : <Login />} /> */}
          <Route path="*" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/app/admin/users" element={<AdminUsers />} />
          {/* <Route path="/" element={<Navigate to="/contacts" replace />} /> */}
          {/* <Route
            path='/'
            element={isLoggedIn ? <Home /> : <Login />
            // <Navigate to='/login' />
          }
          >
          </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
