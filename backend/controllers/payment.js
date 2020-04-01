const CreditCard = require('../models/creditcard')
const User = require('../models/user')
const Item = require('../models/item')

const errorMessage = { 'status': 'error' }

module.exports = {

  async purchase(req, res) {
    const { sellerCCid, buyerCCid, itemId } = req.body
    if (!sellerCCid || !buyerCCid || !itemId) {
      errorMessage.error = 'The following fields are required: sellerCCid, buyerCCid, itemId'
      return res.status(400).json(errorMessage)
    } else {
      try {
        // find buyers credit card information
        const buyerCC = await CreditCard.findOne({ _id: buyerCCid })

        // find seller credit card information
        const sellerCC = await CreditCard.findOne({ _id: sellerCCid })
        
        // check that the item with id is found and the owner is the seller
        const item = await Item.findOne({ _id: itemId, owner: sellerCC.owner._id })

        // calculate new balances and change item owner
        buyerCC.balance -= item.price
        if (buyerCC.balance < 0) {
          throw new Error(`Credit card - ${buyerCC.number} has insufficient funds`);
        }
        sellerCC.balance += item.price
        item.owner = buyerCC.owner
        item.onsale = false

        // finally save changes
        await buyerCC.save()
        await sellerCC.save()
        await item.save()
        return res.status(200).json({ 'status': 'success' })

      } catch (err) {
        console.error(err)
        errorMessage.error = err.message
        return res.status(500).json(errorMessage)
      }
    }

  },

  async createCard(req, res) {
    const { number, owner} = req.body
    if (number && owner) {
      console.log('Adding card', number)
      const newCard = new CreditCard({
        number,
        owner
      })
      try {
        const user = await User.findOne({ _id: owner })
        if (!user) {
          errorMessage.error = `User matching the owner-field (${owner}) was not found`
          return res.status(400).json(errorMessage)
        }
        const card = await newCard.save()
        user.creditcard = card._id
        await user.save()
        console.log('Inserted 1 document into the collection')
        return res.status(201).json(newCard)
      } catch (err) {
        errorMessage.error = err.message
        return res.status(500).json(errorMessage)
      }
    } else {
      errorMessage.error = 'The following fields are required: number, owner'
      return res.status(400).json(errorMessage)
    }
  },

  async listCards(req, res) {
    const cards = await CreditCard.find({})
        .sort('_id')
    return res.status(200).json(cards)
  },

  async showCard(req, res) {
    try {
      const card = await CreditCard.findOne({ _id: req.params.id })
          .populate('owner')
      if (!card) {
        errorMessage.error = `CreditCard with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      res.set('Location', `/api/payments/${card._id}`)
      return res.status(200).json(card)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(500).json(errorMessage)
    }
  },

  async updateCard(req, res) {
    const { balance } = req.body
    if (!balance && balance !== 0) {
      errorMessage.error = 'The following information is required on update: balance'
      return res.status(400).json(errorMessage)
    }
    try {
      const card = await CreditCard.findByIdAndUpdate(req.params.id, { balance }, { new: true, runValidators: true })
          .populate('owner')
      if (!card) {
        errorMessage.error = `CreditCard with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      res.set('Location', `/api/payments/${card._id}`)
      console.log('Card updated')
      return res.status(200).json(card)
    } catch (err) {
      errorMessage.error = err.message
      return res.status(500).json(errorMessage)
    }
  },

  async deleteCard(req, res) {
    try {
      const card = await CreditCard.findByIdAndDelete(req.params.id)
      if (!card) {
        errorMessage.error = `CreditCard with ID: ${req.params.id} was not found`
        return res.status(404).json(errorMessage)
      }
      await User.findOneAndUpdate({ creditcard: card._id }, { creditcard: null })
      return res.status(200).json({ status: 'success', deleted: card })
    } catch (err) {
      errorMessage.error = err.message
      return res.status(500).json(errorMessage)
    }
  }

}