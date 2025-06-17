import { useMutation, useQueryClient } from '@tanstack/react-query';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      toast.success('Contact deleted');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete contact');
    },
  });
};
