import React, { useState } from 'react'
import axios from 'axios'
import './ConversionCard.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function ConversionCard({ conversion, onConvert, gradient }) {
    const [inputValue, setInputValue] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleConvert = async () => {
        if (!inputValue || isNaN(inputValue)) {
            setError('Por favor ingresa un valor numérico válido')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(`${API_BASE_URL}/api/convert`, {
                value: parseFloat(inputValue),
                conversion_type: conversion.type,
            })

            setResult(response.data)
            onConvert(response.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al realizar la conversión')
            console.error('Conversion error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleConvert()
        }
    }

    const handleSwap = () => {
        if (result) {
            setInputValue(result.converted_value.toString())
            setResult(null)
        }
    }

    return (
        <div className="conversion-card glass-effect">
            <div className="card-header" style={{ background: gradient }}>
                <div className="conversion-label">
                    <span className="unit-from">{conversion.from_unit}</span>
                    <span className="arrow">→</span>
                    <span className="unit-to">{conversion.to_unit}</span>
                </div>
            </div>

            <div className="card-body">
                <div className="input-group">
                    <input
                        type="number"
                        className="conversion-input"
                        placeholder={`Ingresa valor en ${conversion.from_unit}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <button
                        className="convert-button"
                        onClick={handleConvert}
                        disabled={loading || !inputValue}
                        style={{ background: gradient }}
                    >
                        {loading ? (
                            <span className="button-spinner"></span>
                        ) : (
                            'Convertir'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="result-container">
                        <div className="result-value">
                            <span className="result-number">{result.converted_value}</span>
                            <span className="result-unit">{result.to_unit}</span>
                        </div>
                        <button className="swap-button" onClick={handleSwap} title="Intercambiar">
                            ⇄
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConversionCard
