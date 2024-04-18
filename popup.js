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
                const queryOptions = { active: true, lastFocusedWindow: true };
                // `tab` will either be a `tabs.Tab` instance or `undefined`.
                let [activeTab] = await chrome.tabs.query(queryOptions);
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
        // if (tabs[0].url.match('https:\/\/.*.leetcode.com\/.*')) {

        await sendMessageToContentScript();

    });
});
