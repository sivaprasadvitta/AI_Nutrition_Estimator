import stringSimilarity from 'string-similarity';
import CATEGORY_TABLE from '../models/category.js'


const INGREDIENT_KEYWORDS = {
  'Non - Veg Gravy': ['chicken', 'mutton', 'fish', 'prawn', 'egg'],
  'Veg Gravy':       ['curry', 'paneer', 'tofu', 'cauliflower', 'potato'],
  'Dry Rice Item':   ['rice'],
  'Dals':            ['dal', 'lentil'],
  'Veg Fry':         ['bhaji', 'stir-fry'],
  'Salads':          ['lettuce','cucumber','salad'],
  'Chutneys':        ['chutney'],
  'Raita':           ['yogurt','raita','curd'],
  'Sweets':          ['sugar','honey']
};

export default function getDishCategory(mapped) {
  // console.log(mapped)
  try {
    const present = mapped
      .filter(i => i.matched)
      .map(i => i.ingredient.toLowerCase());

    // 1) Keyword match categories by ingredient presence
    for (const [category, keys] of Object.entries(INGREDIENT_KEYWORDS)) {
      if (keys.some(k => present.some(ing => ing.includes(k)))) {
        return category;
      }
    }

    // 2) Fallback: if contains 'rice' and non-veg => Non - Veg Gravy
    const hasRice = present.some(ing => ing.includes('rice'));
    const hasProtein = present.some(ing => INGREDIENT_KEYWORDS['Non - Veg Gravy']
      .some(k => ing.includes(k)));
    if (hasRice && hasProtein) {
      return 'Non - Veg Gravy';
    }

    // 3) Fuzzy match against category names
    const catNames = CATEGORY_TABLE.map(c => c.name.toLowerCase());
    const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(
      present.join(' '), catNames
    );
    if (bestMatch.rating > 0.3) {
      return CATEGORY_TABLE[bestMatchIndex].name;
    }
    // console.log("from fish catogry")

    return 'Other';
  } catch {
    return 'Other';
  }
}
