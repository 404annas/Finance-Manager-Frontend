import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create the context
const SocketContext = createContext(null);

// Create a custom hook for easy access to the socket
export const useSocket = () => useContext(SocketContext);

// Create the provider component that will wrap your app
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // This effect runs only once to establish the connection
        const token = localStorage.getItem("token"); // Get token for authentication

        // Only try to connect if the user is logged in
        if (token) {
            // Connect to your backend server, passing the token for authentication
            const newSocket = io(import.meta.env.VITE_API_URL, {
                auth: { token },
            });

            // --- ADD THESE LISTENERS ---
            newSocket.on("connect", () => {
                console.log("✅ Socket connected successfully! Socket ID:", newSocket.id);
            });

            newSocket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });
            // --- END OF ADDED LISTENERS ---

            setSocket(newSocket);

            // IMPORTANT: Clean up the connection when the component unmounts
            // This happens when the user logs out or closes the app
            return () => newSocket.disconnect();
        }
    }, []); // The empty array ensures this runs only on initial mount

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};