import { React, useState, useEffect } from 'react'


import './Main.css'
function Theme() {

    let theme = new Audio('/theme.mp3')
    theme.loop = true
    
    useEffect(() => {
      theme.play()
    
      return () => {
        theme.pause()
      }
    }, [])
    
  return (
    <>
    </>
  )
}

export default Theme