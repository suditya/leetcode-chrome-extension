// content.js

chrome.runtime.onMessage.addListener(function (message) {
    const { email, days, problemLink, problemName } = message;
    console.log(message, " got from the popup ")
    // Call the backend API with the extracted data
    fetch('https://chrome-extension-backend-cvc3.onrender.com/api/schedule-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, days, problemLink, problemName })
    })
        .then(response => {
            console.log(response, " from backend");
            if (response.ok) {
                alert('Email scheduled successfully');
            } else {
                alert('Error scheduling email', response);
            }
        })
        .catch(error => {
            alert('Error scheduling email:', error);
        });
});
