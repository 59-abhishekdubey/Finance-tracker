const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', budgetController.getBudget);
router.post('/', budgetController.updateBudget);

module.exports = router;
