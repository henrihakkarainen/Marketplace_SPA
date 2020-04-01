import { SET_VIEW } from '../constants/action-types'

export const setView = (filter) => {
  return {
    type: SET_VIEW,
    filter
  }
}