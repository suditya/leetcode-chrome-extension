// content.js

// "problemLink":"https://leetcode.com/problems/two-sum/description/",
// "problemName":"Two Sum",
// "email":"nileshdeshmukh0908@gmail.com",
// "afterDays":"1"

chrome.runtime.onMessage.addListener(function (message) {
    const { email, days, problemLink, problemName } = message;
    console.log(message, " got from the popup ")
    // Call the backend API with the extracted data
    fetch('https://chrome-extension-backend-cvc3.onrender.com/api/schedule-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, afterDays: days, problemLink, problemName })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log(data); // Log the parsed response data
            alert(JSON.stringify(data.message)); // Display the response data using alert
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data:', error.message); // Display the error message using alert
        });
});
