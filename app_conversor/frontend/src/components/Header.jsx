import React from 'react'
import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <div className="logo-icon">⚡</div>
                        <span className="logo-text">Unit<span className="text-gradient">Converter</span></span>
                    </div>

                    <nav className="nav">
                        <a href="#temperatura" className="nav-link">Temperatura</a>
                        <a href="#distancia" className="nav-link">Distancia</a>
                        <a href="#peso" className="nav-link">Peso</a>
                        <a href="#volumen" className="nav-link">Volumen</a>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
