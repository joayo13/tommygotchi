import React from 'react'
import './Main.css'
import uniqid from 'uniqid'

const potion = require('./potion.png')

const topHat = require('./tophat.png')

const bronzeSword = require('./bronzesword.png')

const wizardHat = require('./wizardhat.png')

const redWizardHat = require('./redwizardhat.png')

function ShopWindow(props) {
    const shopBuyHandler = (item) => {
        if(props.cashAmount - item.price >= 0) {
        props.setShopPopUp(<div className='shopPopUpWindow'>
        <p className='shopPopUpWindowText'>Buy {item.name}?</p>
        <button className = 'shopPopUpWindowButton' onClick={() => {
            item.id = uniqid()
            props.setInventory(prevInventory => prevInventory.concat(item)); 
            props.setCashAmount(prevCashAmount => prevCashAmount - item.price);
            props.setShopPopUp(null)}}>Confirm</button>
        <button className = 'shopPopUpWindowButton' onClick={() => props.setShopPopUp(null)}>Cancel</button>
        </div>
        )} else {
            props.setShopPopUp(<div className='shopPopUpWindow'>
            <p className='shopPopUpWindowText'>Tommy doesn't have enough cash.</p>
            <button className = 'shopPopUpWindowButton' onClick={() => props.setShopPopUp(null)}>Okay</button>
            <button className = 'shopPopUpWindowButton' onClick={() => props.setShopPopUp(null)}>Fuck you</button>
        </div>)
        }
    }
  return (
    <div className='shopWindow'>
            {props.shopPopUp}
            <div className='shopWindowCash'>Your cash: <span style={{color: 'green'}}>${props.cashAmount}</span></div>
            <button className='shopWindowExit noSelect'onClick={() => {props.setShopDisplay(false); props.setShopPopUp(null)}}>X</button>
            <div className='shopItemContainer'>
            <div className='shopItem'>
                <img className='shopItemImage' alt ='health potion' src={potion} onClick={() => shopBuyHandler({name: 'potion', 
                image: potion,
                price: 20, 
                type: 'consumable',
                })}></img>
                <div className='shopItemPrice'>$20</div>
            </div>
            <div className='shopItem'>
                <img className='shopItemImage' src={topHat} onClick={() => shopBuyHandler({name: 'Top Hat', 
                image: topHat,
                price: 100, 
                type: 'hat',
                })}></img>
                <div className='shopItemPrice'>$100</div>
            </div>
            <div className='shopItem'>
                <img className='shopItemImage' src={bronzeSword} onClick={() => shopBuyHandler({name: 'Bronze Sword', 
                image: bronzeSword,
                price: 50, 
                type: 'weapon',
                })}></img>
                <div className='shopItemPrice'>$50</div>
            </div>
            <div className='shopItem'>
            <img className='shopItemImage' src={wizardHat} onClick={() => shopBuyHandler({name: 'Wizard Hat', 
                image: wizardHat,
                price: 500, 
                type: 'hat',
                })}></img>
                <div className='shopItemPrice'>$500</div>
            </div>
            <div className='shopItem'>
            <img className='shopItemImage' src={redWizardHat} onClick={() => shopBuyHandler({name: 'Red Wizard Hat', 
                image: redWizardHat,
                price: 2000, 
                type: 'hat',
                })}></img>
                <div className='shopItemPrice'>$2000</div>
            </div>
            </div>
        </div>
  )
}

export default ShopWindow