import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateContactData } from '@/lib/invalidate-contact-data';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.bulkDeleteContacts,
    onSuccess: () => {
      toast.success('Contacts deleted in bulk');
      invalidateContactData(queryClient);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Bulk delete failed');
    },
  });
};
