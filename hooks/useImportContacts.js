import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateContactData } from '@/lib/invalidate-contact-data';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useImportContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.importContactsCSV,
    onSuccess: () => {
      toast.success('Contacts imported');
      invalidateContactData(queryClient);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to import contacts');
    },
  });
};

