const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  onsale: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

itemSchema.virtual('links').get(function () {
  return { 'self': `/api/items/${this._id}` }
});

itemSchema.set('toJSON', {
  virtuals: true,
  /* Tämä poistaa owner-tiedot itemiltä JSON-muodossa
  transform: (doc, ret) => {
    delete ret.owner
  }
  */
  
})

const Item = new mongoose.model('Item', itemSchema);
module.exports = Item;
