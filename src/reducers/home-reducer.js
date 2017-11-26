export const tweets = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_TWEETS':
      return action.newTweets;
    default:
      return state;
  }
}