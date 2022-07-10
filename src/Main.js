import {React, useState, useEffect, useRef, useMemo} from 'react'
import './Main.css'
import { initializeApp } from "firebase/app";
import {getFirestore, setDoc, doc, getDoc} from "firebase/firestore"; 
import './index.css'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getAuth, signOut} from "firebase/auth";
import Theme from './Theme';
import ShopWindow from './ShopWindow';


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

//eat sfx
let refuseSound = new Audio('/refuseSound.mp3')
let disciplineSound = new Audio('/disciplineSound.mp3')
let eatSound = new Audio('/eatSound.mp3')

//tommy moods
const tommySad = require('./tommysad.png');
const tommyAbused = require('./tommyabused.png')
const tommyHappy = require('./tommyhappy.png');
const tommyDead = require('./tommydead.png')

//icons
const food = require('./food.png')
const chat = require('./chat.png')
const discipline = require('./discipline.png')
const clean = require('./clean.png')
const shop = require('./shop.png')
const battle = require('./battle.png')

const tommyRoom = require('./tommyroom.png')
const inventory = require('./inventoryicon.png')
// poop
const poop = require('./poop.png')
const healthBar = require('./healthbar.png')

//sound icons
const playSound = require('./playsound.png')
const muteSound = require('./mutesound.png')

//dialogue options
const happyDialogueOptions = ['oh hi master', 'haha', 'where mark?', 'hahaha', ':)', 'anyway, how is your sex life?' , 'haha, funny story master',
 'i wana play! :) haha', ':p', 'can we get a football?', `today's words: captivity? depression?`, 
 `i'm tired, i'm wasted, I love u darling`, 'if a lot of people love each other, the world would be better place to live', 'why so serious? haha', 'where lisa?',
  'x)', 'did you like last night? :)', `today's words: longing? turmoil?`]
const sadDialogueOptions = ['u just a chiken - cheep cheep cheeeep', 'i fed up with this worl', 'everybody betray me', 'bitch', 'Why, Lisa, why, WHY?!',
 'don tach me motherfacker', '>:(', 'D:<', 'DO U UNDERSTAND LIFE?', '']
const undisciplinedDialogueOptions = ['i dont wana listen', 'in a few minutes bitch', 'i no talk', 'u suck hahahaha', 'fuck you haha', 'i no respect you', 'u stupid', 'SHUT UP']

