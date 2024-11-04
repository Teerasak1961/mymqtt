// Function to handle motor-related updates
export function updateMotor(topic, message) {
    switch(topic) {
        case '100M1/Data':
            updateElementIfExists('100M1-MaxTime', message['100M1_MaxTime']);
            updateElementIfExists('100M1-CurrTime', message['100M1_CurrTime']);
            updateElementIfExists('100M1-Count', message['100M1_Count']);
            updateElementIfExists('100M1-Status', message['100M1_Status']);
            
            // Handle Boolean values
            updateBooleanElement('100M1-Manual', message['100M1_Manual']);
            updateBooleanElement('100M1-Start', message['100M1_Start']);
            updateBooleanElement('100M1-Ack', message['100M1_Ack']);
            
            updateValveOrMotor('100M1', message['100M1_Status']); // Update motor image
            break;
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

// Helper function specifically for Boolean values
function updateBooleanElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value ? "True" : "False";
        element.style.color = value ? "blue" : "gray";
    }
}

// Function to update motor image based on status
function updateValveOrMotor(tag, value) {
    const motorImage = document.getElementById('motor-' + tag);
    if (motorImage) {
        motorImage.src = `/static/img/Pumps/Pump${value}.svg?time=${new Date().getTime()}`;
    }
}