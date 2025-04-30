
const measurementMap = {
    cup: 150,
    tablespoon: 15,
    teaspoon: 5,
    piece: 50
};

export default function computeTotalNutrition(matched) {
    try {
        const totals = {
            energy_kcal: 0,
            carb_g: 0,
            protein_g: 0,
            fat_g: 0,
            fibre_g: 0
        };

        for (const item of matched) {
            if (!item) continue;

            const {
                energy_kcal = 0,
                carb_g = 0,
                protein_g = 0,
                fat_g = 0,
                fibre_g = 0
            } = item;

            // Normalize unit key 
            const unitKey = item.unit.endsWith('s')
                ? item.unit.slice(0, -1)
                : item.unit;

            // Convert to grams
            let grams = 0;
            if (unitKey === 'gram') {
                grams = item.quantity;
            } else {
                const perUnit = measurementMap[unitKey] || 0;
                grams = perUnit * item.quantity;
            }

            if (grams <= 0) continue;
            const factor = grams / 100;

            totals.energy_kcal += energy_kcal * factor;
            totals.carb_g += carb_g * factor;
            totals.protein_g += protein_g * factor;
            totals.fat_g += fat_g * factor;
            totals.fibre_g += fibre_g * factor;
        }

        for (const key of Object.keys(totals)) {
            totals[key] = Math.round(totals[key] * 100) / 100;
        }

        return totals;
    } catch (err) {
        console.error(` computeTotalNutrition error: ${err.message}`);
        return {
            energy_kcal: NaN,
            carb_g: NaN,
            protein_g: NaN,
            fat_g: NaN,
            fibre_g: NaN
        };
    }
}
