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
                console.error('Mutation Error:', error.message);
            },
        },
    },
});


export default queryClient;