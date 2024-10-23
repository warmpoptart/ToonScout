export async function handleOAuthToken(fragment: URLSearchParams) {
    const accessToken = fragment.get('access_token');
    const state = fragment.get('state');
    let userId: string;

    if (accessToken) {
        userId = await getDiscordUserId(accessToken);
    } else {
        userId = '';
        console.error("Access token not found.");
    }

    if (state === null || localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
        console.log('You may have been click-jacked!');
        return;
    }

    // Clean the URL hash to remove the token from the address bar
    window.history.replaceState({}, document.title, window.location.pathname);
    return userId;
}

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
        return userData.id;
    } catch (error) {
        console.error("Error fetching Discord user ID:", error);
        return null;
    }
}

