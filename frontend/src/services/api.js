import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const startSession = async (user1, user2) => {
    const response = await api.post('/session/start', { user1, user2 });
    return response.data;
};

export const sendMessage = async (sessionId, sender, receiver, message) => {
    const response = await api.post('/messages/send', {
        sessionId,
        sender,
        receiver,
        message
    });
    return response.data;
};

export default api;
