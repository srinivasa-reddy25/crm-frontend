import { io } from "socket.io-client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Adjust as needed

export function connectSocket(onSocketConnected) {
    console.log("⏳ Waiting for Firebase auth state...");

    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.warn("User not authenticated.");
                resolve(null);
                return;
            }

            console.log(" Firebase user:", user.email || user.uid);

            try {
                const token = await user.getIdToken();

                const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
                    auth: { token },
                    transports: ["websocket"],
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                socketInstance.on("connect", () => {
                    console.log("Socket connected:", socketInstance.id);
                    socketInstance.emit("join-chat");
                    onSocketConnected?.(socketInstance);
                    resolve(socketInstance);
                });

                socketInstance.on("connect_error", (err) => {
                    console.error("Socket connection error:", err.message);
                    reject(err);
                });
            } catch (err) {
                console.error("Failed to get token or initialize socket:", err.message);
                reject(err);
            }

            unsubscribe();
        });
    });
}
