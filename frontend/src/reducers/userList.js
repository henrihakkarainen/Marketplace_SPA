import {
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  REQUEST_USERS,
  RECEIVE_USERS
} from '../constants/action-types'

const initialState = {
  isFetching: false,
  didInvalidate: false,
  users: []
}

const users = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_USERS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_USERS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        users: action.payload,
        lastUpdated: action.receivedAt
      }
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      }
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      }
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => {
          if (user._id === action.payload._id) return action.payload
          return user
        })
      }
    default:
      return state
  }
}
export default users