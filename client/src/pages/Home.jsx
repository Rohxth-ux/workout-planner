import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../authContext";

const API = "http://localhost:2000/api";

const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

const Section = ({ title, type, onAuthError, withCalories }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const handleError = (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) return onAuthError();
    setError(err.response?.data?.message || "Something went wrong");
  };

  const load = async () => {
    try {
      const res = await axios.get(`${API}/${type}`);
      setItems(res.data);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const reset = () => {
    setName("");
    setTime("");
    setCalories("");
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const body = { name, time: time === "" ? undefined : Number(time) };
    if (withCalories) body.calories = calories === "" ? 0 : Number(calories);
    try {
      if (editId) {
        await axios.put(`${API}/${type}/${editId}`, body);
      } else {
        await axios.post(`${API}/${type}`, body);
      }
      reset();
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setName(item.name);
    setTime(item.time ?? "");
    setCalories(item.calories ?? "");
    setError("");
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/${type}/${id}`);
      if (editId === id) reset();
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const totalToday = items
    .filter((i) => isToday(i.createdAt))
    .reduce((sum, i) => sum + (i.calories || 0), 0);

  return (
    <div className="section">
      <h3>{title}</h3>
      {withCalories && (
        <p style={{ fontWeight: "bold" }}>Today's calories: {totalToday} kcal</p>
      )}
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minutes"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {withCalories && (
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        )}
        <button>{editId ? "Update" : "Add"}</button>
        {editId && (
          <button type="button" onClick={reset}>
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {items.map((i) => (
          <li key={i._id}>
            <span>
              {i.name} {i.time ? `(${i.time} min)` : ""}
              {withCalories && i.calories ? ` - ${i.calories} kcal` : ""}
            </span>
            <span>
              <button onClick={() => startEdit(i)}>Edit</button>{" "}
              <button onClick={() => remove(i._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  const doLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (err) {}
    logout();
  };

  return (
    <div className="home">
      <div className="top">
        <h2>Workout Planner</h2>
        <div>
          Hi {user.username} <button onClick={doLogout}>Logout</button>
        </div>
      </div>
      <Section title="Meals" type="meals" onAuthError={doLogout} withCalories />
      <Section title="Routines" type="routines" onAuthError={doLogout} />
    </div>
  );
};

export default Home;