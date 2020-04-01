const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        min: 0,
        default: 0
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

creditCardSchema.virtual('links').get(function () {
    return { 'self': `/api/payments/${this._id}` }
});

creditCardSchema.set('toJSON', { virtuals: true })

const CreditCard = new mongoose.model('CreditCard', creditCardSchema);
module.exports = CreditCard;
