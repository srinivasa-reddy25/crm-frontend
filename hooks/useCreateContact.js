import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateContactData } from '@/lib/invalidate-contact-data';
import contactsApi from '@/services/contactsApi';
import { toast } from 'sonner';

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.createContact,
    onSuccess: () => {
      toast.success('Contact created successfully');
      invalidateContactData(queryClient);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create contact');
    },
  });
};

