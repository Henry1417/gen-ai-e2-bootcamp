// Map Initialization
const map = L.map('map').setView([48.8566, 2.3522], 13); // Default to Paris

// Dark Mode Map Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// State
let startPoint = null;
let endPoint = null;
let startMarker = null;
let endMarker = null;
let resultMarkers = [];

// Elements
const startInput = document.getElementById('start-input');
const endInput = document.getElementById('end-input');
const discoverBtn = document.getElementById('discover-btn');
const resultsContainer = document.getElementById('results-container');
const loadMoreBtn = document.getElementById('load-more-btn');

// Helper: Reverse Geocoding
async function getPlaceName(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
        const response = await fetch(url, { headers: { 'User-Agent': 'TurimoApp/1.0' } });
        const data = await response.json();
        // Return City/Town + Country, or just display_name shortened
        if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const country = data.address.country;
            if (city && country) return `${city}, ${country}`;
        }
        return data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (e) {
        console.error("Geocoding error", e);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

// Icons
const createIcon = (color) => {
    return L.divIcon({
        className: 'custom-pin',
        html: `<span style="font-size: 24px; text-shadow: 0 0 10px ${color}; filter: drop-shadow(0 0 5px ${color});">📍</span>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
};

const startIcon = createIcon('#38bdf8');
const endIcon = createIcon('#f472b6');
const resultIcon = L.divIcon({
    className: 'result-pin',
    html: `<span style="font-size: 24px;">💎</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Map Click Handler
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    if (!startPoint) {
        startPoint = { lat, lng };
        const name = await getPlaceName(lat, lng);
        startPoint.name = name;

        startMarker = L.marker([lat, lng], { icon: startIcon }).addTo(map).bindPopup(name).openPopup();
        startInput.value = name;
        startInput.parentElement.classList.add('filled');
    } else if (!endPoint) {
        endPoint = { lat, lng };
        const name = await getPlaceName(lat, lng);
        endPoint.name = name;

        endMarker = L.marker([lat, lng], { icon: endIcon }).addTo(map).bindPopup(name).openPopup();
        endInput.value = name;

        // Draw line
        L.polyline([startPoint, endPoint], { color: 'white', dashArray: '10, 10', weight: 2, opacity: 0.5 }).addTo(map);

        // Fit bounds
        map.fitBounds([startPoint, endPoint], { padding: [50, 50] });

        discoverBtn.disabled = false;
    } else {
        // Reset if both set
        resetMap();
        // Set new start
        startPoint = { lat, lng };
        const name = await getPlaceName(lat, lng);
        startPoint.name = name;

        startMarker = L.marker([lat, lng], { icon: startIcon }).addTo(map).bindPopup(name).openPopup();
        startInput.value = name;
    }
});

function resetMap() {
    startPoint = null;
    endPoint = null;
    discoverBtn.disabled = true;
    startInput.value = "";
    endInput.value = "";

    // Clear markers
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    resultMarkers.forEach(m => map.removeLayer(m));
    resultMarkers = [];

    // Clear lines
    map.eachLayer((layer) => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Path && layer._url)) { // Keep tiles
            map.removeLayer(layer);
        }
    });

    resultsContainer.innerHTML = '<div class="empty-state"><p>Select two points on the map to begin your adventure.</p></div>';
    loadMoreBtn.style.display = 'none';
}

// API Call Helper
async function fetchSuggestions(excludeList = []) {
    const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start: startPoint,
            end: endPoint,
            mode: 'ollama',
            exclude: excludeList
        })
    });
    return await response.json();
}

// Discover Button Logic
discoverBtn.addEventListener('click', async () => {
    if (!startPoint || !endPoint) return;

    discoverBtn.disabled = true;
    discoverBtn.innerHTML = '<span class="btn-text">Exploring...</span>';
    resultsContainer.innerHTML = '<div class="empty-state"><p>Consulting the AI Guide...</p></div>';
    loadMoreBtn.style.display = 'none';

    // Clear old result markers
    resultMarkers.forEach(m => map.removeLayer(m));
    resultMarkers = [];

    try {
        const data = await fetchSuggestions([]);
        renderResults(data.attractions, true);
        loadMoreBtn.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><p>Something went wrong. Try again.</p></div>';
    } finally {
        discoverBtn.disabled = false;
        discoverBtn.innerHTML = '<span class="btn-text">Find Hidden Gems</span>';
    }
});

// Load More Button Logic
loadMoreBtn.addEventListener('click', async () => {
    // Get currently displayed names to exclude
    const currentCards = document.querySelectorAll('.card h3');
    const currentNames = Array.from(currentCards).map(el => el.innerText);

    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<span class="btn-text">Loading...</span>';

    try {
        const data = await fetchSuggestions(currentNames);
        renderResults(data.attractions, false);
    } catch (error) {
        console.error("Error loading more:", error);
    } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<span class="btn-text">Load More Results</span>';
    }
});

function renderResults(attractions, clear = false) {
    if (clear) {
        resultsContainer.innerHTML = '';
    }

    if (attractions.length === 0) {
        if (clear) resultsContainer.innerHTML = '<div class="empty-state"><p>No results found.</p></div>';
        // If loading more and found nothing, hide button
        loadMoreBtn.style.display = 'none';
        return;
    }

    attractions.forEach((spot, index) => {
        // Add Marker
        const marker = L.marker([spot.lat, spot.lng], { icon: resultIcon })
            .addTo(map)
            .bindPopup(`<b>${spot.name}</b><br>${spot.type}`);
        resultMarkers.push(marker);

        // Add Card
        const card = document.createElement('div');
        card.className = 'card';
        // Simple entry animation
        card.style.animation = `slideIn 0.3s ease-out forwards ${index * 0.1}s`;
        card.style.opacity = '0';

        card.innerHTML = `
            <div class="card-header">
                <h3>${spot.name}</h3>
                <span class="tag">${spot.type}</span>
            </div>
            <p>${spot.description}</p>
        `;

        card.addEventListener('click', () => {
            map.flyTo([spot.lat, spot.lng], 16, { duration: 1.5 });
            marker.openPopup();
        });

        resultsContainer.appendChild(card);
    });
}
