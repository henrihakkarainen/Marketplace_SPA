import { combineReducers } from 'redux'
import loggedInUser from './login'
import viewFilter from './views'
import users from './userList'
import userInfo from './userData'
import items from './items'

export default combineReducers({
  items,
  loggedInUser,
  viewFilter,
  users,
  userInfo,
})