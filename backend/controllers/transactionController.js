const Transaction = require('../models/Transaction');

// @route   GET /api/transactions
// @desc    Get all transactions for logged-in user
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, category, type } = req.query;
        
        // Build query
        const query = { userId: req.userId };
        
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        if (category) {
            query.category = category;
        }
        
        if (type) {
            query.transactionType = type;
        }
        
        const transactions = await Transaction.find(query)
            .sort({ date: -1, createdAt: -1 })
            .limit(1000); // Safety limit
        
        res.json({
            success: true,
            count: transactions.length,
            transactions
        });
        
    } catch (error) {
        console.error('Get Transactions Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch transactions' 
        });
    }
};

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
exports.createTransaction = async (req, res) => {
    try {
        const { amount, category, transactionType, budgetType, description, date } = req.body;
        
        // Validation
        if (!amount || !category || !transactionType || !date) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide amount, category, type, and date' 
            });
        }
        
        const transaction = await Transaction.create({
            userId: req.userId,
            amount,
            category,
            transactionType,
            budgetType: budgetType || 'wants',
            description: description || '',
            date
        });
        
        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction
        });
        
    } catch (error) {
        console.error('Create Transaction Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create transaction' 
        });
    }
};

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!transaction) {
            return res.status(404).json({ 
                success: false, 
                error: 'Transaction not found' 
            });
        }
        
        // Update fields
        const allowedUpdates = ['amount', 'category', 'transactionType', 'budgetType', 'description', 'date'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                transaction[field] = req.body[field];
            }
        });
        
        await transaction.save();
        
        res.json({
            success: true,
            message: 'Transaction updated successfully',
            transaction
        });
        
    } catch (error) {
        console.error('Update Transaction Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update transaction' 
        });
    }
};

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!transaction) {
            return res.status(404).json({ 
                success: false, 
                error: 'Transaction not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Transaction Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete transaction' 
        });
    }
};
