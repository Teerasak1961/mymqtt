function transferRecipeToPLC(id, recipeno, recipename, mixingspeed, mixingtemp, mixingtime) {
    const mqttSocket = new WebSocket(`ws://${window.location.host}/ws/mqtt/`);

    mqttSocket.onopen = () => {
        console.log('WebSocket connection established');

        // Construct the message payload
        const message = JSON.stringify({
            topic: 'Recipe/ID',
            message: id
        });

        mqttSocket.send(message);
        mqttSocket.send(JSON.stringify({ topic: 'Recipe/No', message: recipeno }));
        mqttSocket.send(JSON.stringify({ topic: 'Recipe/Name', message: recipename }));
        mqttSocket.send(JSON.stringify({ topic: 'Recipe/MixingSpeed', message: mixingspeed }));
        mqttSocket.send(JSON.stringify({ topic: 'Recipe/MixingTemp', message: mixingtemp }));
        mqttSocket.send(JSON.stringify({ topic: 'Recipe/MixingTime', message: mixingtime }));
        
        console.log('Published all recipe data to MQTT');

        // Close WebSocket after sending all messages
        mqttSocket.close();

        // Redirect to currentrecipe.html after publishing
        window.location.href = '/currentrecipe/';
    };

    mqttSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Failed to transfer recipe data. Please try again.');
    };

    mqttSocket.onclose = () => {
        console.log('WebSocket connection closed');
    };
}
