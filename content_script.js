// content.js


// Function to create and display toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    // Append toast to the body
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Automatically remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// Inject CSS styles for toast into the web page
const toastStyles = `
    .toast {
        position: fixed;
        top: 3rem;
        transform: translateX(-50%);
        left: 50%;
        background-color: #333;
        color: #fff;
        padding: 15px 30px;
        border-radius: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.4s ease;
        border: 3px solid #65e165;
    }

    .toast.show {
        opacity: 1;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = toastStyles;
document.head.appendChild(styleElement);

// Example usage of showToast function


chrome.runtime.onMessage.addListener(async function (message) {
    const { email, days, problemLink, problemName } = message;
    console.log(message, " got from the popup ")

    if (days <= 0 || days > 30) {
        showToast("⚠️ Please select a number of days between 1 and 30 ⚠️");
        return;
    }

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
            console.log(data);
            showToast(data.message);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // alert('Error fetching data:', error.message); // Display the error message using alert
            showToast('Error fetching data:', error.message)
            // chrome.runtime.sendMessage({ type: "show_notification", payload: { message: error.message } })
        });
});
