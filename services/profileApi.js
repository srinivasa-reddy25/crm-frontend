import axiosInstance from './axiosInstance';

export const getUserProfile = () => {
    return axiosInstance.get('/auth/profile')
        .then(res => res.data)
        .catch(error => {
            console.error('Error fetching user profile:', error);
            throw error;
        });
};

export const updateUserProfile = (data) => {
    return axiosInstance.put('/auth/profile', data)
        .then(res => res.data)
        .catch(error => {
            console.error('Error updating user profile:', error);
            throw error;
        });
};
