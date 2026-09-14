import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateContactData } from '@/lib/invalidate-contact-data';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => contactsApi.updateContact(id, data),
    onSuccess: () => {
      toast.success('Contact updated successfully');
      invalidateContactData(queryClient);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update contact');
    },
  });
};
