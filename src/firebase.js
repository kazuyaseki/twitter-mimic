import firebase from 'firebase';

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: ''
};

firebase.initializeApp(config);

export default firebase;

export const auth = firebase.auth();
export const database = firebase.database();
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();