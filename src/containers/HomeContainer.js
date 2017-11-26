/* @flow */
import { connect } from 'react-redux'
import React from 'react'
import Home from '../components/Home'
import { updateTweets } from "../reducers"

function HomeContainer (
  props
) {
  return (
    <Home {...props} />
  )
}

const mapStateToProps = (state) => {
  return {
    tweets: state.tweets
  }
}
const mapDispatchToProps = (dispatch) => { 
  return {
    updateTweets: tweets => { dispatch({type: 'UPDATE_TWEETS', newTweets: tweets}) }
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(HomeContainer)
