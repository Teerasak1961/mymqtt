// mqttAnalog.js

let lastUpdateTime = Date.now(); // Initialize with the current time
const updateInterval = 2000; // Set the update interval (e.g., 5000 ms = 5 seconds)

export function updateAnalog(topic, message) {
    if (topic === 'analog') {
        // Update DOM elements for tank level and temperature values
        updateElementIfExists('100LT01-value', message['100LT01'], 1);
        updateElementIfExists('100TT01-value', message['100TT01'], 1);

        const level = message['100LT01'];

        // Update tank fill if level is a valid number
        if (!isNaN(level)) {
            updateTankFill(level);
            console.log(`Updated tank fill to ${level}%`);
        } else {
            console.error('Invalid level value received:', message['100LT01']);
        }

        // Throttling logic
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= updateInterval) {
            const timestamp = new Date().toISOString();
            
            // Dispatch update for chart data only if enough time has passed
            if (!isNaN(message['100LT01'])) {
                console.log(`Dispatching 100LT01 update at ${timestamp} with value:`, message['100LT01']);
                window.dispatchEvent(new CustomEvent('updateChart', { detail: { id: '100LT01', value: parseFloat(message['100LT01']), timestamp }}));
            }
            
            if (!isNaN(message['100TT01'])) {
                console.log(`Dispatching 100TT01 update at ${timestamp} with value:`, message['100TT01']);
                window.dispatchEvent(new CustomEvent('updateChart', { detail: { id: '100TT01', value: parseFloat(message['100TT01']), timestamp }}));
            }
            
            // Update the last update time
            lastUpdateTime = currentTime;
        } else {
            console.log(`Skipping chart update. Time since last update: ${currentTime - lastUpdateTime}ms`);
        }
    }
}

// Function to update the tank fill visualization
function updateTankFill(level) {
    const tankFillInner = document.getElementById('tankFill-inner');
    if (tankFillInner) {
        const fillHeight = Math.max(0, Math.min(100, level));
        tankFillInner.style.height = `${fillHeight}%`;
    }
}

// Helper function to update an element if it exists on the current page
function updateElementIfExists(elementId, value, decimals = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        if (typeof value === 'number') {
            element.textContent = value.toFixed(decimals);
        } else {
            element.textContent = parseFloat(value).toFixed(decimals);
        }
    }
}
