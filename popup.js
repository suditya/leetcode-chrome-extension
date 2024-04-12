// // popup.js

// // Regular expression to match leetcode.com/problems URLs
const leetcodeRegex = /^https:\/\/leetcode\.com\/problems\/.*/;

// Function to check if the current URL matches the pattern
const isLeetCodeProblemPage = (url) => {
    return leetcodeRegex.test(url);
};
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}


document.addEventListener('DOMContentLoaded', async function () {
    // Your DOM manipulation code goes here...
    chrome.storage.local.get(["leetcodeEmail"]).then((result) => {
        if (result.leetcodeEmail) {
            console.log("got from storage")
            document.getElementById('email').value = result.leetcodeEmail;
        }
    }); // filling the input field if already exists
    document.getElementById('scheduleBtn').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        const days = document.getElementById('days').value;
        chrome.storage.local.set({ 'leetcodeEmail': email }).then(() => {
            console.log("email is set");
        }); // saving in the local storage after getting the email

        const sendMessageToContentScript = async () => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const activeTab = tabs[0];
                const problemLink = activeTab.url;
                const problemName = activeTab.title;
                if (!isLeetCodeProblemPage(problemLink)) {
                    alert("Works only on LEETCODE problems");
                    return;
                }

                await chrome.tabs.sendMessage(activeTab.id, { email, days, problemLink, problemName });
                console.log("sent the message to content script");
            } catch (error) {
                console.error('Error sending message to content script:', error);
            }
        };

        // Start sending message to content script
        await sendMessageToContentScript();
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     let messageSent = false; // Flag to track whether message has been sent

//     document.getElementById('scheduleBtn').addEventListener('click', function () {
//         const email = document.getElementById('email').value;
//         const days = document.getElementById('days').value;

//         // Function to send message to content script
//         const sendMessageToContentScript = () => {
//             chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//                 const activeTab = tabs[0];
//                 const problemLink = activeTab.url;
//                 const problemName = activeTab.title;

//                 // Check if the URL is a valid LeetCode problem page
//                 if (!isLeetCodeProblemPage(problemLink)) {
//                     alert("Works only on LEETCODE problems");
//                     return;
//                 }

//                 // Send message to content script only if it hasn't been sent already
//                 if (!messageSent) {
//                     chrome.tabs.sendMessage(activeTab.id, { email, days, problemLink, problemName }, function (response) {
//                         if (!response) {
//                             setTimeout(sendMessageToContentScript, 500);
//                         }
//                     });

//                     messageSent = true; // Set flag to true after sending message
//                 }
//             });
//         };

//         // Start sending message to content script
//         sendMessageToContentScript();
//     });
// })
