import { useQuery } from '@tanstack/react-query';
import contactsApi from '@/services/contactsApi';

export const useContact = (id) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => contactsApi.fetchContactById(id),
    enabled: !!id, // only fetch if ID is available
  });
};

