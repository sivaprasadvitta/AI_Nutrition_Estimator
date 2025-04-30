
import ExcelJS from 'exceljs';
import stringSimilarity from 'string-similarity';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const excelPath = path.resolve(__dirname, '..', '..', 'data', 'Assignment_Inputs.xlsx');
// console.log('path: ', excelPath);

async function loadNutritionData() {
  if (!fs.existsSync(excelPath)) {
    throw new Error(`File not found: ${excelPath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  const sheet = workbook.worksheets[0];

  const rows = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const vals = row.values.slice(1);
    rows.push({
      food_code:                vals[0],
      food_name:                String(vals[1]).toLowerCase(),
      energy_kcal:              vals[7],
      carb_g:                   vals[8],
      protein_g:                vals[9],
      fat_g:                    vals[10],
      freesugar_g:              vals[11],
      fibre_g:                  vals[12],
      cholesterol_mg:           vals[13],
      servings_unit:            vals[42],
      unit_serving_energy_kcal: vals[44],
      unit_serving_carb_g:      vals[45],
      unit_serving_protein_g:   vals[46],
      unit_serving_fat_g:       vals[47],
      unit_serving_fibre_g:     vals[49]
    });
  });

  return rows;
}

export default async function mapToNutritionFromExcel(normalized) {
  try {
    const data  = await loadNutritionData();
    const names = data.map(d => d.food_name);

    return normalized.map(item => {
      const key = item.ingredient.toLowerCase();
      let match = data.find(d => d.food_name === key)
               || data.find(d => d.food_name.includes(key))
               || (() => {
                    const { bestMatch, bestMatchIndex } =
                      stringSimilarity.findBestMatch(key, names);
                    return bestMatch.rating > 0.5 ? data[bestMatchIndex] : null;
                  })();

      return {
        ingredient: item.ingredient,
        quantity:   item.quantity,
        unit:       item.unit,
        matched:    !!match,
        warning:    match ? null : `No match for "${item.ingredient}"`,
        ...(match || {})
      };
    });
  } catch (err) {
    console.error(` mapToNutritionFromExcel error: ${err.message}`);
    return err.message;
    // Return original list with errors
    // return normalized.map(item => ({
    //   ...item,
    //   matched: false,
    //   warning: `Mapping failed: ${err.message}`
    // }));
  }
}
