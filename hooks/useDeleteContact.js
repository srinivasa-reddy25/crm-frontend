import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateContactData } from '@/lib/invalidate-contact-data';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      toast.success('Contact deleted');
      invalidateContactData(queryClient);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete contact');
    },
  });
};
