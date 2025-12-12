document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loading = document.getElementById('loading');

    // Function to perform search
    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        // UI Updates
        loading.classList.remove('hidden');
        resultsContainer.innerHTML = '';
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: query, limit: 5 })
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const results = await response.json();
            displayResults(results);

        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = `<div style="text-align:center; color: #ef4444;">Error fetching results. Is the backend running?</div>`;
        } finally {
            loading.classList.add('hidden');
        }
    };

    // Render results cards
    const displayResults = (results) => {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div style="text-align:center; color: var(--text-muted);">No similar tickets found.</div>';
            return;
        }

        results.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'ticket-card';
            
            // Format score as percentage
            const similarity = Math.round(ticket.score * 100);
            
            card.innerHTML = `
                <div class="ticket-header">
                    <span class="category-tag">${ticket.category}</span>
                    <span class="score-badge">${similarity}% Match</span>
                </div>
                <div class="ticket-title">#${ticket.id} - ${ticket.subject}</div>
                <div class="ticket-desc">${ticket.description}</div>
            `;
            
            resultsContainer.appendChild(card);
        });
    };

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
