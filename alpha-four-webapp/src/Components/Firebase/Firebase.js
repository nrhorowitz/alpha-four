import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAqRD1JpMsETdNGwELwMGm_3mNUuE4wRhc",
  authDomain: "alpha-four.firebaseapp.com",
  databaseURL: "https://alpha-four.firebaseio.com",
  projectId: "alpha-four",
  storageBucket: "alpha-four.appspot.com",
  messagingSenderId: "641108081699",
  appId: "1:641108081699:web:a5501da6a091b6ef38c596",
  measurementId: "G-7PY6PLGQ0R"
};
firebase.initializeApp(firebaseConfig);

export default firebase;