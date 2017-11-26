/* @flow */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { tweets } from './home-reducer'

export default combineReducers({
  tweets, routing: routerReducer
})
