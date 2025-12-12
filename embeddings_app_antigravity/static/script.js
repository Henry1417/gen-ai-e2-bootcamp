const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsArea = document.getElementById('resultsArea');

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Loading state
    searchBtn.innerHTML = '<div class="spinner"></div>';
    searchBtn.disabled = true;
    resultsArea.style.opacity = '0.5';

    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, limit: 10 }),
        });

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const data = await response.json();
        renderResults(data);
    } catch (error) {
        console.error('Error:', error);
        resultsArea.innerHTML = `<div class="empty-state">Error occurred. Please try again.</div>`;
    } finally {
        // Reset state
        searchBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        searchBtn.disabled = false;
        resultsArea.style.opacity = '1';
    }
}

function renderResults(results) {
    if (results.length === 0) {
        resultsArea.innerHTML = `<div class="empty-state">No relevant tickets found.</div>`;
        return;
    }

    const html = results.map(ticket => `
        <div class="ticket-card" style="animation: slideUp 0.5s ease-out">
            <div class="ticket-header">
                <span class="ticket-id">#${ticket.id}</span>
                <span class="score-badge">${(ticket.score * 100).toFixed(1)}% Match</span>
            </div>
            <div class="ticket-subject">${ticket.subject}</div>
            <div class="ticket-desc">${ticket.description}</div>
            <div class="category-tag">${ticket.category}</div>
        </div>
    `).join('');

    resultsArea.innerHTML = html;
}

// Event listeners
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Add spinner style dynamically
const style = document.createElement('style');
style.innerHTML = `
.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #0f172a;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
