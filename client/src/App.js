import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import axios from "axios";
import { AuthProvider, AuthContext } from "./authContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Bmi from "./pages/Bmi";
import Dashboard from "./pages/Dashboard";
import "./style.css";

axios.defaults.withCredentials = true;

const Layout = ({ children }) => (
  <>
    <nav className="nav">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/bmi">BMI & Calories</NavLink>
    </nav>
    {children}
  </>
);

const Private = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Private><Home /></Private>} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/bmi" element={<Private><Bmi /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;