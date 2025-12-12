import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import ConversionCard from './components/ConversionCard'
import HistoryPanel from './components/HistoryPanel'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
    const [conversions, setConversions] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchConversions()
        loadHistory()
    }, [])

    const fetchConversions = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/api/conversions`)
            setConversions(response.data.conversions)
            setError(null)
        } catch (err) {
            setError('Error al cargar las conversiones disponibles')
            console.error('Error fetching conversions:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadHistory = () => {
        const savedHistory = localStorage.getItem('conversionHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }

    const saveToHistory = (conversion) => {
        const newHistory = [
            {
                ...conversion,
                timestamp: new Date().toISOString(),
            },
            ...history.slice(0, 19), // Keep last 20 conversions
        ]
        setHistory(newHistory)
        localStorage.setItem('conversionHistory', JSON.stringify(newHistory))
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem('conversionHistory')
    }

    // Group conversions by category
    const groupedConversions = conversions.reduce((acc, conv) => {
        let category = 'Otros'

        if (conv.type.includes('celsius') || conv.type.includes('fahrenheit')) {
            category = 'Temperatura'
        } else if (conv.type.includes('miles') || conv.type.includes('kilometers') ||
            conv.type.includes('feet') || conv.type.includes('meters') ||
            conv.type.includes('inches') || conv.type.includes('centimeters')) {
            category = 'Distancia'
        } else if (conv.type.includes('pounds') || conv.type.includes('kilograms') ||
            conv.type.includes('ounces') || conv.type.includes('grams')) {
            category = 'Peso'
        } else if (conv.type.includes('gallons') || conv.type.includes('liters')) {
            category = 'Volumen'
        }

        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(conv)
        return acc
    }, {})

    const categoryIcons = {
        'Temperatura': '🌡️',
        'Distancia': '📏',
        'Peso': '⚖️',
        'Volumen': '🧪',
    }

    const categoryGradients = {
        'Temperatura': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'Distancia': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'Peso': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'Volumen': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    }

    if (loading) {
        return (
            <div className="app">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando conversiones...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="app">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchConversions} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            <Header />

            <main className="main-content container">
                <section className="hero-section fade-in">
                    <h1 className="hero-title">
                        Conversor de <span className="text-gradient">Unidades</span>
                    </h1>
                    <p className="hero-subtitle">
                        Convierte fácilmente entre sistema métrico e imperial
                    </p>
                </section>

                <div className="content-grid">
                    <div className="conversions-section">
                        {Object.entries(groupedConversions).map(([category, items], idx) => (
                            <div
                                key={category}
                                className="category-section slide-in"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="category-header">
                                    <span className="category-icon">{categoryIcons[category]}</span>
                                    <h2 className="category-title">{category}</h2>
                                    <div
                                        className="category-accent"
                                        style={{ background: categoryGradients[category] }}
                                    ></div>
                                </div>

                                <div className="conversion-grid">
                                    {items.map((conversion) => (
                                        <ConversionCard
                                            key={conversion.type}
                                            conversion={conversion}
                                            onConvert={saveToHistory}
                                            gradient={categoryGradients[category]}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="sidebar">
                        <HistoryPanel
                            history={history}
                            onClear={clearHistory}
                        />
                    </aside>
                </div>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>© 2025 Conversor de Unidades | Desarrollado con FastAPI y React</p>
                </div>
            </footer>
        </div>
    )
}

export default App
