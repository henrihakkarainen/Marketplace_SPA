import {
  REQUEST_USER_DATA,
  RECEIVE_USER_DATA,
  ERROR_USER_DATA,
  ADD_CREDITCARD_DATA,
  UPDATE_CREDITCARD_DATA,
  UPDATE_USER_DATA,
  DELETE_CREDITCARD_DATA,
  REMOVE_USER
} from '../constants/action-types'

export const requestData = (url, token) => {
  return {
    type: REQUEST_USER_DATA,
    url,
    token
  }
}

export const receiveData = (json) => {
  return {
    type: RECEIVE_USER_DATA,
    payload: json,
    receivedAt: Date.now()
  }
}

export const errorData = (error) => {
  return {
    type: ERROR_USER_DATA,
    error: error.message
  }
}

export const fetchData = (url, token) => {
  return (dispatch) => {
    dispatch(requestData(url, token))
    return fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(json => {
        dispatch(receiveData(json))
      })
  }
}

export const addCard = (payload) => {
  return {
    type: ADD_CREDITCARD_DATA,
    payload
  }
}

export const updateCard = (payload) => {
  return {
    type: UPDATE_CREDITCARD_DATA,
    payload
  }
}

export const deleteCard = () => {
  return {
    type: DELETE_CREDITCARD_DATA
  }
}

export const updateUser = (payload) => {
  return {
    type: UPDATE_USER_DATA,
    payload
  }
}

export const removeUser = () => {
  return {
    type: REMOVE_USER
  }
}