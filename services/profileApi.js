import axiosInstance from './axiosInstance';

/**
 * Fetch the current user's profile.
 * GET /auth/profile
 */
export const getUserProfile = () => {
    return axiosInstance.get('/auth/profile')
        .then(res => res.data)
        .catch(error => {
            console.error('Error fetching user profile:', error);
            throw error;
        });
};

/**
 * Update the current user's profile.
 * PUT /auth/profile
 * @param {Object} data - Object with updated profile info (e.g., displayName, profilePicture)
 */

export const updateUserProfile = (data) => {
    return axiosInstance.put('/auth/profile', data)
        .then(res => res.data)
        .catch(error => {
            console.error('Error updating user profile:', error);
            throw error;
        });
};
