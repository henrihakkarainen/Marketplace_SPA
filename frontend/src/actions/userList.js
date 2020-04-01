import {
  REQUEST_USERS,
  RECEIVE_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER
} from '../constants/action-types'


export const requestUsers = (url) => {
  return {
    type: REQUEST_USERS,
    url
  }
}

export const receiveUsers = (json) => {
  return {
    type: RECEIVE_USERS,
    payload: json,
    receivedAt: Date.now()
  }
}

export const addUser = (json) => {
  return {
    type: ADD_USER,
    payload: json
  }
}

export const updateUser = (json) => {
  return {
    type: UPDATE_USER,
    payload: json
  }
}

export const deleteUser = (json) => {
  return {
    type: DELETE_USER,
    payload: json._id
  }
}

export const fetchUsers = (url, payload) => {
  return (dispatch) => {
    dispatch(requestUsers(url))
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + payload.token
      }
    })
      .then(res => res.json())
      .then(json => dispatch(receiveUsers(json)))
  }
}