// scripts/place.js

document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    yearSpan.textContent = new Date().getFullYear();

    const lastModifiedSpan = document.getElementById('lastmodified');
    lastModifiedSpan.textContent = document.lastModified;

    const temperature = 10; // °C
    const windSpeed = 5; // km/h

    function calculateWindChill(temp, wind) {
        return 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
    }

    const windChillSpan = document.getElementById('windchill');
    if (temperature <= 10 && windSpeed > 4.8) {
        const windChill = calculateWindChill(temperature, windSpeed).toFixed(1);
        windChillSpan.textContent = windChill;
    } else {
        windChillSpan.textContent = 'N/A';
    }
});