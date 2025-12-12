// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const classifyTab = document.getElementById('classifyTab');
const searchTab = document.getElementById('searchTab');

const subjectInput = document.getElementById('subjectInput');
const descriptionInput = document.getElementById('descriptionInput');
const classifyBtn = document.getElementById('classifyBtn');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const classifyResultsArea = document.getElementById('classifyResultsArea');
const searchResultsArea = document.getElementById('searchResultsArea');

// State
let currentNewTicket = null;

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Update buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        if (tab === 'classify') {
            classifyTab.classList.add('active');
            searchTab.classList.remove('active');
        } else {
            classifyTab.classList.remove('active');
            searchTab.classList.add('active');
        }
    });
});

// Classify Ticket
classifyBtn.addEventListener('click', async () => {
    const subject = subjectInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!subject || !description) {
        alert('Please enter both subject and description');
        return;
    }

    // Loading state
    classifyBtn.innerHTML = '<div class="spinner"></div>';
    classifyBtn.disabled = true;

    try {
        const response = await fetch('/api/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, description }),
        });

        if (!response.ok) {
            throw new Error('Classification failed');
        }

        const data = await response.json();

        // Store current ticket data
        currentNewTicket = {
            subject,
            description,
            category: data.category,
            confidence: data.confidence,
            suggestions: data.suggestions
        };

        renderClassificationResults(data);
    } catch (error) {
        console.error('Error:', error);
        classifyResultsArea.innerHTML = `<div class="empty-state">Error occurred. Please try again.</div>`;
    } finally {
        classifyBtn.innerHTML = '<span>Classify Ticket</span>';
        classifyBtn.disabled = false;
    }
});

// Search Tickets
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    searchBtn.innerHTML = '<div class="spinner"></div>';
    searchBtn.disabled = true;
    searchResultsArea.style.opacity = '0.5';

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
        renderSearchResults(data);
    } catch (error) {
        console.error('Error:', error);
        searchResultsArea.innerHTML = `<div class="empty-state">Error occurred. Please try again.</div>`;
    } finally {
        searchBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        searchBtn.disabled = false;
        searchResultsArea.style.opacity = '1';
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Render Classification Results
function renderClassificationResults(data) {
    const newTicketHtml = `
        <div class="new-ticket-card" id="newTicketCard">
            <span class="new-ticket-badge">New Ticket - Classified</span>
            
            <div class="ticket-header">
                <span class="ticket-id">NEW</span>
                <span class="confidence-badge">${(data.confidence * 100).toFixed(1)}% Confidence</span>
            </div>
            
            <div class="ticket-subject editable" contenteditable="true" id="editableSubject">${currentNewTicket.subject}</div>
            <div class="ticket-desc editable" contenteditable="true" id="editableDescription">${currentNewTicket.description}</div>
            
            <div class="category-tag" id="currentCategory">${data.category}</div>
            
            <div class="category-suggestions">
                <h4>Other Suggested Categories:</h4>
                <div class="suggestions-list">
                    ${data.suggestions.map(s => `
                        <span class="suggestion-item" onclick="changeCategory('${s.category}')">
                            ${s.category}
                            <span class="suggestion-confidence">${(s.confidence * 100).toFixed(0)}%</span>
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="ticket-actions">
                <button class="btn-save" onclick="saveTicket()">💾 Save Ticket</button>
                <button class="btn-reclassify" onclick="reclassifyTicket()">🔄 Re-classify</button>
            </div>
        </div>
    `;

    const similarTicketsHtml = data.similar_tickets.length > 0
        ? data.similar_tickets.map(ticket => createTicketCard(ticket)).join('')
        : '<div class="empty-state">No similar tickets found.</div>';

    classifyResultsArea.innerHTML = newTicketHtml + '<h3 style="color: #94a3b8; margin: 2rem 0 1rem 0; font-size: 1.1rem;">Similar Tickets</h3>' + similarTicketsHtml;
}

// Render Search Results
function renderSearchResults(results) {
    if (results.length === 0) {
        searchResultsArea.innerHTML = `<div class="empty-state">No relevant tickets found.</div>`;
        return;
    }

    const html = results.map(ticket => createTicketCard(ticket)).join('');
    searchResultsArea.innerHTML = html;
}

// Create Ticket Card HTML
function createTicketCard(ticket) {
    return `
        <div class="ticket-card" style="animation: slideUp 0.5s ease-out">
            <div class="ticket-header">
                <span class="ticket-id">#${ticket.id}</span>
                <span class="score-badge">${(ticket.score * 100).toFixed(1)}% Match</span>
            </div>
            <div class="ticket-subject">${ticket.subject}</div>
            <div class="ticket-desc">${ticket.description}</div>
            <div class="category-tag">${ticket.category}</div>
        </div>
    `;
}

// Change Category
window.changeCategory = function (newCategory) {
    currentNewTicket.category = newCategory;
    document.getElementById('currentCategory').textContent = newCategory;

    // Visual feedback
    const categoryTag = document.getElementById('currentCategory');
    categoryTag.style.background = 'rgba(56, 189, 248, 0.2)';
    categoryTag.style.color = '#38bdf8';

    setTimeout(() => {
        categoryTag.style.background = 'rgba(255, 255, 255, 0.05)';
        categoryTag.style.color = '#cbd5e1';
    }, 1000);
};

// Save Ticket
window.saveTicket = async function () {
    // Get potentially edited values
    const editedSubject = document.getElementById('editableSubject').textContent.trim();
    const editedDescription = document.getElementById('editableDescription').textContent.trim();

    if (!editedSubject || !editedDescription) {
        alert('Subject and description cannot be empty');
        return;
    }

    try {
        const response = await fetch('/api/add-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: editedSubject,
                description: editedDescription,
                category: currentNewTicket.category
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save ticket');
        }

        const data = await response.json();

        // Remove action buttons and show success message
        const actionsDiv = document.querySelector('.ticket-actions');
        actionsDiv.innerHTML = `
            <div style="text-align: center; color: var(--success-color); font-weight: 600; padding: 1rem;">
                ✅ Ticket #${data.id} saved successfully!
            </div>
        `;

        // Make fields non-editable
        document.getElementById('editableSubject').contentEditable = 'false';
        document.getElementById('editableDescription').contentEditable = 'false';
        document.getElementById('editableSubject').classList.remove('editable');
        document.getElementById('editableDescription').classList.remove('editable');

        // Clear form
        subjectInput.value = '';
        descriptionInput.value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save ticket. Please try again.');
    }
};

// Reclassify Ticket
window.reclassifyTicket = async function () {
    // Get potentially edited values
    const editedSubject = document.getElementById('editableSubject').textContent.trim();
    const editedDescription = document.getElementById('editableDescription').textContent.trim();

    if (!editedSubject || !editedDescription) {
        alert('Subject and description cannot be empty');
        return;
    }

    // Update inputs
    subjectInput.value = editedSubject;
    descriptionInput.value = editedDescription;

    // Trigger classification again
    classifyBtn.click();
};
