import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:2000/api";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Light (1-3 days/week)", value: 1.375 },
  { label: "Moderate (3-5 days/week)", value: 1.55 },
  { label: "Active (6-7 days/week)", value: 1.725 },
];

const getCategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

const Bmi = () => {
  const saved = JSON.parse(localStorage.getItem("bmiForm")) || {};
  const [form, setForm] = useState({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activity: 1.375,
    goal: "maintain",
    ...saved,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [todayCalories, setTodayCalories] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/meals`)
      .then((res) => {
        const total = res.data
          .filter((m) => isToday(m.createdAt))
          .reduce((sum, m) => sum + (m.calories || 0), 0);
        setTodayCalories(total);
      })
      .catch(() => {});
  }, []);

  const set = (key, value) => setForm({ ...form, [key]: value });

  const calculate = (e) => {
    e.preventDefault();
    setError("");
    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (!age || age < 10 || age > 100) return setError("Enter a valid age (10-100)");
    if (!height || height < 100 || height > 250)
      return setError("Enter a valid height in cm (100-250)");
    if (!weight || weight < 20 || weight > 300)
      return setError("Enter a valid weight in kg (20-300)");

    localStorage.setItem("bmiForm", JSON.stringify(form));

    const bmi = weight / ((height / 100) * (height / 100));
    const bmr =
      10 * weight + 6.25 * height - 5 * age + (form.gender === "male" ? 5 : -161);
    const maintenance = bmr * Number(form.activity);
    let target = maintenance;
    if (form.goal === "lose") target = maintenance - 500;
    if (form.goal === "gain") target = maintenance + 500;
    target = Math.max(1200, target);

    setResult({
      bmi: bmi.toFixed(1),
      category: getCategory(bmi),
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      target: Math.round(target),
    });
  };

  const percent = result
    ? Math.min(100, Math.round((todayCalories / result.target) * 100))
    : 0;

  return (
    <div className="home">
      <div className="card">
        <h2>BMI & Daily Calorie Calculator</h2>
        <form onSubmit={calculate}>
          <label>Gender</label>
          <select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Age (years)</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
          />

          <label>Height (cm)</label>
          <input
            type="number"
            value={form.height}
            onChange={(e) => set("height", e.target.value)}
          />

          <label>Weight (kg)</label>
          <input
            type="number"
            value={form.weight}
            onChange={(e) => set("weight", e.target.value)}
          />

          <label>Activity level</label>
          <select
            value={form.activity}
            onChange={(e) => set("activity", e.target.value)}
          >
            {activityLevels.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>

          <label>Goal</label>
          <select value={form.goal} onChange={(e) => set("goal", e.target.value)}>
            <option value="lose">Lose weight</option>
            <option value="maintain">Maintain weight</option>
            <option value="gain">Gain weight</option>
          </select>

          <button>Calculate</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h3>Your result</h3>
          <p>
            <b>BMI:</b> {result.bmi} ({result.category})
          </p>
          <p>
            <b>BMR:</b> {result.bmr} kcal/day
          </p>
          <p>
            <b>Maintenance calories:</b> {result.maintenance} kcal/day
          </p>
          <p>
            <b>Daily target for your goal:</b> {result.target} kcal/day
          </p>

          <p>
            <b>Today's meals:</b> {todayCalories} of {result.target} kcal ({percent}%)
          </p>
          <div className="bar">
            <div style={{ width: `${percent}%` }} />
          </div>

          <p className="note">
            These are estimates (BMI categories: WHO; BMR: Mifflin-St Jeor). They are not
            medical advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bmi;