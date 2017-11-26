/* @flow */
import Axios from 'axios'
import React from 'react'
import styles from './styles.css'

import { auth, twitterAuthProvider } from '../firebase';

const addQueryParam = (url, params) => {
  url += "?";
  let param_strs = [];
  for(let key in params){
    param_strs.push( key + "=" + params[key] );
  }
  url += param_strs.join("&");
  
  return url;
}

const twitterQueryParamFactory = (key, secret, url) => {
  return {
    key,
    secret,
    url
  }
}

const twitterAPIUrl = "https://us-central1-hello-firebase-26b50.cloudfunctions.net/execute";
const urlRegex = new RegExp(/(https?:\/\/\S+)/g); 

export default class Home extends React.Component {

  componentDidMount(){
    let loadLinkedTweets = this.loadLinkedTweets.bind(this);
    auth.onAuthStateChanged(function(user) {
      if (user) {
        loadLinkedTweets();
      } else {
        auth.signInWithPopup(twitterAuthProvider).then(function(result) {
          var token = result.credential.accessToken;
          var secret = result.credential.secret;

          localStorage.setItem("twitter:tokens", JSON.stringify({
            token,
            secret
          }))
      
          loadLinkedTweets();
      
        }).catch(function(error) {
          console.log(error);
        });
      }
    });
  }

  loadLinkedTweets() {
    let tokens = JSON.parse(localStorage.getItem("twitter:tokens"));
    let self = this;
    Axios.all([
      Axios.get(addQueryParam(twitterAPIUrl, twitterQueryParamFactory(tokens.token, tokens.secret, 'favorites/list'))),
      Axios.get(addQueryParam(twitterAPIUrl, twitterQueryParamFactory(tokens.token, tokens.secret, 'statuses/user_timeline')))
    ]).then(function (response) {
      let newTweets = response[0].data.concat(response[1].data).filter((tweet) => {return tweet.text.match(urlRegex)});
      self.props.updateTweets(newTweets);
    })
  }

  signIn() {
    auth.signInWithPopup(twitterAuthProvider).then(function(result) {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;

      localStorage.setItem("twitter:tokens", JSON.stringify({
        token,
        secret
      }))  
    }).catch(function(error) {
      console.log(error);
    });
  }

  render (){
    return <div className={styles.Home}>
      <button onClick={this.loadLinkedTweets.bind(this)}>reload</button>
      <ul>  
        {this.props.tweets.map((tweet, index) => {
          let linkUrl = tweet.text.match(urlRegex)[0];

          return (<li key={index}>
              <p>{tweet.text}</p>
              <a href={linkUrl} target="_blank">{linkUrl}</a>
            </li>
          )    
        })}
      </ul>
    </div>
  }
}
