
import convertHousehold from '../service/convertHousehold.js';
import getOpenAiResponse from '../service/openAi.js';
import mapToNutritionFromExcel from '../service/mapToNutritionFromExcel.js';
import computeTotalNutrition from '../service/computeTotalNutrition.js';
import getDishCategory from '../service/getDishCategory.js';
import CATEGORY_TABLE from '../models/category.js'


export const getNutrition = async (req, res) => {
  const { dish } = req.body;
  // console.log(dish);
  try {
    //  Fetch & parse recipe
    const raw = await getOpenAiResponse(dish);
    const ingredientsList = JSON.parse(raw);
    if (!Array.isArray(ingredientsList)) throw new Error('Invalid recipe format');

    //  Normalize household measurements
    const normalized = convertHousehold(ingredientsList);
    if (normalized.length === 0) throw new Error('No ingredients after normalization');

    //  Map to nutrition DB
    const matched = await mapToNutritionFromExcel(normalized);
    if (matched.every(i => !i.matched)) console.warn('No ingredients matched DB');

    //  Compute total raw nutrition
    const totals = computeTotalNutrition(matched);

    //  Identify dish category
    const categoryName = getDishCategory(matched);
    const categoryInfo = CATEGORY_TABLE.find(c => c.name === categoryName)
      || { name: 'Other', unit: 'grams', weight_g: 100 };

    //  Calculate total cooked weight (approx)
    const measurementMap = { cup:150, tablespoon:15, teaspoon:5, piece:50 };
    const totalGrams = matched.reduce((sum, { unit, quantity }) => {
      const key = unit.replace(/s$/,'');
      return sum + (key === 'gram'
        ? quantity
        : (measurementMap[key]||0) * quantity);
    }, 0) || categoryInfo.weight_g;

    //  Scale to standard serving
    const factor = categoryInfo.weight_g / totalGrams;
    const perServe = {
      calories: Math.round(totals.energy_kcal * factor),
      protein:  Math.round(totals.protein_g   * factor),
      carbs:    Math.round(totals.carb_g      * factor),
      fat:      Math.round(totals.fat_g       * factor),
      fiber:    Math.round(totals.fibre_g     * factor)
    };

    return res.json({
      estimated_nutrition_per_standard_serving: perServe,
      dish_type: categoryName,
      standard_serving: `${categoryInfo.weight_g}g (${categoryInfo.unit})`,
      ingredients_used: normalized.map(i => ({
        ingredient: i.ingredient,
        quantity:   `${i.quantity} ${i.unit}`
      }))
    });

  } catch (err) {
    console.error('getNutrition error:', err);
    return res.status(500).json({ error: err.message });
  }
};
