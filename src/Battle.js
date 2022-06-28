import {React, useState, useEffect} from 'react'
import './Battle.css'
import { initializeApp } from "firebase/app";
import {getFirestore, setDoc, doc, getDoc} from "firebase/firestore"; 

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getAuth, signOut} from "firebase/auth";
import BattleMusic from './BattleMusic';

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

const tommyHappy = require('./tommyhappy.png');

const denny = require('./denny.png')

const lisasMom = require('./lisasmom.png')

const mark = require('./mark.png')

const battleBox = require('./battlebox.png')

const playSound = require('./playsound.png')

const muteSound = require('./mutesound.png')

const enemiesLevel0to3 = [
  
  {
    name: 'denny',
    hp: 5,
    image: denny,
    def: 12,
    attack: 10,
    strength: 1,
    loot: '50$',
    cash: 50,
    xp: 10,
    attacks: ['quick attack']
  },
  {
    name: `lisa's mom`,
    hp: 8,
    image: lisasMom,
    def: 8,
    attack: 4,
    strength: 2,
    loot: '70$',
    cash: 70,
    xp: 15,
    attacks: ['quick attack']
  },
]
const enemiesLevel4to6 = []

const enemiesLevel6to8 = []

const enemiesLevel8to10 = [
  {
    name: 'mark',
    hp: 20,
    image: mark,
    def: 10,
    attack: 10,
    strength: 4,
    loot: '10000$',
    cash: 10000,
    attacks: ['quick attack'],
    xp: 50,
  },
]

