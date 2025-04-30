import React, { useState } from 'react';
import DishInput from './components/DishInput.jsx';
import NutritionResult from './components/NutritionResult.jsx';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(dishName) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://ai-nutrition-estimator.onrender.com/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dish :dishName })
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">AI Nutrition Estimator</h1>
        <DishInput onSubmit={handleSubmit} loading={loading} />
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {result && <NutritionResult data={result} />}
      </div>
    </div>
  );
}
