const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'food', 'transport', 'entertainment', 'shopping', 'bills', 
            'healthcare', 'education', 'other', 'salary', 'freelance', 
            'business', 'investment', 'gift', 'refund', 'rental'
        ]
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['income', 'expense'],
        default: 'expense'
    },
    budgetType: {
        type: String,
        enum: ['needs', 'wants', 'savings'],
        default: 'wants'
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
