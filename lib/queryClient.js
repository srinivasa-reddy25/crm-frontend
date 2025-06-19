import { QueryClient } from '@tanstack/react-query';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: 2,
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: (error) => {
                const message = error.response?.data?.error || error.message || 'Failed to delete contact';
                toast.error(message);
                console.error('Delete failed:', message);
            }
        },
    },
});


export default queryClient;