import express from 'express';

import { getNutrition } from '../controllers/nutritionController.js';


const router = express.Router();
router.post('/nutrition', getNutrition);

export default router;