import { useMutation, useQueryClient } from '@tanstack/react-query';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useImportContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.importContactsCSV,
    onSuccess: () => {
      toast.success('Contacts imported');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to import contacts');
    },
  });
};

