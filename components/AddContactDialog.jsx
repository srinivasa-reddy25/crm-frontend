'use client';
import { tagColor } from '@/lib/tag-colors';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@/lib/validators/contactFormSchema';


import { useState, useEffect } from 'react';



import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';


import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


import { useQueryClient } from '@tanstack/react-query';

import Cookies from 'js-cookie';

import { toast } from 'sonner';


import clsx from 'clsx';

export function AddContactDialog() {

    const queryClient = useQueryClient();


    const [availableTags, setAvailableTags] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [tagError, setTagError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);



    // const availableTags = ['VIP', 'Lead', 'New', 'Follow-Up', 'Important'];

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
            notes: '',
            tags: [],
        },
    });

    const selectedTags = watch('tags');

    const toggleTag = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];

        setValue('tags', newTags);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log('Form Data:', data);

            const token = Cookies.get('auth');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });


            if (!response.ok) {
                throw new Error('Failed to create contact');
            }
            const result = await response.json();
            setIsSubmitting(false);
            console.log('Contact created successfully:', result);
            toast.success('Contact created successfully!');

            reset();

            setIsDialogOpen(false);

            queryClient.invalidateQueries({ queryKey: ['contacts'] });

        } catch (error) {
            console.error('Error creating contact:', error);
            toast.error('Failed to create contact. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {

        console.log('Fetching tags...');

        async function fetchTags() {
            try {
                setIsLoadingTags(true);
                setTagError(null);

                const token = Cookies.get('auth');

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }

                const data = await response.json();
                // console.log('Fetched tags:', data.tags);
                setAvailableTags(data.tags || []);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setTagError('Could not load tags');
            } finally {
                setIsLoadingTags(false);
            }
        }

        fetchTags();
    }, []);





    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add Contact</Button>
            </DialogTrigger>
            <DialogContent className="contact-editor">
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>Fill in the details below</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="contact-editor-form">
                    <div className="contact-editor-body">
                    <div className="grid gap-2">
                        <Label htmlFor="add-contact-name">Name</Label>
                        <Input id="add-contact-name" {...register('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? "add-contact-name-error" : undefined} />
                        {errors.name && (
                            <p id="add-contact-name-error" role="alert" className="text-foreground text-xs">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-contact-email">Email</Label>
                        <Input type="email" id="add-contact-email" {...register('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? "add-contact-email-error" : undefined} />
                        {errors.email && (
                            <p id="add-contact-email-error" role="alert" className="text-foreground text-xs">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-contact-phone">Phone</Label>
                        <Input id="add-contact-phone" {...register('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "add-contact-phone-error" : undefined} />
                        {errors.phone && (
                            <p id="add-contact-phone-error" role="alert" className="text-foreground text-xs">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-contact-company">Company</Label>
                        <Input id="add-contact-company" {...register('company')} aria-invalid={!!errors.company} />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="add-contact-notes">Notes</Label>
                        <Textarea id="add-contact-notes" {...register('notes')} aria-invalid={!!errors.notes} />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            <>
                                {
                                    isLoadingTags ? (
                                        <span className="text-sm text-muted-foreground">Loading tags...</span>
                                    ) : tagError ? (
                                        <span className="text-sm text-foreground">{tagError}</span>
                                    ) : (
                                        <>
                                            {availableTags.map((tag, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant={selectedTags.includes(tag._id) ? 'default' : 'outline'}
                                                    className={clsx('px-3 py-1 rounded-full text-sm',
                                                        { 'bg-opacity-50': selectedTags.includes(tag._id) }
                                                    )}
                                                    style={{
                                                        backgroundColor: selectedTags.includes(tag._id) ? `color-mix(in srgb, ${tagColor(tag.color)} 24%, var(--background))` : 'transparent',
                                                        borderColor: tagColor(tag.color),
                                                        color: 'var(--foreground)'
                                                    }}
                                                    aria-pressed={selectedTags.includes(tag._id)}
                                                    onClick={() => toggleTag(tag._id)}
                                                >
                                                    {tag.name}
                                                </Button>
                                            ))}
                                        </>
                                    )
                                }

                            </>
                        </div>
                    </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>

                        <Button type="submit" disabled={isSubmitting}>{
                            isSubmitting ? "Saving..." :
                                "Save"
                        }</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
