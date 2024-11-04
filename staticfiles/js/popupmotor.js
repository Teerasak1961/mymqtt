// Get motor tag from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const motorTag = urlParams.get('tag');

// Update title with motor tag
document.getElementById('motor-title').textContent = `Motor ${motorTag} Control`;

// WebSocket connection for motor
const socket = new WebSocket(`ws://${window.location.host}/ws/mqtt/`);

socket.onopen = () => {
    console.log('WebSocket connected for motor');
    socket.send(JSON.stringify({
        action: 'subscribe',
        topic: `${motorTag}/Data`
    }));
};

// Handle incoming WebSocket messages
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.topic === `${motorTag}/Data`) {
        updateMotorData(data.message);
    }
};

// Update motor data in the popup
function updateMotorData(message) {
    const tag = motorTag;
    document.getElementById('maxtime').textContent = `${message[`${tag}_MaxTime`] }   sec`;
    document.getElementById('currtime').textContent = `${message[`${tag}_CurrTime`]}   sec.`;
    document.getElementById('count').textContent = `${message[`${tag}_Count`]}`;
    
    // Button color change logic
    if (message[`${tag}_Manual`] === true) {
        toggleButtonColor('btn-auto', 'btn-success','btn-secondary' );
        toggleButtonColor('btn-manual', 'btn-secondary', 'btn-warning');
    } else {
        toggleButtonColor('btn-auto','btn-secondary' ,'btn-success' );
        toggleButtonColor('btn-manual', 'btn-warning', 'btn-secondary');
    }

    if (message[`${tag}_Start`] === true) {
        toggleButtonColor('btn-start', 'btn-secondary', 'btn-success');
        toggleButtonColor('btn-stop', 'btn-danger', 'btn-secondary');
    } else {
        toggleButtonColor('btn-start', 'btn-success', 'btn-secondary');
        toggleButtonColor('btn-stop', 'btn-secondary', 'btn-danger');
    }

    if (message[`${tag}_Ack`] === true) {
        toggleButtonColor('btn-ack', 'btn-secondary', 'btn-danger');
    } else {
        toggleButtonColor('btn-ack', 'btn-danger', 'btn-secondary');
    }
}

// Helper function to toggle button colors
function toggleButtonColor(buttonId, removeClass, addClass) {
    const button = document.getElementById(buttonId);
    button.classList.remove(removeClass);
    button.classList.add(addClass);
}

// MQTT publish functions for control buttons
document.getElementById('btn-auto').onclick = () => publishMqtt(`${motorTag}/Manual`, false);
document.getElementById('btn-manual').onclick = () => publishMqtt(`${motorTag}/Manual`, true);
document.getElementById('btn-start').onclick = () => publishMqtt(`${motorTag}/Start`, true);
document.getElementById('btn-stop').onclick = () => publishMqtt(`${motorTag}/Start`, false);
document.getElementById('btn-ack').onclick = () => publishMqtt(`${motorTag}/Ack`, false);
document.getElementById('btn-reset').onclick = () => publishMqtt(`${motorTag}/Reset`, true);
document.getElementById('btn-set-maxtime').onclick = () => {
    const maxTime = parseInt(document.getElementById('input-maxtime').value);
    if (!isNaN(maxTime)) {
        publishMqtt(`${motorTag}/Maxtime`, maxTime);
    }
};

// Function to publish MQTT messages
function publishMqtt(topic, value) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ topic: topic, message: value });
        socket.send(message);
        console.log(`Publishing to ${topic}: ${value}`);
    }
}
