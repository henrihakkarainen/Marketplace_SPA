const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const PaymentController = require('../controllers/payment');

router
  .route('/payments')
  .all(auth.verifyAuth)
  .post(PaymentController.createCard) // create a new credit card item to database
  .get(auth.ensureAdmin, PaymentController.listCards) // list all payment information from the database

router
  .route('/payments/:id([a-f0-9]{24})')
  .all(auth.verifyAuth)
  .get(PaymentController.showCard) // get information about a specific credit card item by id
  .put(PaymentController.updateCard) // modify a specific credit card item by id
  .delete(PaymentController.deleteCard) // delete a specific creditcard item from the database by id

router
  .route('/purchase')
  .all(auth.verifyAuth)
  .post(PaymentController.purchase) // handle a purcase event

module.exports = router