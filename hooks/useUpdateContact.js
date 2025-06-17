import { useMutation, useQueryClient } from '@tanstack/react-query';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => contactsApi.updateContact(id, data),
    onSuccess: () => {
      toast.success('Contact updated successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update contact');
    },
  });
};
