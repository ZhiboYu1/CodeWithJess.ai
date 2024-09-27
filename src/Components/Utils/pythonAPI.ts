import axios from 'axios';

export const createSession = async () => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create_session`, {
        headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data.session_id;
};

export const executeCode = async (code: string, sessionId: string) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        code,
        session_id: sessionId,
        headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data.output;
};

export const deleteSession = async (sessionId: string) => {
    return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/delete_session/${sessionId}`, {
        headers: { 'Cache-Control': 'no-cache' }
    });
};

