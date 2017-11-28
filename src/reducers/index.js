/* @flow */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { tweets, readTweets, visibilityFilter } from './home-reducer'

export default combineReducers({
  tweets, readTweets, visibilityFilter, routing: routerReducer
})
