// trend.js

// Initialize Chart.js on the canvas element
const ctx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Timestamps for X-axis
        datasets: [
            {
                label: 'Tank Level (100LT01)',
                data: [],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                fill: true,
            },
            {
                label: 'Temperature (100TT01)',
                data: [],
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                fill: true,
            }
        ]
    },
    options: {
        scales: {
            x: {
                title: { display: true, text: 'Time' },
                type: 'time', // Using time scale for real-time data
                time: { unit: 'second' }
            },
            y: {
                title: { display: true, text: 'Value' }
            }
        }
    }
});

// Function to update the chart with new data points
function updateTrendChart(id, value, timestamp) {
    const datasetIndex = id === '100LT01' ? 0 : 1; // Determine which dataset to update
    const dataset = trendChart.data.datasets[datasetIndex];
    
    // Add new data point
    dataset.data.push({ x: timestamp, y: value });
    trendChart.data.labels.push(timestamp);

    // Limit to the latest 20 data points
    if (dataset.data.length > 20) {
        dataset.data.shift();
    }

    trendChart.update(); // Refresh the chart to display the new data
}

// Listen for the CustomEvent to update the chart
window.addEventListener('updateChart', function (e) {
    const { id, value, timestamp } = e.detail;
    updateTrendChart(id, value, timestamp);
});
