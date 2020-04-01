const Item = require('../models/item')
const User = require('../models/user')

const errorMessage = { status: 'error' }

module.exports = {

  async createItem(req, res) {
    const { name, price, description, onsale, owner } = req.body
    if (name && price && owner) {
      console.log('Adding item', req.body.name);
      const newItem = new Item({
        name,
        price,
        description,
        onsale,
        owner
      })
      try {
        const user = await User.findOne({ _id: owner })
        if (!user) {
          errorMessage.error = `User matching the owner-field (${owner}) was not found`
          return res.status(400).json(errorMessage)
        }
        const item = await newItem.save()
        await Item.populate(item, 'owner')
        console.log('Inserted 1 document into the collection')
        return res.status(201).json(item)
      } catch (err) {
        errorMessage.error = err.message
        return res.status(500).json(errorMessage)
      }
    } else {
      errorMessage.error = 'The following fields are required: name, price, owner'
      return res.status(400).json(errorMessage);
    }
  },

  async listItems(req, res) {
    const items = await Item.find({})
      .sort('name')
      .populate('owner')
    return res.status(200).json(items)
  },

  async listOffers(req, res) {
    try {
      const items = await Item.find({ onsale: true })
        .populate('owner')
      const offers = items.filter((item) => item.owner.role === 'normal')
      return res.status(200).json(offers)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async listSales(req, res) {
    try {
      const items = await Item.find({ onsale: true })
          .populate('owner')
      const sales = items.filter((item) => item.owner.role === 'shopkeeper')
      return res.status(200).json(sales)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async listOffersByUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
      if (!user) {
        errorMessage.error = `User with ID: (${req.params.id}) was not found`
        return res.status(400).json(errorMessage)
      }
      const offers = await Item.find({ onsale: true, owner: req.params.id })
      return res.status(200).json(offers)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async listByUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
      if (!user) {
        errorMessage.error = `User with ID: (${req.params.id}) was not found`
        return res.status(400).json(errorMessage)
      }
      const items = await Item.find({ owner: req.params.id })
      return res.status(200).json(items)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async showItem(req, res) {
    try {
      const item = await Item.findOne({ _id: req.params.id })
        .populate('owner')
      if (!item) {
        errorMessage.error = `Item with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      res.set('Location', `/api/items/${item._id}`)
      return res.status(200).json(item)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async updateItem(req, res) {
    try {
      const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate('owner')
      if (!item) {
        errorMessage.error = `Item with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      res.set('Location', `/api/items/${item._id}`)
      console.log('Item updated')
      return res.status(200).json(item)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(404).json(errorMessage)
    }
  },

  async deleteItem(req, res) {
    try {
      const item = await Item.findByIdAndDelete(req.params.id)
      if (!item) {
        errorMessage.error = `Item with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      console.log('Item deleted')
      return res.status(200).json({ status: 'success', deleted: item })
    } catch (err) {
      errorMessage.errors = err.errors
      return res.status(500).json(errorMessage)
    }
  },

  async deleteItemsByUser(req, res) {
    try {
      const items = await Item.deleteMany({ owner: req.params.id })
      return res.status(200).json({ status: 'success', deleted: items })
    } catch (err) {
      errorMessage.errors = err.errors
      return res.status(500).json(errorMessage)
    }
  }

}