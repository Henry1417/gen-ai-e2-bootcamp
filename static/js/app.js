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
map.on('click', (e) => {
    const { lat, lng } = e.latlng;

    if (!startPoint) {
        startPoint = { lat, lng };
        startMarker = L.marker([lat, lng], { icon: startIcon }).addTo(map).bindPopup("Start Point").openPopup();
        startInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        startInput.parentElement.classList.add('filled');
    } else if (!endPoint) {
        endPoint = { lat, lng };
        endMarker = L.marker([lat, lng], { icon: endIcon }).addTo(map).bindPopup("Destination").openPopup();
        endInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

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
        startMarker = L.marker([lat, lng], { icon: startIcon }).addTo(map);
        startInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
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
}

// API Call
discoverBtn.addEventListener('click', async () => {
    if (!startPoint || !endPoint) return;

    discoverBtn.disabled = true;
    discoverBtn.innerHTML = '<span class="btn-text">Exploring...</span>';

    // Simulate loading/API delay for effect
    resultsContainer.innerHTML = '<div class="empty-state"><p>Consulting the AI Guide...</p></div>';

    try {
        const response = await fetch('/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start: startPoint,
                end: endPoint,
                mode: 'simulation'
            })
        });

        const data = await response.json();
        renderResults(data.attractions);

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><p>Something went wrong. Try again.</p></div>';
    } finally {
        discoverBtn.disabled = false;
        discoverBtn.innerHTML = '<span class="btn-text">Find Hidden Gems</span>';
    }
});

function renderResults(attractions) {
    resultsContainer.innerHTML = '';
    resultMarkers.forEach(m => map.removeLayer(m));
    resultMarkers = [];

    attractions.forEach((spot, index) => {
        // Add Marker
        const marker = L.marker([spot.lat, spot.lng], { icon: resultIcon })
            .addTo(map)
            .bindPopup(`<b>${spot.name}</b><br>${spot.type}`);
        resultMarkers.push(marker);

        // Add Card
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
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
