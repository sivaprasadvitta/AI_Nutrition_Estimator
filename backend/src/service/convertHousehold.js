
const VOLUME_MAP = {
    cup: 150,       // 150 ml 
    glass: 250,     // 250 ml
    teaspoon: 5,    // 5 ml
    tablespoon: 15, // 15 ml
    teacup: 100     // 100 ml
};

const PIECE_UNITS = ['piece', 'pieces', 'large', 'medium', 'small', 'inch'];

export default function convertHousehold(list) {
  // console.log(list);

    return list.map(({ ingredient, quantity, unit }) => {
      let u = unit.toLowerCase();
      let qty = quantity;
  
      if (u === 'g' || u === 'gram' || u === 'grams') {
        return { ingredient, quantity: qty, unit: 'grams' };
      }
  
      // If it's a recognized volume unit, map to nearest household unit
      //    by converting to ml then dividing by our standard volumes
      for (const [houseUnit, mlPer] of Object.entries(VOLUME_MAP)) {
        if (u.includes(houseUnit)) {
          return { ingredient, quantity: qty, unit: houseUnit };
        }
      }
  
      // piece type
      if (PIECE_UNITS.some(p => u.includes(p))) {
        return { ingredient, quantity: qty, unit: 'pieces' };
      }
  
      console.log(ingredient,qty,unit);
      return { ingredient, quantity: qty, unit: unit };
    });
  }