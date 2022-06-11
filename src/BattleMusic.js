import { React, useEffect } from 'react'


import './Main.css'
function BattleMusic(props) {

    let theme = new Audio('/battlemusic.mp3')
    theme.loop = true

    let playervictory = new Audio('/playervictory.mp3')
    playervictory.loop = true

    let playerdefeat = new Audio('/playerdefeat.mp3')
    playerdefeat.loop = false
    
    useEffect(() => {
      if(props.audio === 'battlemusic') {
        theme.play()
      }
      if(props.audio === 'playervictory') {
        playervictory.play()
      }
      if(props.audio === 'playerdefeat') {
        playerdefeat.play()
      }
      return () => {
        theme.pause()
        playervictory.pause()
      }
    }, [props.audio])
    
  return (
    <>
    </>
  )
}

export default BattleMusic