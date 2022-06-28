import {React, useState} from 'react'
import './Login.css'
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc} from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

const auth = getAuth()



const bannerText = ['t', 'o', 'm', 'm', 'y', 'g', 'o', 't', 'c', 'h', 'i']

function Login(props) {

    

    const [createAccountPopUpWindow, setCreateAccountPopUpWindow] = useState(null)


    const signIn = () => {


        signInWithEmailAndPassword(auth, props.email, props.password)
        .then((userCredential) => {
    // Signed in 
        props.setUserId(userCredential.user.uid)
        props.setLoggedIn(true)
    // ...
     })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setCreateAccountPopUpWindow(<div className='createAccountPopUpWindow'>
        <p className='createAccountPopUpWindowText'>{errorMessage}</p>
        <button className = 'createAccountPopUpWindowButton' onClick={() => setCreateAccountPopUpWindow(null)}>Okay</button>
        </div>)
        console.log(errorCode + errorMessage)
        console.log(props.email)
    });
}

    const createAccount = async () => {

        createUserWithEmailAndPassword(auth, props.email, props.password)
        .then((userCredential) => {
         props.setUserId(userCredential.user.uid)
         async function initializeStats() {
            await setDoc (doc(db, "users", userCredential.user.uid), {
                foodAmount: 70,
                disciplineAmount: 0,
                hygieneAmount: 70,
                cashAmount: 500,
                mood: '/static/media/tommyhappy.66682db7c2701808d1fc.png',
                disciplineDisabled: false,
                poopX: [130],
                hp: 175,
                timestamp: firebase.firestore.Timestamp.now().seconds,
                birth: firebase.firestore.Timestamp.now().seconds,
                abuse: false,
                abuseAmount: 0,
                inventory: [],
                currentHat: null,
                currentWeapon: null,
                combatStats: {name: 'tommy', hp: 10, attack: 5, def: 5, str: 2, attacks: ['quick attack']},
                level: 1,
                xp: 0,
            });
        }
        initializeStats()
        setCreateAccountPopUpWindow(<div className='createAccountPopUpWindow'>
        <p className='createAccountPopUpWindowText'>Account created. Proceed to login.</p>
        <button className = 'createAccountPopUpWindowButton' onClick={() => setCreateAccountPopUpWindow(null)}>Okay</button>
        </div>)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setCreateAccountPopUpWindow(<div className='createAccountPopUpWindow'>
            <p className='createAccountPopUpWindowText'>{errorMessage}</p>
            <button className = 'createAccountPopUpWindowButton' onClick={() => setCreateAccountPopUpWindow(null)}>Okay</button>
            </div>)
            console.log(errorCode + errorMessage)
        })
    }
    


    return (
        <div className = 'loginForm'>
            {createAccountPopUpWindow}
            <div className = 'banner'>{bannerText.map((letter, index) => <div key={index} className ='bannerLetters'>{letter}</div>)}</div>
            <div className = 'email'>
                Email:
                <input className = 'emailInput' type='text' onChange={(e) => props.setEmail(e.target.value)}></input>
            </div>
            
            <div className = 'password'>
                Password:
                <input className ='passwordInput'type='password' onChange={(e) => props.setPassword(e.target.value)}></input>
            </div>
            <button className = 'loginButton' onClick={() => signIn()}>Login</button>
            <button className ='createAccountButton' onClick={() => createAccount()}>Create Account</button>
        </div>
    )
}

export default Login;

