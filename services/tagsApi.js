import axiosInstance from './axiosInstance';


export const getTags = () => {
    return axiosInstance.get('/tags').then(res => res.data);;
};


export const getTagById = async (id) => {
    try {
        const response = await axiosInstance.get(`/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tag with ID ${id}:`, error);
        throw error;
    }
};


export const createTag = (data) => {
    return axiosInstance.post('/tags', data);
};


export const updateTag = (id, data) => {
    return axiosInstance.put(`/tags/${id}`, data);
};


export const deleteTag = (id) => {
    return axiosInstance.delete(`/tags/${id}`);
};
