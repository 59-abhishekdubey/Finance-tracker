const Budget = require('../models/Budget');

// @route   GET /api/budget
// @desc    Get user's budget
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        let budget = await Budget.findOne({ userId: req.userId });
        
        // Create default budget if doesn't exist
        if (!budget) {
            budget = await Budget.create({
                userId: req.userId,
                total: 15000,
                needs: 7500,
                wants: 4500,
                savings: 3000,
                savingsGoal: 3000
            });
        }
        
        res.json({
            success: true,
            budget
        });
        
    } catch (error) {
        console.error('Get Budget Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch budget' 
        });
    }
};

// @route   POST /api/budget
// @desc    Create or update budget
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const { total, needs, wants, savings, savingsGoal } = req.body;
        
        // Validation
        if (!total || !needs || !wants || !savings) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide all budget fields' 
            });
        }
        
        // Validate sum
        const sum = Number.parseFloat(needs) + Number.parseFloat(wants) + Number.parseFloat(savings);
        if (Math.abs(sum - Number.parseFloat(total)) > 1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Budget categories must sum to total budget' 
            });
        }
        
        // Update or create
        let budget = await Budget.findOne({ userId: req.userId });
        
        if (budget) {
            // Update existing
            budget.total = total;
            budget.needs = needs;
            budget.wants = wants;
            budget.savings = savings;
            budget.savingsGoal = savingsGoal || savings;
            await budget.save();
        } else {
            // Create new
            budget = await Budget.create({
                userId: req.userId,
                total,
                needs,
                wants,
                savings,
                savingsGoal: savingsGoal || savings
            });
        }
        
        res.json({
            success: true,
            message: 'Budget updated successfully',
            budget
        });
        
    } catch (error) {
        console.error('Update Budget Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update budget' 
        });
    }
};
