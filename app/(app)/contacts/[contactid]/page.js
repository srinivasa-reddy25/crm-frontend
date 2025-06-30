'use client';
import { cn } from "@/lib/utils";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Mail, Phone, Building, ArrowLeft, Edit, Trash2, Tag, X, Save, Check, ChevronsUpDown } from 'lucide-react';

import { getContactById } from "@/services/contactsApi";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import queryClient from "@/lib/queryClient";

import { getTags } from "@/services/tagsApi";
import { deleteContact } from "@/services/contactsApi";
import { updateContact } from '@/services/contactsApi';

import { toast } from 'sonner';

export default function ContactDetails() {

  // const contactId = params.contactid;
  const searchParams = useSearchParams();
  const isEditMod = searchParams.get('isEditMode');


  // const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(isEditMod ? true : false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [availableTags, setAvailableTags] = useState([]);
  // const [error, setError] = useState(null);
  const params = useParams();
  const contactId = params.contactid;

  const router = useRouter();
  const queryClient = useQueryClient();



  const {
    data: contact,
    isLoading,
    error
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContactById(contactId),
    enabled: !!contactId, // Only run the query if contactId exists
  });


  const { mutate: deleteContactMutate, isPending: isUpdating } = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      toast.success('Contact deleted!');
      queryClient.invalidateQueries(['contacts']);
      router.push('/contacts');
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      toast.error('Failed to delete contact');
    },
  });




  const { mutate: updateContactMutate, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, data }) => updateContact(id, data),
    onSuccess: (res) => {
      toast.success('Contact updated!');
      queryClient.invalidateQueries(['contacts']);
      setIsEditMode(false);
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  });




  const { data: tagsData, isLoading: isLoadingTags, error: tagError } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: isEditMode === true || isEditMod === 'true',
  });










  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setFormData(contact);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company ? formData.company._id : null,
      tags: formData.tags ? formData.tags.map(tag => tag._id) : [],
      notes: formData.notes,
      updatedAt: new Date(),
      lastInteraction: new Date()
    };
    console.log("Update Data: ", updateData);

    updateContactMutate({ id: contactId, data: updateData });
  };

  const handleDeleteClick = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContactMutate(contactId);
    }
  };

  const handleTagChange = (tags) => {
    setFormData({
      ...formData,
      tags: tags.map(tag => ({ _id: tag._id, name: tag.name }))
    });
  }




  useEffect(() => {
    if (tagsData) {
      setAvailableTags(tagsData.tags || []);
    }
  }, [tagsData]);


  useEffect(() => {
    if (isEditMod === 'true') {
      setIsEditMode(true);
    }
  }, [isEditMod]);


  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);



  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (

    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-light dark:bg-dark">

        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/contacts')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium text-primary">Back to Contacts</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleToggleEditMode}>

              {isEditMode ? <X className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
              {isEditMode ? 'Cancel' : 'Edit'}
            </Button>

            {isEditMode ? <Button variant="success" onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-1" />
              SAVE
            </Button> : <Button variant="destructive" onClick={() => handleDeleteClick(contactId)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>}

          </div>
        </div>

        <Card className="p-6">
          {/* Top Layer - Avatar, Name and Tags */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full h-16 w-16 flex items-center justify-center text-xl font-semibold">
                {getInitials(contact.name)}
              </div>
              <div>
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-xl font-bold px-2 py-1 border rounded-md w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{contact.name}</h2>
                )}
                <p className="text-sm text-muted-foreground">{contact.company ? contact.company.name : "--"}</p>
                {/* {isEditMode ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company?.name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, name: e.target.value },
                      })
                    }
                    className="text-sm px-2 py-1 mt-1 border rounded-md w-full text-muted-foreground"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{contact.company.name}</p>
                )} */}
              </div>

            </div>
          </div>

          <CardContent className="mt-6 space-y-4 grid grid-cols-1 grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="inline mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                {isEditMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-base px-2 py-1 border rounded-md w-full"
                  />
                ) : (
                  <p className="text-lg font-medium">{contact.email}</p>
                )}

              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="inline  mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                {isEditMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-base px-2 py-1 border rounded-md w-full"
                  />
                ) : (
                  <p className="text-lg font-medium">{contact.phone}</p>
                )}

              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building className="inline  mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-lg font-medium">{contact.company?.name || "--"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="inline  mr-1 text-muted-foreground" />
              {/* <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex gap-4 mt-1">
                  {contact.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      style={{
                        borderColor: tag.color || '#888888',
                        color: tag.color || '#888888'
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div> */}
              <p className="text-sm text-muted-foreground">Tags</p>


              {isEditMode ? (
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {formData.tags?.length > 0
                          ? `${formData.tags.length} tag${formData.tags.length > 1 ? 's' : ''} selected`
                          : "Select tags..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {availableTags.map((tag) => (
                            <CommandItem
                              key={tag._id}
                              value={tag.name}
                              onSelect={() => {
                                setFormData(prevData => {
                                  const isSelected = prevData.tags?.some(t => t._id === tag._id);

                                  let updatedTags;
                                  if (isSelected) {
                                    // Remove tag if already selected
                                    updatedTags = prevData.tags.filter(t => t._id !== tag._id);
                                  } else {
                                    // Add tag if not selected
                                    updatedTags = [...(prevData.tags || []), tag];
                                  }

                                  return { ...prevData, tags: updatedTags };
                                });
                              }}
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: tag.color || '#888888' }}
                                />
                                {tag.name}
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  formData.tags?.some(t => t._id === tag._id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Display selected tags */}
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag._id}
                          variant="outline"
                          style={{
                            borderColor: tag.color || '#888888',
                            color: tag.color || '#888888',
                            backgroundColor: `${tag.color}10` || '#f8f8f8',
                          }}
                        >
                          {tag.name}
                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none focus:ring-2"
                            onClick={() => {
                              setFormData(prevData => ({
                                ...prevData,
                                tags: prevData.tags.filter(t => t._id !== tag._id)
                              }))
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 mt-1">
                  {contact.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      style={{
                        borderColor: tag.color || '#888888',
                        color: tag.color || '#888888',
                        backgroundColor: `${tag.color}10` || '#f8f8f8',
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}



              {/* {isEditMode ? (
                <input
                  type="text"
                  name="tags"
                  value={formData.tags?.map(tag => tag.name).join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map(tag => ({ name: tag.trim() })),
                    })
                  }
                  className="text-base px-2 py-1 border rounded-md w-full"
                />
              ) : (
                <div className="flex gap-4 mt-1">
                  {contact.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      style={{
                        borderColor: tag.color || '#888888',
                        color: tag.color || '#888888',
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )} */}


            </div>
          </CardContent>

          {/* Third Layer - Notes and Last Interaction */}
          <CardContent className="space-y-4 pt-0">
            <div>
              <p className="text-sm font-semibold mb-1">Notes</p>
              {isEditMode ? (
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded-md text-sm"
                />
              ) : (
                <div className="bg-muted text-muted-foreground p-3 rounded-md text-sm">
                  {contact.notes || 'No notes available.'}
                </div>
              )}

            </div>

            <p className="text-xs text-muted-foreground">
              Last interaction: {contact.lastInteraction || 'Not available'}
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-500">Email sent</span>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-500">Meeting scheduled</span>
              <span className="text-sm text-muted-foreground">1 week ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-500">Contact created</span>
              <span className="text-sm text-muted-foreground">2 weeks ago</span>
            </div>
          </CardContent>
        </Card> */}

      </div >
    </>


  );
}














