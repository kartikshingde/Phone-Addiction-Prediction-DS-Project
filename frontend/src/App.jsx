import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    screen_time: "",
    data_usage: "",
    social_media_time: "",
    gaming_time: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const screen = parseFloat(form.screen_time || 0);
    const social = parseFloat(form.social_media_time || 0);
    const gaming = parseFloat(form.gaming_time || 0);

    if (social + gaming > screen) {
      setResult("❌ Social Media + Gaming time can't exceed Screen Time.");
      return;
    }

    setResult("🔄 Predicting...");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predictor/predict/",
        form
      );
      setResult(`✅ You are ${response.data.addiction_level}`);
    } catch (error) {
      setResult("❌ Error: " + error.message);
    }
  };

  const getUnit = (field) => {
    if (field === "data_usage") return "GB";
    return "hrs";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📱 Phone Addiction Predictor</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {["screen_time", "data_usage", "social_media_time", "gaming_time"].map(
          (field) => (
            <div key={field} style={styles.inputGroup}>
              <label style={styles.label}>
                {field.replaceAll("_", " ").toUpperCase()}:
              </label>
              <div style={styles.inputWithUnit}>
                <input
                  type="number"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  style={styles.input}
                  step="0.1"
                  required
                />
                <span style={styles.unit}>{getUnit(field)}</span>
              </div>
            </div>
          )
        )}
        <button type="submit" style={styles.button}>
          🔍 Predict
        </button>
      </form>
      {result && (
        <h3
          style={{
            ...styles.result,
            color: result.startsWith("❌") ? "#dc3545" : "#28a745",
          }}
        >
          {result}
        </h3>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "50px auto",
    backgroundColor: "#f4f6f8",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  inputWithUnit: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px 0 0 5px",
    flex: 1,
  },
  unit: {
    backgroundColor: "#eee",
    padding: "10px 15px",
    border: "1px solid #ccc",
    borderLeft: "none",
    borderRadius: "0 5px 5px 0",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  result: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default App;
