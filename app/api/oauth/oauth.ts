import { initWebSocket, setAuthToken, setUserId } from '../websocket/websocket';

export async function handleOAuthToken(fragment: URLSearchParams) {
    const accessToken = fragment.get('access_token');
    const state = fragment.get('state');

    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('sessionId', generateRandomString());

        const userId = await getDiscordUserId(accessToken); // Your function to fetch user ID
        setAuthToken(accessToken); // Set the auth token for WebSocket
        setUserId(userId);
        initWebSocket(); // Initialize WebSocket with the new token
    } else {
        console.error("Access token not found.");
    }

    // Check state validity
    if (state === null || localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        console.log('You may have been click-jacked!');
        return;
    }

    // Clean the URL hash to remove the token from the address bar
    window.history.replaceState({}, document.title, window.location.pathname);
}


// Function to generate a random string for session IDs
function generateRandomString() {
    let randomString = '';
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }
    return randomString;
}

// Fetch Discord User ID
async function getDiscordUserId(accessToken: string) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Discord user information.');
        }

        const userData = await response.json();
        return userData.id; // Return the user ID
    } catch (error) {
        console.error("Error fetching Discord user ID:", error);
        return null;
    }
}

