// Function to handle valve-related updates
export function updateValve(topic, message) {
    switch(topic) {
        case '100Y1/Data':
            updateElementIfExists('100Y1-MaxTime', message['100Y1_MaxTime']);
            updateElementIfExists('100Y1-CurrTime', message['100Y1_CurrTime']);
            updateElementIfExists('100Y1-Count', message['100Y1_Count']);
            updateElementIfExists('100Y1-Status', message['100Y1_Status']);
            
            // Handle Boolean values for Open and Close
            updateBooleanElement('100Y1-Manual', message['100Y1_Manual']);
            updateBooleanElement('100Y1-Open', message['100Y1_Open']);
            updateBooleanElement('100Y1-Ack', message['100Y1_Ack']);
            
            updateValveOrMotor('100Y1', message['100Y1_Status']); // Update valve 100Y1 image
            break;
        case '100Y2/Data':
            updateElementIfExists('100Y2-MaxTime', message['100Y2_MaxTime']);
            updateElementIfExists('100Y2-CurrTime', message['100Y2_CurrTime']);
            updateElementIfExists('100Y2-Count', message['100Y2_Count']);
            updateElementIfExists('100Y2-Status', message['100Y2_Status']);
            
            // Handle Boolean values for Open and Close
            updateBooleanElement('100Y2-Manual', message['100Y2_Manual']);
            updateBooleanElement('100Y2-Open', message['100Y2_Open']);
            updateBooleanElement('100Y2-Ack', message['100Y2_Ack']);
            
            updateValveOrMotor('100Y2', message['100Y2_Status']); // Update valve 100Y2 image
            break;
    }
}

// Function to update valve or motor image based on tag and status
function updateValveOrMotor(tag, value) {
    const valveImage = document.getElementById('valve-' + tag);

    if (valveImage) {
        // Update valve image with cache-busting to ensure the image reloads
        valveImage.src = `/static/img/Valves/Valve${value}.svg?time=${new Date().getTime()}`;
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

// Helper function specifically for Boolean values to add more control
function updateBooleanElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value ? "True" : "False";
        element.style.color = value ? "blue" : "gray"; // Optional styling for Open/Close
    }
}
