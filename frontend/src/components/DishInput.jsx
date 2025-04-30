import React, { useState } from 'react';

export default function DishInput({ onSubmit, loading }) {
  const [dish, setDish] = useState('');

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={dish}
        onChange={e => setDish(e.target.value)}
        className="flex-grow border rounded-lg p-2 focus:outline-none"
        placeholder="Enter dish name"
      />
      <button
        onClick={() => dish.trim() && onSubmit(dish.trim())}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
      >
        {loading ? 'Estimating...' : 'Estimate'}
      </button>
    </div>
  );
}