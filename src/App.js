
import './App.css';
import Login from './Login';
import Main from './Main';
import {React, useState, useEffect} from 'react'
import { initializeApp } from "firebase/app";
import {collection, getFirestore, setDoc, addDoc, doc} from "firebase/firestore"; 
import { getDatabase } from "firebase/database";
import {Helmet} from "react-helmet";
import Battle from './Battle';
const firebaseConfig = {

    apiKey: "AIzaSyCA-VOFTQSCuSkZUeC80Q3QMx_sOMMgric",
  
    authDomain: "tommygotchi-fb80f.firebaseapp.com",
  
    projectId: "tommygotchi-fb80f",
  
    storageBucket: "tommygotchi-fb80f.appspot.com",
  
    messagingSenderId: "1040925871824",
  
    appId: "1:1040925871824:web:5f98e9c9c66cbe1f4158d5"
  
  };
  

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)



function App() {

  const [userId, setUserId] = useState('')

  const [loggedIn, setLoggedIn] = useState(false)

  const [displayName, setDisplayName] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [battling, setBattling] = useState(false)

  
  return (
    <div className="App">
      <Helmet>
      <title>Tommygotchi v0.2</title>
      </Helmet>
      {loggedIn === false ? <Login setLoggedIn={setLoggedIn} setDisplayName={setDisplayName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} userId={userId} setUserId={setUserId}/> : null}
      {loggedIn === true && battling === false ? <Main setBattling = {setBattling} displayName={displayName} setLoggedIn={setLoggedIn} setDisplayName={setDisplayName} setPassword={setPassword} email={email} setUserId={setUserId} userId={userId}/> : null}
      {loggedIn === true && battling === true ? <Battle userId={userId} setBattling={setBattling}/> : null}
    </div>
  );
}

export default App;
