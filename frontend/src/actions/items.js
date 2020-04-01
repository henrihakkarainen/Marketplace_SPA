import {
    ADD_ITEM,
    DELETE_ITEM,
    UPDATE_ITEM,
    REQUEST_ITEMS,
    RECEIVE_ITEMS
  } from '../constants/action-types'
  
  export const addItem = (json) => {
    return {
      type: ADD_ITEM,
      payload: json
    }
  }
  
  export const deleteItem = (json) => {
    return {
      type: DELETE_ITEM,
      payload: json._id
    }
  }

  export const updateItem = (json) => {
    return {
      type: UPDATE_ITEM,
      payload: json
    }
  }

  export const requestItems = (url, payload) => {
    return {
      type: REQUEST_ITEMS,
      url
    }
  }
  
  export const receiveItems = (json) => {
    return {
      type: RECEIVE_ITEMS,
      payload: json,
      receivedAt: Date.now()
    }
  }
  
  export const fetchItems = (url, payload) => {
    return (dispatch) => {
      dispatch(requestItems(url))
      return fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + payload
        }
      })
        .then(res => res.json())
        .then(json => {dispatch(receiveItems(json));
        })
    }
  }