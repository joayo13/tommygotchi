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

const doggie = require('./doggie.png')

const battleBox = require('./battlebox.png')

const playSound = require('./playsound.png')

const muteSound = require('./mutesound.png')

const quickAttackSound = new Audio('/quickattack.mp3')

const powerAttackSound = new Audio('/powerattack.mp3')

const enemiesLevel1to3 = [
  
  {
    name: 'denny',
    hp: 5,
    image: denny,
    def: 5,
    attack: 5,
    strength: 3,
    loot: '50$',
    cash: 50,
    xp: 30,
    attacks: ['quick attack']
  },
  {
    name: `lisa's mom`,
    hp: 7,
    image: lisasMom,
    def: 5,
    attack: 4,
    strength: 3,
    loot: '70$',
    cash: 70,
    xp: 40,
    attacks: ['quick attack', 'power attack']
  },
  {
   name: 'doggie',
   hp: 10,
   image: doggie,
   def: 1,
   attack: 1,
   strength: 5,
   loot: '100$',
   cash: 100,
   xp: 50,
   attacks: ['power attack', 'intimidate']
  }
]
const enemiesLevel4to6 = []

const enemiesLevel7to9 = []

const enemiesLevel10 = [
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

  const [temporaryPlayerStats, setTemporaryPlayerStats] = useState({})

  const [playerAnimation, setPlayerAnimation] = useState({})

  const [playerHp, setPlayerHp] = useState(0)

  const [playerXp, setPlayerXp] = useState(null)

  const [playerLevel, setPlayerLevel] = useState(null)

  const [playerCash, setPlayerCash] = useState(null)

  const [playerHat, setPlayerHat] = useState(null)

  const [playerInventory, setPlayerInventory] = useState(null)

  const [enemyLoaded, setEnemyLoaded] = useState(false)

  const [musicPlaying, setMusicPlaying] = useState(true)

  const [attackMessage, setAttackMessage] = useState('') 

  const [fightMenu, setFightMenu] = useState(false)

  const [inventoryMenu, setInventoryMenu] = useState(false)

  const [inventoryPopUp, setInventoryPopUp] = useState(false)

  const [newMovePopUp, setNewMovePopUp] = useState(false)

  const [playerTurn, setPlayerTurn] = useState(true)

  const [healthBarVisible, setHealthBarVisible] = useState(false)

  const [playerHpModifier, setPlayerHpModifier] = useState(null)

  const [enemyHpModifier, setEnemyHpModifier] = useState(null)

  const [battleEnded, setBattleEnded] = useState(false)

  const [leveledUp, setLeveledUp] = useState(false)

  const quickAttackHandler = (attack, target) => {
    let d20 = Math.ceil(Math.random() * 20)
    const ENEMY_DMG = Math.ceil(Math.random() * (enemy.strength / 2))
    const PLAYER_DMG = Math.ceil(Math.random() * (temporaryPlayerStats.str / 2))
    if (target === 'tommy') {
      if(d20 + enemy.attack > temporaryPlayerStats.def) {
        quickAttackSound.play()
        setPlayerAnimation({name: 'blinker', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
        if(playerHp - ENEMY_DMG <= 0) {
          setPlayerHp(prevPlayerHp => prevPlayerHp - ENEMY_DMG)
          setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setPlayerHpModifier(`-${ENEMY_DMG}`)
          setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerHpModifier(null)}, 2000)
          return
        }
        if(d20 === 20) {
        setPlayerHp(prevPlayerHp => prevPlayerHp - (ENEMY_DMG * 2))
        setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`${enemy.name} used ${attack}, it's a critical hit!`)
        setPlayerHpModifier(`-${ENEMY_DMG * 2}`)
        setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)
        return
        }
        setPlayerHp(prevPlayerHp => prevPlayerHp - ENEMY_DMG)
        setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`${enemy.name} used ${attack}`)
        setPlayerHpModifier(`-${ENEMY_DMG}`)
        setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)
  
      } else {
        setAttackMessage(`${enemy.name} used ${attack}, but tommy blocked it!`)
        setTimeout(() => {setPlayerTurn(true);}, 2000)
      }
    }
    if(target === 'enemy') {
      if(d20 + temporaryPlayerStats.attack > enemy.def) {
        quickAttackSound.play()
        setEnemyAnimation({name: 'blinker', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
        if(enemyHp - PLAYER_DMG <= 0) {
          setEnemyHp(prevEnemyHp => prevEnemyHp - PLAYER_DMG)
          setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setEnemyHpModifier(`-${PLAYER_DMG}`)
          setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setEnemyHpModifier(null)}, 2000)
        }
        if(d20 === 20) {
        setEnemyHp(prevEnemyHp => prevEnemyHp - (PLAYER_DMG * 2))
        setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`tommy used ${attack}, it's a critical hit!`)
        setEnemyHpModifier(`-${PLAYER_DMG * 2}`)
        setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000) 
        return
        }
        setEnemyHp(prevEnemyHp => prevEnemyHp - PLAYER_DMG)
        setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`tommy used ${attack}`)
        setEnemyHpModifier(`-${PLAYER_DMG}`)
        setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000) 
      } else {
        setAttackMessage(`tommy used ${attack}, but ${enemy.name} blocked!`)
        setTimeout(() => {setPlayerTurn(false);}, 2000)
      }
    }
  }
  const powerAttackHandler = (attack, target) => {
    let d20 = Math.ceil(Math.random() * 20)
    const ENEMY_DMG = Math.ceil(Math.random() * enemy.strength + 1)
    const PLAYER_DMG = Math.ceil(Math.random() * temporaryPlayerStats.str + 1)
    if (target === 'tommy') {
      if(d20 + (enemy.attack - 10) > temporaryPlayerStats.def) {
        powerAttackSound.play()
        setPlayerAnimation({name: 'inverter', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
        if(playerHp - ENEMY_DMG <= 0) {
          setPlayerHp(prevPlayerHp => prevPlayerHp - ENEMY_DMG)
          setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setPlayerHpModifier(`-${ENEMY_DMG}`)
          setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerHpModifier(null)}, 2000)
          return
        }
        if(d20 === 20) {
          if(playerHp - (ENEMY_DMG * 2) <= 0) {
            setPlayerHp(prevPlayerHp => prevPlayerHp - (ENEMY_DMG * 2))
            setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
            setPlayerHpModifier(`-${ENEMY_DMG}`)
            setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerHpModifier(null)}, 2000)
            return
          }
        setPlayerHp(prevPlayerHp => prevPlayerHp - (ENEMY_DMG * 2))
        setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`${enemy.name} used ${attack}, it's a critical hit!`)
        setPlayerHpModifier(`-${ENEMY_DMG * 2}`)
        setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)
        return
        }
        setPlayerHp(prevPlayerHp => prevPlayerHp - ENEMY_DMG)
        setEnemyAnimation({name: 'enemyQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`${enemy.name} used ${attack}`)
        setPlayerHpModifier(`-${ENEMY_DMG}`)
        setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setPlayerTurn(true); setPlayerHpModifier(null)}, 2000)
  
      } else {
        setAttackMessage(`${enemy.name} used ${attack}, but tommy blocked it!`)
        setTimeout(() => setPlayerTurn(true), 2000)
      }
    }
    if(target === 'enemy') {
      if(d20 + (temporaryPlayerStats.attack - 10) > enemy.def) {
        powerAttackSound.play()
        setEnemyAnimation({name: 'inverter', duration: '0.1s', iteration: 5, direction: 'alternate', timingFunc: 'step-start'})
        if(enemyHp - PLAYER_DMG <= 0) {
          setEnemyHp(prevEnemyHp => prevEnemyHp - PLAYER_DMG)
          setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
          setEnemyHpModifier(`-${PLAYER_DMG}`)
          setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setEnemyHpModifier(null)}, 2000)
        }
        if(d20 === 20) {
            if(enemyHp - (PLAYER_DMG * 2) <= 0) {
              setEnemyHp(prevEnemyHp => prevEnemyHp - ENEMY_DMG)
              setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
              setPlayerHpModifier(`-${PLAYER_DMG}`)
              setTimeout(() => {setPlayerAnimation({}); setEnemyAnimation({}); setEnemyHpModifier(null)}, 2000)
              return
            }
        setEnemyHp(prevEnemyHp => prevEnemyHp - (PLAYER_DMG * 2))
        setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`tommy used ${attack}, it's a critical hit!`)
        setEnemyHpModifier(`-${PLAYER_DMG * 2}`)
        setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000) 
        return
        }
        setEnemyHp(prevEnemyHp => prevEnemyHp - PLAYER_DMG)
        setPlayerAnimation({name: 'playerQuickAttack', duration: '0.1s', iteration: 2, direction: 'alternate',})
        setAttackMessage(`tommy used ${attack}`)
        setEnemyHpModifier(`-${PLAYER_DMG}`)
        setTimeout(() => {setEnemyAnimation({}); setPlayerAnimation({}); setPlayerTurn(false);setEnemyHpModifier(null)}, 2000)
        
      } else {
        setAttackMessage(`tommy used ${attack}, but ${enemy.name} blocked!`)
        setTimeout(() => {setPlayerTurn(false);}, 2000)
      }
    }
  }

  const intimidateHandler = (attack, target) => {
    let d20 = Math.ceil(Math.random() * 20)
    if(target === 'tommy') {
      if(d20 > 10) {
        setEnemyAnimation({name: 'grower', duration: '1s', iteration: 1, direction: 'alternate'})
        setAttackMessage(`${enemy.name} used ${attack}, it lowered your defense!`)
        setTemporaryPlayerStats(prev => ({
          ...prev,
          def: prev.def - 1
        }));
      }
      if(d20 <= 10) {
        setAttackMessage(`${enemy.name} used ${attack}, but it missed!`)
      }
      setTimeout(() => {setEnemyAnimation({}); setPlayerTurn(true)}, 2000)
    }

    if(target === 'enemy') {
      if(d20 > 10) {
        setPlayerAnimation({name: 'grower', duration: '1s', iteration: 1, direction: 'alternate'})
        setAttackMessage(`tommy used ${attack}, it lowered the foes defense!`)
        setEnemy(prev => ({
          ...prev,
          def: prev.def - 1
        }));
      }
      if(d20 <= 10) {
        setAttackMessage(`tommy used ${attack}, but it missed!`)
      }
      setTimeout(() => {setPlayerAnimation({}); setPlayerTurn(false)}, 2000)
    }
  }
  const rageHandler = (attack, target) => {
    let d20 = Math.ceil(Math.random() * 20)
    if(target === 'tommy') {
      if(d20 > 10) {
        setEnemyAnimation({name: 'shaker', duration: '0.1s', iteration: 15, direction: 'alternate'})
        setAttackMessage(`${enemy.name} used ${attack}, their rage is building!`)
        setEnemy(prev => ({
          ...prev,
          strength: prev.strength + 1
        }));
      }
      if(d20 <= 10) {
        setAttackMessage(`${enemy.name} used ${attack}, but it missed!`)
      }
      setTimeout(() => {setEnemyAnimation({}); setPlayerTurn(true)}, 2000)
    }

    if(target === 'enemy') {
      if(d20 > 10) {
        setPlayerAnimation({name: 'shaker', duration: '0.1s', iteration: 15, direction: 'alternate'})
        setAttackMessage(`tommy used ${attack}, their rage is building!`)
        setTemporaryPlayerStats(prev => ({
          ...prev,
          str: prev.str + 1
        }));
      }
      if(d20 <= 10) {
        setAttackMessage(`tommy used ${attack}, but it missed!`)
      }
      setTimeout(() => {setPlayerAnimation({}); setPlayerTurn(false)}, 2000)
    }
  }


  async function fetchData () {
    
    const docSnap = await getDoc(doc(db, "users", props.userId))
    if(docSnap.exists()) {
      setPlayerStats(docSnap.data().combatStats)
      setPlayerInventory(docSnap.data().inventory)
      setTemporaryPlayerStats(docSnap.data().combatStats)
      setPlayerHp(docSnap.data().combatStats.hp)
      setPlayerXp(docSnap.data().xp)
      setPlayerCash(docSnap.data().cashAmount)
      setPlayerLevel(docSnap.data().level)
      setPlayerHat(docSnap.data().currentHat)
      setLoaded(true)
    }
  }
  useEffect(() => {
    if(playerLevel <= 3) {
      let random = Math.floor(Math.random() * enemiesLevel1to3.length)
    setEnemy(enemiesLevel1to3[random])
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
    if(attack === 'quick attack') quickAttackHandler(attack, target)
    if(attack === 'power attack') powerAttackHandler(attack, target)
    if(attack === 'intimidate') intimidateHandler(attack, target)
    if(attack === 'rage') rageHandler(attack, target)
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
      setPlayerAnimation({name: 'blinker', duration: '0.5s', iteration: 4, direction: 'alternate', timingFunc: 'step-start'})
      setAudio('playerdefeat')
      setTimeout(() => props.setBattling(false), 5000)
    }
    if(enemyHp <= 0) {
      setAttackMessage(`tommy defeated ${enemy.name}!`)
      setEnemyAnimation({name: 'blinker', duration: '0.5s', iteration: 4, direction: 'alternate', timingFunc: 'step-start'})
      setAudio('playervictory')
      if(enemy.xp + playerXp >= 100) {
        setLeveledUp(true)
        setPlayerXp(prevXp => (prevXp + enemy.xp) - 100)
      }
      if(enemy.xp + playerXp < 100) {
        setPlayerXp(prevXp => prevXp + enemy.xp)
      }
      setTimeout(() => {levelUpNewMove(); setBattleEnded(true)}, 5000)
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
      cashAmount: playerCash + enemy.cash,
      inventory: playerInventory,
  }, {merge: true});
  props.setBattling(false)
}
  async function levelUpNewMove() {
      if(playerLevel + 1 === 2) {
        await setDoc(doc(db, "users", props.userId), {
          combatStats: {
            attacks: ['quick attack', 'power attack']
          }
        }, {merge: true});
        setNewMovePopUp(<div className='newMovePopUpWindow'>
          <div className='newMovePopUpWindowText'>
            Tommy learned <span style={{color: 'red'}}>Power Attack!</span>
          </div>
          <p style={{fontSize: '10px'}}>Power Attack deals more damage at the expense of accuracy.</p>
          <button className='newMovePopUpWindowButton' onClick={() => setNewMovePopUp(false)}>Okay</button>
        </div>)
      } 
      if(playerLevel + 1 === 3) {
        await setDoc(doc(db, "users", props.userId), {
          combatStats: {
            attacks: ['quick attack', 'power attack', 'intimidate']
          }
        }, {merge: true});
        setNewMovePopUp(<div className='newMovePopUpWindow'>
          <div className='newMovePopUpWindowText'>
            Tommy learned <span style={{color: 'red'}}>Intimidate!</span>
          </div>
          <p style={{fontSize: '10px'}}>Intimidate has a 50/50 chance to hit. If it does, lower the targets defence by 1. Perfect for setting up Power Attacks.</p>
          <button className='newMovePopUpWindowButton' onClick={() => setNewMovePopUp(false)}>Okay</button>
        </div>)
      } 
      if(playerLevel + 1 === 4) {
        await setDoc(doc(db, "users", props.userId), {
          combatStats: {
            attacks: ['quick attack', 'power attack', 'intimidate', 'rage']
          }
        }, {merge: true});
        setNewMovePopUp(<div className='newMovePopUpWindow'>
          <div className='newMovePopUpWindowText'>
            Tommy learned <span style={{color: 'red'}}>Rage!</span>
          </div>
          <p style={{fontSize: '10px'}}>Rage has a 50/50 chance to hit. If it does, increase your strength by 1.</p>
          <button className='newMovePopUpWindowButton' onClick={() => setNewMovePopUp(false)}>Okay</button>
        </div>)
      } 
  }

  async function levelUpHandler(stat) {
    if(stat === 'hp') {
      playerStats[stat] = playerStats[stat] + 2
    } else {
      playerStats[stat] = playerStats[stat] + 1
    }
    
    await setDoc(doc(db, "users", props.userId), {
      level: playerLevel + 1,
      combatStats: {
        [stat]: playerStats[stat]
      }
  }, {merge: true});
  setLeveledUp(false)
  }
  const inventoryItemUseHandler = (item) => {
    if (item.name === 'potion') {
      if(playerHp + 4 <= playerStats.hp) {
        setPlayerHp(prev => prev + 4)
        setAttackMessage('tommy used a health potion! it restored 4hp')
        setPlayerInventory(playerInventory.filter((obj) => obj.id !== item.id));
        setTimeout(() =>{setAttackMessage(''); setPlayerTurn(false); setInventoryMenu(false)}, 2000)
      }
    }
}

  const inventoryItemHandler = (item) => {
    if(item.type === 'consumable') {
        setInventoryPopUp(
        <div className='inventoryPopUpWindow'>
            <p className='inventoryPopUpWindowText'>Use {item.name}?</p>
            <button className = 'inventoryPopUpWindowButton' onClick={() => {
            inventoryItemUseHandler(item)
            setInventoryPopUp(null)}}>Confirm</button>
            <button className = 'inventoryPopUpWindowButton' onClick={() => setInventoryPopUp(null)}>Cancel</button>
        </div>)
    } 
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
    <div className='player' style={playerAnimation !== {} ? 
    {animationName: playerAnimation.name, animationDirection: playerAnimation.direction,
     animationDuration: playerAnimation.duration, animationIterationCount: playerAnimation.iteration,
      animationTimingFunction: playerAnimation.timingFunc} : undefined}>
    <img className='playerHead' src={tommyHappy} ></img>
    {playerHat ? <img className='playerHat' src={playerHat}></img> : null}
    </div>
    
  {healthBarVisible ? <div className ='playerInfo'>
    <div className='playerHpModifier'>{playerHpModifier}</div>
    <div className='playerHpOuter'><div className='playerHpInner' style={playerHp > 0 ? {width: `${(playerHp / playerStats.hp) * 100}%`} : {width: '0%'}}></div></div>
  </div> : null}
  {battleEnded ? <div className = 'battleEndedContainer'>
    <div className='lootInfo'>Loot:{enemy.loot}</div>
    <div className='xpInfo'>{leveledUp ? `LVL UP! XP: ${playerXp}/100 Level: ${playerLevel + 1}` : `Your XP: ${playerXp}/100 Level: ${playerLevel}`}</div>
    <div className='playerStatsInfo'>
      <div className='stat'>HP:{playerStats.hp}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('hp')}>+</div> : null}</div>
      <div className='stat'>ATTACK:{playerStats.attack}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('attack')}>+</div> : null}</div>
      <div className='stat'>STRENGTH:{playerStats.str}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('str')}>+</div> : null}</div>
      <div className='stat'>DEFENCE:{playerStats.def}{leveledUp ? <div className='levelUpStat' onClick={()=> levelUpHandler('def')}>+</div> : null}</div>
    </div>
    <div className='exitBattleButton' onClick={() => exitBattleHandler()}>EXIT BATTLE</div>
  </div> : null}
  <div className = 'battleBox'><img className='battleBoxImage' src={battleBox}></img>
  <div className = 'battleBoxText' onClick={() => setFightMenu(true)}>FIGHT</div>
  <div className = 'battleBoxText bag' onClick={() => setInventoryMenu(true)}>BAG</div>
  {inventoryMenu ? <div className='inventoryMenu'><button className='returnButton' onClick={() => setInventoryMenu(false)}>←</button>
  {playerInventory.map(item => item.type === 'consumable' ? <img src={item.image} className = 'inventoryItem' onClick={() => inventoryItemHandler(item)}></img> : null)}<img className='battleBoxImage' src={battleBox}></img></div> : null}
  <div className = 'battleBoxText flee' onClick={() => {setAttackMessage('You ran away like a little bitch!'); setAudio('playerdefeat'); setTimeout(() => props.setBattling(false), 3000)}}>FLEE</div>
  {fightMenu ? <div className='fightMenu'><button className='returnButton' onClick={() => setFightMenu(false)}>←</button>{playerStats.attacks.map(item => <div className='playerAttacks' onClick={() => attackHandler(item, 'enemy')}>{item}</div>)}<img className='battleBoxImage' src={battleBox}></img></div> : null}
  </div>
  {newMovePopUp}
  {inventoryPopUp}
  {attackMessage !== '' ? <div className='attackMessageContainer'><div className='attackMessageText'>{attackMessage}</div><img className='battleBoxImage' src={battleBox}></img></div> : null}
  </div> : <div>LOADING...</div>}
    
    </div>
  )
}

export default Battle