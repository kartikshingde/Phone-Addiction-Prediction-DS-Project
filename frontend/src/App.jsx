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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setResult("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predictor/predict/",
        form
      );

      setTimeout(() => {
        setLoading(false);

        let level = response.data.addiction_level;
        let message = "";

        if (level === "High Addiction") {
          message = "You are highly addicted to phone usage. 📱🔥";
        } else if (level === "Moderate Addiction") {
          message = "You are moderately addicted to phone usage. ⚖️";
        } else if (level === "Low Addiction") {
          message = "You have a low level of phone addiction. 👍";
        }

        setResult(`✅ ${message}`);
      }, 2500);
    } catch (error) {
      setLoading(false);
      setResult("❌ Error: " + error.message);
    }
  };

  const getUnit = (field) => (field === "data_usage" ? "GB" : "hrs");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-xl  hover:shadow-lg hover:shadow-gray-900 transition-shadow duration-1000">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-700 mb-6">
          📱 Phone Addiction Predictor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["screen_time", "data_usage", "social_media_time", "gaming_time"].map((field) => (
            <div key={field}>
              <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
                {field.replaceAll("_", " ").toUpperCase()}
              </label>
              <div className="flex">
                <input
                  type="number"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.1"
                  required
                />
                <span className="bg-gray-200 px-3 sm:px-4 flex items-center rounded-r-md text-xs sm:text-sm font-medium">
                  {getUnit(field)}
                </span>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 hover:cursor-pointer text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            🔍 Predict
          </button>
        </form>

        {loading && (
          <div className="text-center mt-6 text-indigo-600 font-medium animate-pulse text-sm sm:text-base">
            🤖 Analyzing data using trained AI model ...
          </div>
        )}

        {!loading && result && (
          <h3
            className={`text-center mt-6 text-base sm:text-lg font-semibold ${
              result.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {result}
          </h3>
        )}
      </div>
    </div>
  );
}

export default App;
