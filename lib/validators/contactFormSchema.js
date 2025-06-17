import { z } from 'zod';

export const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .refine(
            (value) => value === '' || /^\d{10}$/.test(value.replace(/\D/g, '')),
            { message: 'Phone number must be exactly 10 digits' }
        )
        .optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
});
