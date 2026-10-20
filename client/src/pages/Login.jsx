import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:2000/api/auth/login",
        form,
        { withCredentials: true }
      );
      login(res.data.details);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="box">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;