import axiosInstance from './axiosInstance';


export const getContacts = (params) => {
    return axiosInstance.get('/contacts', { params }).then((res) => res.data);;
};

export const getContactById = async (id) => {
    try {
        const response = await axiosInstance.get(`/contacts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching contact with ID ${id}:`, error);
        throw error;
    }
};


export const createContact = (data) => {
    return axiosInstance.post('/contacts', data);
};

export const updateContact = (id, data) => {
    return axiosInstance.put(`/contacts/${id}`, data);
};

export const deleteContact = (id) => {
    return axiosInstance.delete(`/contacts/${id}`);
};

export const importContacts = (formData) => {
    return axiosInstance.post('/contacts/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const bulkDeleteContacts = (ids) => {
    return axiosInstance.post('/contacts/bulk-delete', { ids });
};


