const DEFAULT_PORT = 1547;
let toon: any = null;
let socket: WebSocket | null = null;
let userId: string | null = '';

export const initWebSocket = (setIsConnected: React.Dispatch<React.SetStateAction<boolean>>, id: string) => {
    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);
    
    socket.addEventListener("open", (event) => {
        userId = id;
        console.log(userId);
        console.log("WebSocket opened");
        if (socket) {
            socket.send(JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" }));
            socket.send(JSON.stringify({ request: "all" }));
            startContinuousRequests();
        }
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        toon = data;
        setIsConnected(true);
    });

    socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
    });

    socket.addEventListener("close", (event) => {
        console.log("WebSocket closed:", event);
        setIsConnected(false);
        waitForSocket();
    });

    function startContinuousRequests() {
        setInterval(async () => {
            if (userId && socket && socket.readyState === WebSocket.OPEN) {
                setIsConnected(true);
                await sendData(userId, toon);
                socket.send(JSON.stringify({ request: "all" }));
            } else {
                console.log("Failed to get request... ", userId, socket?.readyState === WebSocket.OPEN);
                setIsConnected(false);
            }
        }, 5000);
    }
}

function waitForSocket() {
    console.log("Attempting to reconnect to WebSocket...");

    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);

    socket.addEventListener("open", () => {
        console.log("WebSocket connection established!");
        initWebSocket;
    });

    socket.addEventListener("error", () => {
        console.log("WebSocket connection failed. Retrying in 5 seconds...");
        setTimeout(waitForSocket, 5000); // Retry after a delay
    });
}

async function sendData(userId: string, data: any) {
    let attempt = 0;
    try {
        const response = await fetch('https://api.scouttoon.info/toon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, data }),
        });

        if (!response.ok) throw new Error('Failed to send data');

        console.log("Data sent successfully.");
    } catch (error) {
        console.error("Error sending data:", error);
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

export default initWebSocket;

function initAuthToken() {
    const length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}
