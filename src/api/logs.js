import { api } from './api';

export const getSystemLogs = async (token) => {
    try {
        const response = await api.get('/logs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSystemLogsByEntity = async (entity, entityId, token) => {
    try {
        const response = await api.get(`/logs/${entity}/${entityId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
