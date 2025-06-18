import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useContacts = (page = 1, filters = {}) => {
    console.log('useContact hook called with ID:', id);
    return useQuery({
        queryKey: ['contacts', page, filters],
        queryFn: () => contactsApi.fetchContacts(page, filters),
        placeholderData: keepPreviousData => keepPreviousData, // Updated from keepPreviousData
    });
};

