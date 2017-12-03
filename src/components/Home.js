/* @flow */
import Axios from 'axios';
import React from 'react';
import moment from 'moment';
import styles from './styles.css';

import { auth, database, twitterAuthProvider } from '../firebase';
import { Link } from './common/Link';
import { twitterTokenStorage } from '../storageManager'
import { queryParamUtils, sortUtils } from '../utils'

const readTweetsRef = database.ref('read-tweets/');
const twitterAPIUrl = "https://us-central1-hello-firebase-26b50.cloudfunctions.net/execute";
const urlRegex = new RegExp(/(https?:\/\/\S+)/g); 

export default class Home extends React.Component {

  componentDidMount(){
    let loadLinkedTweets = this.loadLinkedTweets.bind(this);
    auth.onAuthStateChanged(function(user) {
      if (user) {
        loadLinkedTweets();
      } else {
        auth.signInWithPopup(twitterAuthProvider).then((result) => {
          twitterTokenStorage.setCredentials(result.credential.accessToken, result.credential.secret);
          loadLinkedTweets();
        }).catch(function(error) {
          console.log(error);
        });
      }
    });

    const props = this.props;
    readTweetsRef.on('value', (snapshot) => {
      props.updateReadTweets(snapshot.val());
    });
  }

  loadLinkedTweets() {
    const tokens = twitterTokenStorage.getCredentials();
    let self = this;
    Axios.all([
      Axios.get(queryParamUtils.addQueryParam(twitterAPIUrl, queryParamUtils.twitterQueryParamFactory(tokens.token, tokens.secret, 'favorites/list'))),
      Axios.get(queryParamUtils.addQueryParam(twitterAPIUrl, queryParamUtils.twitterQueryParamFactory(tokens.token, tokens.secret, 'statuses/user_timeline')))
    ]).then(function (response) {
      let newTweets = response[0].data.concat(response[1].data)
        .filter((tweet) => {return tweet.text.match(urlRegex)})
        .sort(sortUtils.sortTweetsByCreationDate);
      self.props.updateTweets(newTweets);
    })
  }

  markAsRead(e) {
    const readTweets = this.props.readTweets;
    readTweets.push(e.target.value);
    readTweetsRef.set(readTweets);
  }

  render (){
    const onClickLink = (filter) => {
      this.props.setVisibilityFilter(filter);
    };
    const readTweets = this.props.readTweets;

    return <div className={styles.Home}>
      <div>
       <Link active={this.props.filter === 'SHOW_ALL'} onClick={() => onClickLink('SHOW_ALL')}>全て</Link>{" "}
       <Link active={this.props.filter === 'SHOW_UNREAD'} onClick={() => onClickLink('SHOW_UNREAD')}>未読</Link>{" "}
       <Link active={this.props.filter === 'SHOW_READ'} onClick={() => onClickLink('SHOW_READ')}>既読</Link>
      </div>
      <button onClick={this.loadLinkedTweets.bind(this)}>reload</button>
      <ul>  
        {this.props.tweets.map((tweet, index) => {
          let linkUrl = tweet.text.match(urlRegex)[0];
          let date = moment(tweet.created_at);
          let isRead = readTweets.includes(tweet.id.toString());
          const readButton = isRead ? "" : <button onClick={this.markAsRead.bind(this)} value={tweet.id}>既読にする</button>;

          return (<li key={index}>
              <p>{tweet.text}</p>
              <p>{date.format("YYYY年 MM月DD日")}</p>
              <a href={linkUrl} target="_blank">{linkUrl}</a>
              {readButton}
            </li>
          )    
        })}
      </ul>
    </div>
  }
}
