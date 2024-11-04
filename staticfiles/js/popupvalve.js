// Get valve tag from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const valveTag = urlParams.get('tag');

// Update title with valve tag
document.getElementById('valve-title').textContent = `Valve ${valveTag} Control`;

// WebSocket connection
const socket = new WebSocket(`ws://${window.location.host}/ws/mqtt/`);

socket.onopen = () => {
    console.log('WebSocket connected');
    // Subscribe to valve data
    socket.send(JSON.stringify({
        action: 'subscribe',
        topic: `${valveTag}/Data`
    }));
};

// Handle incoming messages
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.topic === `${valveTag}/Data`) {
        updateValveData(data.message);
    }
};

// WebSocket connection and publishing logic remain the same

// Update valve data in the popup
function updateValveData(message) {
    const tag = valveTag;

    // Update display areas
    document.getElementById('valve-maxtime').textContent = `${message[`${tag}_MaxTime`]}     sec.`;
    document.getElementById('valve-currtime').textContent = `${message[`${tag}_CurrTime`]}  sec. `;
    document.getElementById('valve-count').textContent = `${message[`${tag}_Count`]}`;
    document.getElementById('valve-manual').textContent = `Manual: ${message[`${tag}_Manual`]}`;
    document.getElementById('valve-open').textContent = `Open: ${message[`${tag}_Open`]}`;
    document.getElementById('valve-ack').textContent = `Ack: ${message[`${tag}_Ack`]}`;

    // Auto/Manual button color logic
    const isManual = message[`${tag}_Manual`] === true;
    const btnAuto = document.getElementById('btn-Auto');
    const btnManual = document.getElementById('btn-Manual');
    if (isManual) {
        btnAuto.classList.replace('btn-success', 'btn-secondary');
        btnManual.classList.replace('btn-secondary', 'btn-warning');
    } else {
        btnAuto.classList.replace('btn-secondary', 'btn-success');
        btnManual.classList.replace('btn-warning', 'btn-secondary');
    }

    // Open/Close button color logic
    const isOpen = message[`${tag}_Open`] === true;
    const btnOpen = document.getElementById('btn-Open');
    const btnClose = document.getElementById('btn-close');
    if (isOpen) {
        btnOpen.classList.replace('btn-secondary', 'btn-success');
        btnClose.classList.replace('btn-danger', 'btn-secondary');
    } else {
        btnOpen.classList.replace('btn-success', 'btn-secondary');
        btnClose.classList.replace('btn-secondary', 'btn-danger');
    }

    // Ack button color logic
    const isAck = message[`${tag}_Ack`] === true;
    const btnAck = document.getElementById('btn-Ack');
    if (isAck) {
        btnAck.classList.replace('btn-secondary', 'btn-danger');
    } else {
        btnAck.classList.replace('btn-danger', 'btn-secondary');
    }
}

// Setup control button handlers with corrected IDs
document.getElementById('btn-Auto').onclick = () => publishMqtt(`${valveTag}/Manual`, false);
document.getElementById('btn-Manual').onclick = () => publishMqtt(`${valveTag}/Manual`, true);
document.getElementById('btn-Open').onclick = () => publishMqtt(`${valveTag}/Open`, true);
document.getElementById('btn-close').onclick = () => publishMqtt(`${valveTag}/Open`, false);
document.getElementById('btn-Ack').onclick = () => publishMqtt(`${valveTag}/Ack`,false );
document.getElementById('btn-reset').onclick = () => publishMqtt(`${valveTag}/Reset`, true);
document.getElementById('btn-set-maxtime').onclick = () => {
    const maxTime = parseInt(document.getElementById('input-maxtime').value);
    if (!isNaN(maxTime)) {
        publishMqtt(`${valveTag}/Maxtime`, maxTime);
    }
};

// Function to publish MQTT messages
function publishMqtt(topic, value) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ topic: topic, message: value });
        socket.send(message);
        console.log(`Publishing to ${topic}: ${value}`);
    } else {
        console.error('WebSocket not open');
    }
}