let tommyAge = 0
let level = 0
let xp = 0
function Main(props) {

    const bannerText = ['t', 'o', 'm', 'm', 'y', 'g', 'o', 't', 'c', 'h', 'i', '_','v','1']

    //tommys happy or sad picture, controlled by a switch
    

    const [mood, setMood] = useState(tommyHappy) 
    const [abuse, setAbuse] = useState(false)
    const [tommyDamaged, setTommyDamaged] = useState(false)
    const [translateXValue, setTranslateXValue] = useState(175)
    const [cashAmount, setCashAmount] = useState(0)
    const [inventory, setInventory] = useState([])
    const [foodAmount, setFoodAmount] = useState(100)
    const [currentHat, setCurrentHat] = useState(null)
    const [abusePopUpWindow, setAbusePopUpWindow] = useState(null)
    const [disciplineDisabled, setDisciplineDisabled] = useState(false)
    const [disciplineAmount, setDisciplineAmount] = useState(0)
    const [abuseAmount, setAbuseAmount] = useState(0)
    const [abuseDisabled, setAbuseDisabled] = useState(false)
    const [hygieneAmount, setHygieneAmount] = useState(100)
    const [poopX, setPoopX] = useState([])
    const [poopInterval, setPoopInterval] = useState(5)
    const [themePlaying, setThemePlaying] = useState(true)
    const [shopDisplay, setShopDisplay] = useState(null)
    const [inventoryDisplay, setInventoryDisplay] = useState(null)
    const [shopPopUp, setShopPopUp] = useState(null)
    const [inventoryPopUp, setInventoryPopUp] = useState(null)
    const [currentDialogue, setCurrentDialogue] = useState(null)
    const [dialogueDisabled, setDialogueDisabled] = useState(false)

    // fetch data from firestore to show tommys last stats 
       async function fetchData () { 
        const docSnap = await getDoc(doc(db, "users", props.userId))
        if(docSnap.exists()) {
            const lastLoggedIn = docSnap.data().timestamp
            const currentTime = firebase.firestore.Timestamp.now().seconds
            const timePassed = currentTime - lastLoggedIn
            const timePassedFoodAmount = Math.floor(timePassed / 1000)
            const timePassedHygieneAmount = Math.floor(timePassed / 1000)
            const tommyAgeCalculator = Math.floor((currentTime - docSnap.data().birth) / 86400)
            level = docSnap.data().level
            xp = docSnap.data().xp
            
            if(timePassed >= 10000) {
                setDisciplineDisabled(false)
            }
            
            if(docSnap.data().foodAmount - timePassedFoodAmount <= 0 || docSnap.data().hygieneAmount - timePassedHygieneAmount <= 0) {
                setFoodAmount(0)
                setHygieneAmount(0)
                if(timePassed >= 300000) {
                    setHp(25)
                    setDisciplineAmount(0)
                    setMood(tommyDead)
                    setTranslateXValue(130)
                    setInventory(docSnap.data().inventory)
                    setCurrentHat(docSnap.data().currentHat)
                    setCashAmount(docSnap.data().cashAmount)
                    setAbuse(docSnap.data().abuse)
                    setAbuseAmount(docSnap.data().abuseAmount)
                    setPoopX(docSnap.data().poopX)
                    setLoaded(true)
                    return
                }
                if(timePassed >= 150000 && timePassed < 300000) {
                    setHp(docSnap.data().hp - 125)
                    setDisciplineAmount(docSnap.data().disciplineAmount - 10)
                    setDisciplineDisabled(false)
                    setTranslateXValue(130)
                    setInventory(docSnap.data().inventory)
                    setCurrentHat(docSnap.data().currentHat)
                    setCashAmount(docSnap.data().cashAmount)
                    setAbuse(docSnap.data().abuse)
                    setAbuseAmount(docSnap.data().abuseAmount)
                    setPoopX(docSnap.data().poopX)
                    setMood(docSnap.data().mood)
                    setLoaded(true)
                    tommyAge = tommyAgeCalculator
                    return

                }
                if(timePassed >= 50000 && timePassed < 150000) {
                    setHp(docSnap.data().hp - 50)
                    setDisciplineDisabled(false)
                    setDisciplineAmount(docSnap.data().disciplineAmount - 5)
                    setTranslateXValue(130)
                    setInventory(docSnap.data().inventory)
                    setCurrentHat(docSnap.data().currentHat)
                    setCashAmount(docSnap.data().cashAmount)
                    setAbuse(docSnap.data().abuse)
                    setAbuseAmount(docSnap.data().abuseAmount)
                    setPoopX(docSnap.data().poopX)
                    setMood(docSnap.data().mood)
                    setLoaded(true)
                    tommyAge = tommyAgeCalculator
                    return
                }
            } else {
                setFoodAmount(docSnap.data().foodAmount - timePassedFoodAmount)
                setHp(docSnap.data().hp)
                setPoopX(docSnap.data().poopX)
                setHygieneAmount(docSnap.data().hygieneAmount - timePassedHygieneAmount)
                setDisciplineDisabled(docSnap.data().disciplineDisabled)
                setDisciplineAmount(docSnap.data().disciplineAmount)
                setTranslateXValue(130)
                setInventory(docSnap.data().inventory)
                setCurrentHat(docSnap.data().currentHat)
                setCashAmount(docSnap.data().cashAmount)
                setAbuse(docSnap.data().abuse)
                setAbuseAmount(docSnap.data().abuseAmount)
                setPoopX(docSnap.data().poopX)
                setMood(docSnap.data().mood)
                tommyAge = tommyAgeCalculator
                setLoaded(true)
                return
            }
            setFoodAmount(docSnap.data().foodAmount - timePassedFoodAmount)
            setHp(docSnap.data().hp)
            setPoopX(docSnap.data().poopX)
            setHygieneAmount(docSnap.data().hygieneAmount - timePassedHygieneAmount)
            setDisciplineDisabled(docSnap.data().disciplineDisabled)
            setDisciplineAmount(docSnap.data().disciplineAmount)
            setTranslateXValue(130)
            setInventory(docSnap.data().inventory)
            setCurrentHat(docSnap.data().currentHat)
            setCashAmount(docSnap.data().cashAmount)
            setAbuse(docSnap.data().abuse)
            setAbuseAmount(docSnap.data().abuseAmount)
            setPoopX(docSnap.data().poopX)
            setMood(docSnap.data().mood)
            tommyAge = tommyAgeCalculator
            setLoaded(true)
            
        }
    }

    useEffect(() => {   
    fetchData()
    },[])
    
    //check if loaded

    const [loaded, setLoaded] = useState(false)

    //update firestore with tommys current stats on every rerender

    async function setData () {
        if(loaded === true) {
            await setDoc(doc(db, "users", props.userId), {
                foodAmount: foodAmount,
                disciplineAmount: disciplineAmount,
                hygieneAmount: hygieneAmount,
                cashAmount: cashAmount,
                mood: mood,
                disciplineDisabled: disciplineDisabled,
                poopX: poopX,
                hp: hp,
                timestamp: firebase.firestore.Timestamp.now().seconds,
                abuse: abuse,
                abuseAmount: abuseAmount,
                inventory: inventory,
                currentHat: currentHat,
            }, {merge: true});
        }
    }

    useEffect(() => {
        if(loaded === true) {
            setData()
        }
    },[foodAmount, inventory, currentHat, mood])
    //create hp and hp interval

    const [hp, setHp] = useState(175)

    //movement functions 

    let movementTimer = useRef(null)

    useEffect(() => {
        if(loaded === true && mood !== tommyDead) {
        movementTimer.current = setTimeout(() => translateXHandler(movementTimer.current), 1000);
        }
        return () => {
            clearTimeout(movementTimer.current)
        }
    },[loaded, translateXValue])

    const directionRandomizer = () => {
        let random = Math.random()
        if(random < 0.5) {
            return 0
        }
        else {
            return 1
        }
    }

    const translateXHandler = (timer) => {
        clearTimeout(timer)
        movementTimer.current = null
        let directionRandomizerResult = directionRandomizer()
        if(directionRandomizerResult === 0 && translateXValue > 0) {
            setTranslateXValue(prevTranslateXValue => prevTranslateXValue - 10)
            return
            }
            else if(directionRandomizerResult === 0) {
                setTranslateXValue(prevTranslateXValue => prevTranslateXValue + 10)
                return
            }
         if (directionRandomizerResult === 1 && translateXValue < 250) {
            setTranslateXValue(prevTranslateXValue => prevTranslateXValue + 10)
            return
            } 
            else if(directionRandomizerResult === 1) {
                setTranslateXValue(prevTranslateXValue => prevTranslateXValue - 10)
            }
        }
    //abuse and discipline functions
    const abuseTommy = () => {
        if(abuseAmount < 100) {
            disciplineSound.load()
            disciplineSound.play()
            setTimeout(() => {setAbuseAmount(prevAbuseAmount => prevAbuseAmount + 10); setCurrentDialogue('OW MASTER'); setTommyDamaged(true)}, 1000)
            setAbuseDisabled(true)
            setTimeout(() => {setAbuseDisabled(false); setCurrentDialogue(null)}, 4000)
        }     
    }

    const disciplineTommy = () => {
        if(mood === tommyDead) {
            return null
        }
        if(disciplineDisabled === false) { 
            setDisciplineDisabled(true) 
            disciplineSound.load()
            disciplineSound.play()
            setTimeout(() => {
                setDisciplineAmount(prevDisciplineAmount => prevDisciplineAmount + 10)
                setCurrentDialogue('Okay i listen!!!! D:')
            }, 1000)
            setTimeout(() => setCurrentDialogue(null), 4000)
            return
        }
        if(disciplineDisabled === true && abuse === false) {
            setAbusePopUpWindow(<div className='abusePopUpWindow'>
                <p className='abusePopUpWindowText'>Are you sure you want to <span style={{color: 'red'}}>abuse</span> Tommy?</p>
                <button className = 'abusePopUpWindowButton' onClick={() => {setAbuse(true); abuseTommy();setAbusePopUpWindow(null);}}>Confirm abuse</button>
                <button className = 'abusePopUpWindowButton' onClick={() => setAbusePopUpWindow(null)}>Nevermind</button>
            </div>)
            return
        }
        if(abuse === true && disciplineDisabled === true && abuseDisabled === false) {
            if(abuseAmount === 10 || abuseAmount === 20 || abuseAmount === 30 || abuseAmount === 40 || abuseAmount === 50 || abuseAmount === 60) {
                setHp(prevHp => prevHp - 25)
            }
            abuseTommy()
        }
        if(abuseAmount === 10) {
            setAbusePopUpWindow(<div className='abusePopUpWindow'>
                <p className='abusePopUpWindowText'>This is seriously fucked up.</p>
                <button className = 'abusePopUpWindowButton' onClick={() => setAbusePopUpWindow(null)}>Okay</button>
            </div>)
        }
        
    }

    //functions for decreasing foodamount over time and feeding tommy
    
    let foodTimer = useRef(null)

    useEffect(() => {
        if(loaded === true) {
        foodTimer.current = setTimeout(() => foodAmountHandler(foodTimer.current), 20000);
        }
        return () => {
            clearTimeout(foodTimer.current)
        }
    },[foodAmount, loaded])

    const foodAmountHandler = (timer) => {
        clearTimeout(timer)
        foodTimer.current = null
        setFoodAmount(prevFoodAmount => prevFoodAmount - 1)
        
            clearTimeout(foodTimer.current)
    }

    const [feedDisabled, setFeedDisabled] = useState(false)

    const feedTommy = (amount) => {
        if(mood === tommyDead) {
            return null
        }
        if(disciplineDisabled === false) {
            refuseSound.play()
            return
        }
        if(feedDisabled === false) {
        setFeedDisabled(true)
            if(foodAmount + amount <= 100) {
                if(foodAmount < 0) {
                    eatSound.load()
                    eatSound.play()
                    setTimeout(() => {
                        setFoodAmount(amount)
                        return
                    }, 1000)
                    
                }
                eatSound.load()
                eatSound.play()
                setTimeout(() => {
                setFoodAmount(prevFoodAmount => prevFoodAmount + amount)    
                }, 1000)
                
            } else {
                setCurrentDialogue('i too full master :(')
                setTimeout(() => setCurrentDialogue(null), 2000)
            }
        setTimeout(() => setFeedDisabled(false), 2000)
        } 
    }
    //functions for hygiene amount over time, and cleaning tommy
    let hygieneTimer = useRef(null)

    useEffect(() => {
        if(loaded === true || mood !== tommyDead) {
        hygieneTimer.current = setTimeout(() => hygieneAmountHandler(hygieneTimer.current), 20000);
        }
        return () => {
            clearTimeout(hygieneTimer.current)
        }
    },[hygieneAmount, loaded])

    const hygieneAmountHandler = (timer) => {
        clearTimeout(timer)
        hygieneTimer.current = null
        setHygieneAmount(prevHygieneAmount => prevHygieneAmount - 1)
        if(poopInterval !== 0) {
            setPoopInterval(prevPoopInterval => prevPoopInterval - 1)
        }
        if(poopInterval === 1) {
        setPoopX(prevPoopX => prevPoopX.concat(translateXValue))
        setPoopInterval(5)
        } 
    }

    const cleanTommy = () => {
        if(mood !== tommyDead) {
            if(disciplineDisabled === false) {
                refuseSound.play()
                return
            }
        setHygieneAmount(100)
        setPoopInterval(5)
        setPoopX([])
        }
    }
 
    const randomDialogue = () => {
        if(mood === tommyDead) {
            return null
        }
        if(dialogueDisabled === false) {
            setDialogueDisabled(true)
            if(disciplineDisabled === false) {
                let randomNum = Math.floor(Math.random() * undisciplinedDialogueOptions.length)
                setCurrentDialogue(undisciplinedDialogueOptions[randomNum])
            }
            if(mood === tommyHappy && disciplineDisabled === true) {
                let randomNum = Math.floor(Math.random() * happyDialogueOptions.length)
                setCurrentDialogue(happyDialogueOptions[randomNum])
            }   
            if((mood === tommySad || mood === tommyAbused) && disciplineDisabled === true) {
                let randomNum = Math.floor(Math.random() * sadDialogueOptions.length)
                setCurrentDialogue(sadDialogueOptions[randomNum])
            }
        setTimeout(() => setDialogueDisabled(false), 2000)
        setTimeout(() => setCurrentDialogue(null), 2000)
        }
    }

    const calculateMood = () => {
        if(hp <= 25) {
            setMood(tommyDead)
            setThemePlaying(false)
            return
        }
        if(tommyDamaged === true) {
            setMood(tommyAbused)
            return
        }
        if(foodAmount <= 40 || hygieneAmount <= 40) {
            setMood(tommySad)
            return
        }
        else if(foodAmount > 40 && hygieneAmount > 40) {
            setMood(tommyHappy)
            return
        }
    }

    useEffect(() => {
        if (loaded === true) {
        calculateMood()
        }
    })

    const signOutHandler = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            props.setPassword('')
            props.setLoggedIn(false)
            
        }).catch((error) => {
            const message = error.message
            console.log(message)
        });
        
    }

    const toggleThemePlaying = () => {
        if(themePlaying === true) {
            setThemePlaying(false)
            return
        }
        setThemePlaying(true)
    }

    const inventoryItemUseHandler = (item) => {
        if (item.name === 'potion') {
            setHp(175)
        }
        if(item.type === 'hat') {
            setCurrentHat(item.image)
        }
    }

    const inventoryItemHandler = (item) => {
        if(item.type === 'consumable') {
            setInventoryPopUp(
            <div className='shopPopUpWindow'>
                <p className='shopPopUpWindowText'>Use {item.name}?</p>
                <button className = 'shopPopUpWindowButton' onClick={() => {
                inventoryItemUseHandler(item)
                setInventory(inventory.filter((obj) => obj.id !== item.id));
                setInventoryPopUp(null)}}>Confirm</button>
                <button className = 'shopPopUpWindowButton' onClick={() => setInventoryPopUp(null)}>Cancel</button>
            </div>)
        } else {
            setInventoryPopUp(
            <div className='shopPopUpWindow'>
                <p className='shopPopUpWindowText'>Equip {item.name}?</p>
                <button className = 'shopPopUpWindowButton' onClick={() => {
                inventoryItemUseHandler(item)
                setInventoryPopUp(null)}}>Confirm</button>
                <button className = 'shopPopUpWindowButton' onClick={() => setInventoryPopUp(null)}>Cancel</button>
            </div>)
        }
    }

    return (
        <div>
            <div className = 'screen'>
                {loaded === false ? <div className ='loading'>Loading...</div> : null}
                <div className = 'banner'>{bannerText.map((letter, index) => <div key={index} className ='bannerLetters'>{letter}</div>)}</div>
                <img className = 'soundIcon' src={themePlaying ? playSound : muteSound} onClick ={() => toggleThemePlaying()}></img>
                {themePlaying === true ? <Theme/> : null}
                <div className = 'userInfo'>{props.displayName} <button className='logoutButton' onClick={() => signOutHandler()}>LOGOUT</button>
                    <div className = 'userInfoAge'>{ mood !== tommyDead ? `Age: ${tommyAge} days` : 'RIP Tommy'}</div>
                    <div className='userInfoLevel'>Level: {level}</div>
                    <div className='userInfoXP'>XP:{xp}/100</div>
                </div>
        
            <div className = 'options'>
                <img className = 'food icons noSelect' src={food} onClick={() => feedTommy(20)}></img>
                <img className = 'discipline icons noSelect' src ={discipline} onClick={() => disciplineTommy()}></img>
                <img className = 'clean icons noSelect' src={clean} onClick={() => cleanTommy()}></img>
                <img className = 'chat icons noSelect' src ={chat} onClick={() => randomDialogue()}></img>
                <img className = 'shop icons noSelect' src ={shop} onClick={() => setShopDisplay(true)}></img>
                <img className = 'battle icons noSelect' src ={battle} onClick={() => props.setBattling(true)}></img>
            </div>
            <div className = 'statInfoBox'>
                <div className = 'foodAmount statInfo'>Food
                    <div className = 'statBarOuter' style={{left: '50px'}}>
                        <div className = 'statBarInner' style={foodAmount > 0 ? {width: `${foodAmount}%`} : {width: '0%'}}></div>
                    </div>
                </div>
                <div className = 'disciplineAmount statInfo'>Discipline
                    <div className = 'statBarOuter' style = {{left: '110px'}}>
                        <div className = 'statBarInner' style={{width: `${disciplineAmount}%`, backgroundColor: 'red'}}></div>
                    </div>
                </div>
                {abuse ? 
                <div className='abuseAmount statInfo'>Physical Abuse
                    <div className = 'statBarOuter' style = {{left: '110px'}}>
                        <div className = 'statBarInner' style={{width: `${abuseAmount}%`, backgroundColor: 'orange'}}></div>
                    </div>
                </div> : null}
                <div className = 'hygieneAmount statInfo'>Hygiene
                    <div className = 'statBarOuter' style={{left: '80px'}}>
                        <div className = 'statBarInner' style={{width: `${hygieneAmount}%`, backgroundColor: 'green'}}></div>
                    </div>
                </div>
            </div>
            {abusePopUpWindow}
            <div className='healthBarOuter' style={{width: `${hp}px`}}>
                <img className = 'healthBar' src={healthBar}></img>
            </div>
            <div className='cash'>${cashAmount}</div>
            {shopDisplay ? <ShopWindow
             setShopDisplay={setShopDisplay}
             setShopPopUp={setShopPopUp}
             setInventory={setInventory}
             setCashAmount={setCashAmount}
             cashAmount={cashAmount}
             shopPopUp={shopPopUp}
            /> : null}
            <div className='inventory' onClick={() => setInventoryDisplay(true)}></div>
            {inventoryDisplay && mood !== tommyDead ? 
            <div className='inventoryContainer'>
                {inventoryPopUp}
                <button className='shopWindowExit' onClick={() => setInventoryDisplay(null)}>X</button>
                <div className ='shopItemContainer'>{inventory.map((object, index) => 
                    <div className='shopItem'>
                        <img className='shopItemImage' src={object.image} onClick={() => inventoryItemHandler(object)}></img>
                    </div>)}
                </div>
            </div> : null}
            <div className = 'chatBoxOuter'>
                <div className= 'chatBoxInner' style={{color: mood === tommyHappy ? 'white' : 'red'}}>{currentDialogue}</div>
            </div>
            { currentHat !== null ? 
            <img className='hatContainer' src={currentHat} style={{left: `${translateXValue}px`}}></img> : null}
            <img src={mood} alt={'tommy'} style={{left: `${translateXValue}px`}}className='tommy'/>
            <div>{poopX.map((item, index) => <img key ={index}className = 'poop' src={poop} style={{left: `${item}px`}}/>)}</div>
            </div>
        </div>
    )
}

export default Main
