// websocket.ts
const DEFAULT_PORT = 1547;
let authToken: string | null = null;
let toon: any = null;
let userId: string | null = null;
let socket: WebSocket | null = null;

export const initWebSocket = (setIsConnected: React.Dispatch<React.SetStateAction<boolean>>) => {
    console.log("Starting WebSocket...");
    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);

    socket.addEventListener("open", (event) => {
        console.log("WebSocket opened");
        if (authToken && socket) {
            socket.send(JSON.stringify({ authorization: authToken, name: "ToonScout" }));
            socket.send(JSON.stringify({ request: "all" }));
            startContinuousRequests();
            setIsConnected(true);
        }
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        toon = data;
        setIsConnected(true);
    });

    socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
    });

    socket.addEventListener("close", (event) => {
        console.log("WebSocket closed:", event);
        setIsConnected(false);
        waitForSocket();
    });
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

function startContinuousRequests() {
    setInterval(async () => {
        if (userId && socket && socket.readyState === WebSocket.OPEN) {
            await sendData(userId, toon);
            socket.send(JSON.stringify({ request: "all" }));
        }
    }, 10000);
}

async function sendData(userId: string, data: any) {
    let attempt = 0;
    while (attempt < 3) {
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
            break;
        } catch (error) {
            console.error("Error sending data:", error);
            attempt++;
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export function setAuthToken(token: string) {
    authToken = token;
}

export function setUserId(id: string) {
    userId = id;
}

export default initWebSocket;