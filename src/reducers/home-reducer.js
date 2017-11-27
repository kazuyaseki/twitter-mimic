export const tweets = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_TWEETS':
      return action.newTweets;
    default:
      return state;
  }
}

export const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}