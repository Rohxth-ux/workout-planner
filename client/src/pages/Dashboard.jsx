import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:2000/api";

const lastDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

const sameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();

const Bars = ({ title, data, unit, color }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="chart">
        {data.map((d) => (
          <div className="col" key={d.label}>
            <span className="val">{d.value}</span>
            <div
              className="barv"
              style={{ height: `${(d.value / max) * 140}px`, background: color }}
            />
            <span className="lab">{d.label}</span>
          </div>
        ))}
      </div>
      <p className="note">{unit}, last 7 days</p>
    </div>
  );
};

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    axios.get(`${API}/meals`).then((r) => setMeals(r.data)).catch(() => {});
    axios.get(`${API}/routines`).then((r) => setRoutines(r.data)).catch(() => {});
  }, []);

  const days = lastDays(7);
  const label = (d) =>
    d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });

  const calData = days.map((d) => ({
    label: label(d),
    value: meals
      .filter((m) => sameDay(m.createdAt, d))
      .reduce((s, m) => s + (m.calories || 0), 0),
  }));
  const minData = days.map((d) => ({
    label: label(d),
    value: routines
      .filter((r) => sameDay(r.createdAt, d))
      .reduce((s, r) => s + (r.time || 0), 0),
  }));

  const totalCal = calData.reduce((s, d) => s + d.value, 0);
  const totalMin = minData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="home">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat"><b>{meals.length}</b><span>Meals</span></div>
        <div className="stat"><b>{routines.length}</b><span>Routines</span></div>
        <div className="stat"><b>{Math.round(totalCal / 7)}</b><span>Avg kcal / day</span></div>
        <div className="stat"><b>{totalMin}</b><span>Workout min (7 days)</span></div>
      </div>
      <Bars title="Calories per day" data={calData} unit="kcal" color="#e65100" />
      <Bars title="Workout minutes per day" data={minData} unit="minutes" color="#1b7a43" />
    </div>
  );
};

export default Dashboard;