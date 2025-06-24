'use client';

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
            console.log('Contact created successfully:', result);
            toast.success('Contact created successfully!');

            reset();

            setIsDialogOpen(false);
            
            queryClient.invalidateQueries({ queryKey: ['contacts'] });

        } catch (error) {
            console.error('Error creating contact:', error);
            toast.error('Failed to create contact. Please try again.');
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>Fill in the details below</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input {...register('name')} />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" {...register('email')} />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input {...register('phone')} />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input {...register('company')} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea {...register('notes')} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant={selectedTags.includes(tag._id) ? 'default' : 'outline'}
                                    className={clsx('px-3 py-1 rounded-full text-sm',
                                        { 'bg-opacity-50': selectedTags.includes(tag._id) }
                                    )}
                                    style={{
                                        backgroundColor: selectedTags.includes(tag._id) ? tag.color : 'transparent',
                                        borderColor: tag.color,
                                        color: selectedTags.includes(tag._id) ? '#fff' : undefined
                                    }}
                                    onClick={() => toggleTag(tag._id)}
                                >
                                    {tag.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
