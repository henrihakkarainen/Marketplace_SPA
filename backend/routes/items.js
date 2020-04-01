const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const ItemController = require('../controllers/item')

router
  .route('/items')
  .all(auth.verifyAuth)
  .get(auth.ensureAdmin, ItemController.listItems) // lists all items from the database
  .post(ItemController.createItem) // creates a new item to the database

router
  .route('/items/:id([a-f0-9]{24})')
  .all(auth.verifyAuth)
  .get(ItemController.showItem) // get information about a specific item by id
  .put(ItemController.updateItem) // modify a specific item by id
  .delete(ItemController.deleteItem) // delete a specific item from the database by id

router
  .route('/items/users/:id([a-f0-9]{24})')
  .all(auth.verifyAuth, auth.ensureSelf)
  .get(ItemController.listByUser) // list all items that belong to a specific user
  .delete(ItemController.deleteItemsByUser) // delete all items that belong to a specific user

router
  .route('/items/users/:id([a-f0-9]{24})/offers')
  .all(auth.verifyAuth, auth.ensureSelf)
  .get(ItemController.listOffersByUser) // list all items that belong to a specific user and are listed for sale

router
  .route('/items/offers')
  .all(auth.verifyAuth, auth.ensureShopkeeper)
  .get(ItemController.listOffers) // list items that are owned by registered users and are listed for sale

router
  .route('/items/onsale')
  .get(ItemController.listSales) // list items that are owned by shopkeepers and are listed for sale

module.exports = router