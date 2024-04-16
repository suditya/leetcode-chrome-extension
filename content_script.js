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
            console.log(response, " from backend");
            alert("Email scheduled successfully!");
        })
        .catch(error => {
            alert('Error scheduling email:', error);
        });
});
