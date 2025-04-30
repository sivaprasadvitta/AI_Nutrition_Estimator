import React from 'react';

export default function NutritionResult({ data }) {
  const { estimated_nutrition_per_standard_serving, dish_type, standard_serving, ingredients_used } = data;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(estimated_nutrition_per_standard_serving).map(([key, val]) => (
          <div key={key} className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-sm uppercase text-gray-500">{key}</div>
            <div className="text-2xl font-bold">{val}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p><strong>Dish Type:</strong> {dish_type}</p>
        <p><strong>Standard Serving:</strong> {standard_serving}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Ingredients Used:</h3>
        <ul className="list-disc list-inside">
          {ingredients_used.map((ing, idx) => (
            <li key={idx}>{ing.ingredient}: {ing.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
