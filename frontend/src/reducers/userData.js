import {
  REQUEST_USER_DATA,
  RECEIVE_USER_DATA,
  ERROR_USER_DATA,
  ADD_CREDITCARD_DATA,
  UPDATE_CREDITCARD_DATA,
  DELETE_CREDITCARD_DATA,
  UPDATE_USER_DATA,
  REMOVE_USER
} from '../constants/action-types'

const initialState = {
  isFetching: false,
  didInvalidate: false,
  data: {}
}

const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_USER_DATA:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_USER_DATA:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: action.payload,
        lastUpdated: action.receivedAt
      }
    case ERROR_USER_DATA:
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        error: action.error
      }
    case ADD_CREDITCARD_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          creditcard: action.payload
        }
      }
    case UPDATE_CREDITCARD_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          creditcard: action.payload
        }
      }
    case DELETE_CREDITCARD_DATA:
      delete state.data.creditcard
      return state
    case UPDATE_USER_DATA:
      return {
        ...state,
        data: action.payload
      }
    case REMOVE_USER:
      return {
        ...state,
        data: {}
      }
    default:
      return state
  }
}

export default userInfo