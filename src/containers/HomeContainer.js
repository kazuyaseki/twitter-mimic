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

const getVisibleTweets = (tweets, filter, readTweets) => {
  switch (filter) {
    case 'SHOW_ALL':
      return tweets;
    case 'SHOW_UNREAD':
      return tweets.filter(
        t => !readTweets.includes(t.id.toString())
      );
    case 'SHOW_READ':
      return tweets.filter(
        t => readTweets.includes(t.id.toString())
      );
  }
}

const mapStateToProps = (state) => {
  return {
    tweets: getVisibleTweets(state.tweets, state.visibilityFilter, state.readTweets),
    readTweets: state.readTweets,
    filter: state.visibilityFilter
  }
}
const mapDispatchToProps = (dispatch) => { 
  return {
    updateTweets: tweets => { dispatch({type: 'UPDATE_TWEETS', newTweets: tweets}) },
    updateReadTweets: readTweets => { dispatch({type: 'UPDATE_READ_TWEETS', readTweets}) },
    setVisibilityFilter: filter => { dispatch({type: 'SET_VISIBILITY_FILTER', filter }) }
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(HomeContainer)
