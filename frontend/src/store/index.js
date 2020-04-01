import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/index';
import thunkMiddleware from 'redux-thunk'

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnchancers(
    applyMiddleware(thunkMiddleware)
  )
);

export default store;