function Battle(props) {

  const [enemy, setEnemy] = useState({})

  const [enemyHp, setEnemyHp] = useState(0)

  const [enemyAnimation, setEnemyAnimation] = useState({})

  const [loaded, setLoaded] = useState(false)

  const [playerStats, setPlayerStats] = useState({})

  const [playerAnimation, setPlayerAnimation] = useState({})

  const [playerHp, setPlayerHp] = useState(0)

  const [playerXp, setPlayerXp] = useState(null)

  const [playerLevel, setPlayerLevel] = useState(null)

  const [playerCash, setPlayerCash] = useState(null)

  const [enemyLoaded, setEnemyLoaded] = useState(false)

  const [musicPlaying, setMusicPlaying] = useState(true)

  const [attackMessage, setAttackMessage] = useState('') 

  const [fightMenu, setFightMenu] = useState(false)

  const [playerTurn, setPlayerTurn] = useState(true)

  const [healthBarVisible, setHealthBarVisible] = useState(false)

  const [playerHpModifier, setPlayerHpModifier] = useState(null)

  const [enemyHpModifier, setEnemyHpModifier] = useState(null)

  const [battleEnded, setBattleEnded] = useState(false)

  const [leveledUp, setLeveledUp] = useState(false)


  async function fetchData () {
    
    const docSnap = await getDoc(doc(db, "users", props.userId))
    if(docSnap.exists()) {
      setPlayerStats(docSnap.data().combatStats)
      setPlayerHp(docSnap.data().combatStats.hp)
      setPlayerXp(docSnap.data().xp)
      setPlayerCash(docSnap.data().cashAmount)
      setPlayerLevel(docSnap.data().level)
      setLoaded(true)
    }
  }
  useEffect(() => {
    if(playerLevel <= 3) {
      let random = Math.floor(Math.random() * enemiesLevel0to3.length)
    setEnemy(enemiesLevel0to3[random])
    setEnemyLoaded(true)
    }
    
  },[])

  useEffect(() => {
    if(enemyLoaded === true) {
      setEnemyHp(enemy.hp)
      fetchData()
      setAttackMessage(`a wild ${enemy.name} has appeared.`)
      setPlayerAnimation({name: 'slideInPlayer', duration: '4s', direction: 'forwards', iteration: '1',})
      setEnemyAnimation({name: 'slideInEnemy', duration: '4s', direction: 'forwards', iteration: '1',})
      setTimeout(() => {setAttackMessage(''); setPlayerAnimation({});setHealthBarVisible(true)}, 4000)
    }
  },[enemyLoaded])

  const attackHandler = (attack, target) => {
    if(target === 'tommy' && enemyHp > 0) {
      
      if(attack === 'quick attack') {
        let d20 = Math.ceil(Math.random() * 20)
        if(d20 + enemy.attack > playerStats.def) {
          setPlayerAnimation({name: 'blinker', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
          if(playerHp - enemy.strength <= 0) {
            setPlayerHp(prevPlayerHp => prevPlayerHp - enemy.strength)
            setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
            setPlayerHpModifier(`-${enemy.strength}`)
            setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerHpModifier(null)}, 2000)
            return
          }
          if(d20 === 20) {
          setPlayerHp(prevPlayerHp => prevPlayerHp - (enemy.strength * 2))
          setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setAttackMessage(`${enemy.name} used ${attack}, it's a critical hit!`)
          setPlayerHpModifier(`-${enemy.strength * 2}`)
          setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)
          return
          }
          setPlayerHp(prevPlayerHp => prevPlayerHp - enemy.strength)
          setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setAttackMessage(`${enemy.name} used ${attack}`)
          setPlayerHpModifier(`-${enemy.strength}`)
          setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)

        } else {
          setAttackMessage(`${enemy.name} used ${attack}, but tommy blocked it!`)
          setPlayerTurn(true)
        }
      }
    } if(target === 'enemy') {
      
      if(attack === 'quick attack') {
        let d20 = Math.ceil(Math.random() * 20)
        if(d20 + playerStats.attack > enemy.def) {
          setEnemyAnimation({name: 'blinker', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
          if(enemyHp - playerStats.str <= 0) {
            setEnemyHp(prevEnemyHp => prevEnemyHp - playerStats.str)
            setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
            setEnemyHpModifier(`-${playerStats.str}`)
            setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setEnemyHpModifier(null)}, 2000)
          }
          if(d20 === 20) {
          setEnemyHp(prevEnemyHp => prevEnemyHp - (playerStats.str * 2))
          setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setAttackMessage(`tommy used ${attack}, it's a critical hit!`)
          setEnemyHpModifier(`-${playerStats.str * 2}`)
          setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000) 
          return
          }
          setEnemyHp(prevEnemyHp => prevEnemyHp - playerStats.str)
          setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setAttackMessage(`tommy used ${attack}`)
          setEnemyHpModifier(`-${playerStats.str}`)
          setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000)
          
        } else {
          setAttackMessage(`tommy used ${attack}, but ${enemy.name} blocked!`)
          setTimeout(() => {setPlayerTurn(false);}, 2000)
        }
      }
      
    }
  }

  const enemyAttackHandler = (enemyAttacks) => {
    let random = Math.floor(Math.random() * enemyAttacks.length)
    attackHandler(enemyAttacks[random], 'tommy')
  }

  useEffect(() => {
    if(playerTurn === false && enemyHp > 0) {
      setAttackMessage('')
      enemyAttackHandler(enemy.attacks)
    }
    if(playerTurn === true) {
      setAttackMessage('')
    }
    
  },[playerTurn])

  useEffect(() => {
    if(loaded === true) {
    if(playerHp <= 0) {
      setAttackMessage(`tommy was defeated by ${enemy.name}.`)
      setPlayerAnimation({name: 'blinker', duration: '0.5s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
      setAudio('playerdefeat')
      setTimeout(() => props.setBattling(false), 5000)
    }
    if(enemyHp <= 0) {
      setAttackMessage(`tommy defeated ${enemy.name}!`)
      setEnemyAnimation({name: 'blinker', duration: '0.5s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
      setAudio('playervictory')
      if(enemy.xp + playerXp >= 100) {
        setLeveledUp(true)
        setPlayerXp(prevXp => (prevXp + enemy.xp) - 100)
      }
      if(enemy.xp + playerXp < 100) {
        setPlayerXp(prevXp => prevXp + enemy.xp)
      }
      setTimeout(() => setBattleEnded(true), 5000)
    }
  }
  },[playerHp, enemyHp, loaded])



  const toggleMusic = () => {
    if(musicPlaying === true) {
      setMusicPlaying(false)
      return
  }
  setMusicPlaying(true)
  }

  async function exitBattleHandler() {
    await setDoc(doc(db, "users", props.userId), {
      xp: playerXp,
      cashAmount: playerCash + enemy.cash
  }, {merge: true});
  props.setBattling(false)
}

  async function levelUpHandler(stat) {
    console.log(stat)
    await setDoc(doc(db, "users", props.userId), {
      level: playerLevel + 1,
      combatStats: {
        [stat]: playerStats[stat] + 1
      }
  }, {merge: true});
  setLeveledUp(false)
  }

  const [audio, setAudio] = useState('battlemusic')
  return (
    <div>{loaded ? <div className='battleScreen'>
       <img className = 'soundIcon' src={musicPlaying ? playSound : muteSound} onClick ={() => toggleMusic()}></img>
       {musicPlaying ? <BattleMusic audio={audio}/> : undefined}
    <img className='enemy' src={enemy.image} style={enemyAnimation !== {} ? {animationName: enemyAnimation.name, animationDirection: enemyAnimation.direction, animationDuration: enemyAnimation.duration, animationIterationCount: enemyAnimation.iteration, animationTimingFunction: enemyAnimation.timingFunc} : undefined}></img>
  
  {healthBarVisible ? <div className='enemyInfo'>
  <div className='enemyHpModifier'>{enemyHpModifier}</div>
    <div className='enemyHpOuter'><div className='enemyHpInner' style={enemyHp > 0 ? {width: `${(enemyHp / enemy.hp) * 100}%`} : {width: '0%'}}></div></div>
  </div> : null}
    <img className='player' src={tommyHappy} style={playerAnimation !== {} ? {animationName: playerAnimation.name, animationDirection: playerAnimation.direction, animationDuration: playerAnimation.duration, animationIterationCount: playerAnimation.iteration, animationTimingFunction: playerAnimation.timingFunc} : undefined}></img>
  {healthBarVisible ? <div className ='playerInfo'>
    <div className='playerHpModifier'>{playerHpModifier}</div>
    <div className='playerHpOuter'><div className='playerHpInner' style={playerHp > 0 ? {width: `${(playerHp / playerStats.hp) * 100}%`} : {width: '0%'}}></div></div>
  </div> : null}
  {battleEnded ? <div className = 'battleEndedContainer'>
    <div className='lootInfo'>Loot:{enemy.loot}</div>
    <div className='xpInfo'>{leveledUp ? 'LEVEL UP!!!' : `Your XP: ${playerXp}/100 Level: ${playerLevel}`}</div>
    <div className='playerStatsInfo'>
      <div className='stat'>HP:{playerStats.hp}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('hp')}>+</div> : null}</div>
      <div className='stat'>ATTACK:{playerStats.attack}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('attack')}>+</div> : null}</div>
      <div className='stat'>STRENGTH:{playerStats.str}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('str')}>+</div> : null}</div>
      <div className='stat'>DEFENCE:{playerStats.def}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('def')}>+</div> : null}</div>
    </div>
    <div className='exitBattleButton' onClick={() => exitBattleHandler()}>exit battle</div>
  </div> : null}
  <button className='goBack' onClick={() => props.setBattling(false)}>Go back</button>
  <div className = 'battleBox'><img className='battleBoxImage' src={battleBox}></img>
  <div className = 'battleBoxText' onClick={() => setFightMenu(true)}>FIGHT</div>
  <div className = 'battleBoxText bag'>BAG</div>
  <div className = 'battleBoxText flee'>FLEE</div> 
  {fightMenu ? <div className='fightMenu'>{playerStats.attacks.map(item => <div className='playerAttacks' onClick={() => attackHandler(item, 'enemy')}>{item}</div>)}<img className='battleBoxImage' src={battleBox}></img></div> : null}
  </div>
  {attackMessage !== '' ? <div className='attackMessageContainer'><div className='attackMessageText'>{attackMessage}</div><img className='battleBoxImage' src={battleBox}></img></div> : null}
  </div> : <div>LOADING...</div>}
    
    </div>
  )
}

export default Battle