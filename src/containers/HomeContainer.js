/* @flow */
import { connect } from 'react-redux'
import React from 'react'
import Home from '../components/Home'

function HomeContainer (
  props
) {
  return (
    <Home {...props} />
  )
}

const getVisibleTweets = (tweets, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return tweets;
    case 'SHOW_UNREAD':
      return tweets.filter(
        t => !t.read
      );
    case 'SHOW_READ':
      return tweets.filter(
        t => t.read
      );
  }
}

const mapStateToProps = (state) => {
  return {
    tweets: getVisibleTweets(state.tweets, state.visibilityFilter),
    filter: state.visibilityFilter
  }
}
const mapDispatchToProps = (dispatch) => { 
  return {
    updateTweets: tweets => { dispatch({type: 'UPDATE_TWEETS', newTweets: tweets}) },
    setVisibilityFilter: filter => { dispatch({type: 'SET_VISIBILITY_FILTER', filter }) }
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(HomeContainer)
