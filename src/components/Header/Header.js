import React from 'react'
import LogoImage from './assets/logo.png'
import './Header.scss'

export const Header = () => (
    <div className='header'>
        <img
            alt='Atomic Object'
            className='logo'
            src={LogoImage} />
        <div className='text'>
            <div className='title'>LunchIt</div>
            <div className='description'>Coordinate your pair lunches with LunchIt!</div>
        </div>
    </div>
)

export default Header
