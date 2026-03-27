const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    total: {
        type: Number,
        required: true,
        default: 15000,
        min: 0
    },
    needs: {
        type: Number,
        required: true,
        default: 7500
    },
    wants: {
        type: Number,
        required: true,
        default: 4500
    },
    savings: {
        type: Number,
        required: true,
        default: 3000
    },
    savingsGoal: {
        type: Number,
        default: 3000
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Validate 50/30/20 rule (optional - can be flexible)
budgetSchema.pre('save', function(next) {
    const sum = this.needs + this.wants + this.savings;
    if (Math.abs(sum - this.total) > 1) { // Allow 1 rupee rounding error
        return next(new Error('Budget categories must sum to total budget'));
    }
    next();
});

module.exports = mongoose.model('Budget', budgetSchema);
