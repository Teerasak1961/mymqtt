// Import valve, motor, and analog-specific logic
import { updateValve } from './mqttValve.js'; // Path to valve logic file
import { updateMotor } from './mqttMotor.js'; // Path to motor logic file
import { updateAnalog } from './mqttAnalog.js'; // Path to analog logic file
import { updateRecipe } from './mqttRecipe.js'; // Path to recipe logic file
// Global MQTT data object
let mqttData = {};

// Load existing MQTT data from localStorage if available
document.addEventListener("DOMContentLoaded", function () {
    const storedData = localStorage.getItem('mqttData');
    if (storedData) {
        mqttData = JSON.parse(storedData);
        updateAllData(); // Update UI with stored data
    }
});

// Initialize WebSocket connection to Django Channels
const mqttSocket = new WebSocket('ws://' + window.location.host + '/ws/mqtt/');

// Handle incoming WebSocket messages
mqttSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.type === 'mqtt_message') {
        mqttData[data.topic] = data.message;
        localStorage.setItem('mqttData', JSON.stringify(mqttData)); // Save to localStorage
        handleMqttMessage(data.topic, data.message); // Delegate to the right handler
    }
};

// Function to handle incoming messages and delegate based on topic
function handleMqttMessage(topic, message) {
    if (topic.includes('Data')) {
        if (topic.startsWith('100M')) {
            // Delegate to motor logic
            updateMotor(topic, message);
        } else if (topic.startsWith('100Y')) {
            // Delegate to valve logic
            updateValve(topic, message);
        }
    } else if (topic === 'analog') {
        // Delegate to analog logic
        updateAnalog(topic, message);

    } else if (topic === 'recipe') {
         // Delegate to analog logic
        updateRecipe(topic, message);

    } 
   

}

// Function to update all data from localStorage on page load
function updateAllData() {
    for (const topic in mqttData) {
        handleMqttMessage(topic, mqttData[topic]);
    }
}
