import React from 'react'
import './HistoryPanel.css'

function HistoryPanel({ history, onClear }) {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Ahora'
        if (diffMins < 60) return `Hace ${diffMins}m`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `Hace ${diffHours}h`

        const diffDays = Math.floor(diffHours / 24)
        return `Hace ${diffDays}d`
    }

    return (
        <div className="history-panel glass-effect">
            <div className="history-header">
                <h3 className="history-title">
                    <span className="history-icon">📜</span>
                    Historial
                </h3>
                {history.length > 0 && (
                    <button className="clear-button" onClick={onClear}>
                        Limpiar
                    </button>
                )}
            </div>

            <div className="history-content">
                {history.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <p>No hay conversiones aún</p>
                        <span className="empty-hint">Realiza tu primera conversión</span>
                    </div>
                ) : (
                    <div className="history-list">
                        {history.map((item, index) => (
                            <div key={index} className="history-item">
                                <div className="history-item-header">
                                    <span className="history-time">{formatDate(item.timestamp)}</span>
                                </div>
                                <div className="history-conversion">
                                    <div className="history-value">
                                        <span className="value">{item.original_value}</span>
                                        <span className="unit">{item.from_unit}</span>
                                    </div>
                                    <span className="history-arrow">→</span>
                                    <div className="history-value">
                                        <span className="value highlight">{item.converted_value}</span>
                                        <span className="unit">{item.to_unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistoryPanel
