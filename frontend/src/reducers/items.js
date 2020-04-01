import { REQUEST_ITEMS, RECEIVE_ITEMS, ADD_ITEM, DELETE_ITEM, UPDATE_ITEM } from '../constants/action-types'

const initialState = {
  isFetching: false,
  didInvalidate: false,
  items: []
}

const items = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ITEMS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_ITEMS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.payload,
        lastUpdated: action.receivedAt
      }
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      }
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item => {
          if (item._id === action.payload._id) return action.payload
          return item
        })
      }
    default:
      return state
  }
}
export default items