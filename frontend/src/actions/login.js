import {
  REQUEST_USER_LOGIN,
  RECEIVE_USER_LOGIN,
  ERROR_USER_LOGIN,
  USER_LOGOUT,
  USER_UNREGISTER
} from '../constants/action-types'

export const requestUserLogin = (url, payload) => {
  return {
    type: REQUEST_USER_LOGIN,
    url,
    payload
  }
}

export const receiveUserLogin = (json) => {
  return {
    type: RECEIVE_USER_LOGIN,
    payload: json,
    receivedAt: Date.now()
  }
}

export const errorLogin = (error) => {
  return {
    type: ERROR_USER_LOGIN,
    error: error.message
  }
}

export const postLogout = () => {
  return {
    type: USER_LOGOUT
  }
}

export const postUnregister = () => {
  return {
    type: USER_UNREGISTER
  }
}

export const postLogin = (url, payload) => {
  return (dispatch) => {
    dispatch(requestUserLogin(url, payload))
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw Error(res.statusText)
        return res
      })
      .then(res => res.json())
      .then(json => dispatch(receiveUserLogin(json)))
      .catch(err => dispatch(errorLogin(err)))
  }
}