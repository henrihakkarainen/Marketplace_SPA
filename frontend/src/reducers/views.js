import { SET_VIEW, VIEW_MAIN_PAGE } from '../constants/action-types'

const viewFilter = (state = VIEW_MAIN_PAGE, action) => {
  switch (action.type) {
    case SET_VIEW:
      return action.filter
    default:
      return state
  }
}

export default viewFilter
