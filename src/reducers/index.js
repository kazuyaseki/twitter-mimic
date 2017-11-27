/* @flow */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { tweets, visibilityFilter } from './home-reducer'

export default combineReducers({
  tweets, visibilityFilter, routing: routerReducer
})
