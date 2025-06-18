'use client';

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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Mail, Phone, Building, ArrowLeft, Edit, Trash2, Tag, X, Save } from 'lucide-react';






export function ContactDetails() {

  // const contactId = params.contactid;
  const searchParams = useSearchParams();
  const isEditMod = searchParams.get('isEditMode');


  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const params = useParams();
  const contactId = params.contactid;
  const router = useRouter();
  // const { id, isEditMod } = router.query;


  const onClickingBackButton = () => {
    router.push('/contacts'); // Navigate back to the contacts list
  }
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
      // Discard changes when canceling
      setFormData(contact);
      setErrors({});
    }
    setIsEditMode(!isEditMode);
  };


  const handleDelete = async (contactId) => {
    const token = Cookies.get('auth');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      const result = await response.json();
      console.log('Contact deleted successfully:', result);

      // Redirect or update state after deletion
      router.push('/contacts'); // Navigate back to the contacts list
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Handle error - show error message
    }
  }


  const handleSubmit = async (e) => {
    const token = Cookies.get('auth');
    e.preventDefault();
    // console.log('Submitting form with data:', formData);
    try {
      setErrors({});
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company ? formData.company._id : null,
          tags: formData.tags ? formData.tags.map(tag => tag._id) : [],
          notes: formData.notes,
          // createdBy: formData.createdBy, // Assuming you want to keep this as is
          // createdAt: formData.createdAt, // Assuming you want to keep this as is
          updatedAt: new Date(),
          lastInteraction: new Date() // Assuming you want to update this to now
        }),

      });
      // setContact(response.data);
      const data = await response.json();
      console.log('Updated Contact:', data);
      setIsEditMode(false);
      // Show success message
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating contact:', error);
      }
    }
  };



  const handleDeleteClick = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      handleDelete(contactId);
    }
  }

  const handleTagChange = (tags) => {
    setFormData({
      ...formData,
      tags: tags.map(tag => ({ _id: tag._id, name: tag.name }))
    });
  }




  useEffect(() => {
    // Set editing mode when the query parameter exists and equals 'true'
    if (isEditMod === 'true') {
      setIsEditMode(true);
    }
  }, [isEditMod]);






  useEffect(() => {
    const token = Cookies.get('auth');
    // console.log('Token:', token);
    async function fetchContactData() {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${contactId}`, {

          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(`Failed to fetch contact: ${response.statusText}`);
        const data = await response.json();
        console.log('Contact Data:', data);
        setFormData(data);
        // console.log('Contact ID:', data.company.name);
        setContact(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (contactId) fetchContactData();
  }, [contactId]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <ModeToggle />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Detailed page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-light dark:bg-dark">

        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onClickingBackButton}>
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

          {/* Second Layer - Contact Info in Column */}
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
                {/* <p className="text-lg font-medium">{contact.company.name}</p> */}
                {isEditMode ? (
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
                  <p className="text-lg font-medium">{contact.company ? contact.company.name : "--"}</p>
                )}
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
              )}


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
        <Card>
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
        </Card>

      </div>
    </>
  );
}




