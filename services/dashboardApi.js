import axiosInstance from './axiosInstance';



export const getDashboardSummary = async (params) => {
    try {
        const response = await axiosInstance.get('/dashboard/summary', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
}
export const getContactByCompany = async (params) => {
    try {
        const response = await axiosInstance.get('/dashboard/contacts-by-company', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts by company:', error);
        throw error;
    }
}
export const getActivitiesTimeline = async (params) => {
    try {
        const response = await axiosInstance.get('/dashboard/activities-timeline', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching activities timeline:', error);
        throw error;
    }
}

export const getTagDistribution = async (params) => {
    try {
        const response = await axiosInstance.get('/dashboard/tag-distribution', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tag distribution:', error);
        throw error;
    }
}


