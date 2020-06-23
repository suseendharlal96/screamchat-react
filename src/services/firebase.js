import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyANAaS2YgmNxPOi-emZTDPxnr0-ITKaKeE",
  authDomain: "socialchat-react.firebaseapp.com",
  databaseURL: "https://socialchat-react.firebaseio.com",
  projectId: "socialchat-react",
  storageBucket: "socialchat-react.appspot.com",
  messagingSenderId: "548637046600",
  appId: "1:548637046600:web:2ceba5e150bd16475d657d",
  measurementId: "G-TPGVGDPZQK",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
