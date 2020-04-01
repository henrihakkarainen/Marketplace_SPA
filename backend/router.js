// load routers
const UsersRouter = require('./routes/users');
const ItemsRouter = require('./routes/items');
const PaymentsRouter = require('./routes/payments');

// Setup Routes
module.exports = (app) => {
    app.use('/api', UsersRouter)
    app.use('/api', ItemsRouter)
    app.use('/api', PaymentsRouter)
};