/* @flow */
import Axios from 'axios'
import React from 'react'
import styles from './styles.css'
import moment from 'moment';

import { auth, database, twitterAuthProvider } from '../firebase';

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

const readTweetsRef = database.ref('read-tweets/');
const twitterAPIUrl = "https://us-central1-hello-firebase-26b50.cloudfunctions.net/execute";
const urlRegex = new RegExp(/(https?:\/\/\S+)/g); 

const Link = ({
  active,
  children,
  onClick
}) => {
  if(active){
    return <span>{children}</span>;
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  )
}

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

    const props = this.props;
    readTweetsRef.on('value', function(snapshot) {
      props.updateReadTweets(snapshot.val());
    });
  }

  loadLinkedTweets() {
    let tokens = JSON.parse(localStorage.getItem("twitter:tokens"));
    let self = this;
    Axios.all([
      Axios.get(addQueryParam(twitterAPIUrl, twitterQueryParamFactory(tokens.token, tokens.secret, 'favorites/list'))),
      Axios.get(addQueryParam(twitterAPIUrl, twitterQueryParamFactory(tokens.token, tokens.secret, 'statuses/user_timeline')))
    ]).then(function (response) {
      let newTweets = response[0].data.concat(response[1].data)
        .filter((tweet) => {return tweet.text.match(urlRegex)})
        .sort((a, b) => {
          let aDate = new Date(a.created_at);
          let bDate = new Date(b.created_at);

          if(aDate.getTime() > bDate.getTime())
            return -1;
          else if(bDate.getTime() > aDate.getTime())
            return 1;
          else
            return 0;
        });
      self.props.updateTweets(newTweets);
    })
  }

  signIn() {
    auth.signInWithPopup(twitterAuthProvider).then(function(result) {
      let token = result.credential.accessToken;
      let secret = result.credential.secret;

      localStorage.setItem("twitter:tokens", JSON.stringify({
        token,
        secret
      }))  
    }).catch(function(error) {
      console.log(error);
    });
  }

  render (){
    const onClickLink = (filter) => {
      this.props.setVisibilityFilter(filter);
    }

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

          return (<li key={index}>
              <p>{tweet.text}</p>
              <p>{date.format("YYYY年 MM月DD日")}</p>
              <a href={linkUrl} target="_blank">{linkUrl}</a>
            </li>
          )    
        })}
      </ul>
    </div>
  }
}
