import axiosInstance from './axiosInstance';

export const getUserConversations = async () => {
    try {
        const response = await axiosInstance.get(`/conversations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user conversations:', error);
        throw error;
    }
}
