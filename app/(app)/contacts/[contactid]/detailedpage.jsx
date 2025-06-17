'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Mail, Phone, Building, ArrowLeft, Edit, Trash2, Tag } from 'lucide-react';



export function ContactDetails() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const contactId = params.contactid;
  const router = useRouter();


  const onClickingBackButton = () => {
    router.push('/contacts'); // Navigate back to the contacts list
  }



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
        setContact(data.contact);
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
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <Card className="p-6">
          {/* Top Layer - Avatar, Name and Tags */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full h-16 w-16 flex items-center justify-center text-xl font-semibold">
                {contact.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{contact.name}</h2>
                <p className="text-sm text-muted-foreground">{contact.company}</p>
              </div>
            </div>
          </div>

          {/* Second Layer - Contact Info in Column */}
          <CardContent className="mt-6 space-y-4 grid grid-cols-1 grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="inline mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="inline  mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-lg font-medium">{contact.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building className="inline  mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-lg font-medium">{contact.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="inline  mr-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex gap-4 mt-1">
                  <Badge variant="destructive">Hot Lead</Badge>
                  <Badge className="bg-purple-100 text-purple-700">VIP</Badge>
                </div>
              </div>

            </div>
          </CardContent>

          {/* Third Layer - Notes and Last Interaction */}
          <CardContent className="space-y-4 pt-0">
            <div>
              <p className="text-sm font-semibold mb-1">Notes</p>
              <div className="bg-muted text-muted-foreground p-3 rounded-md text-sm">
                {contact.notes || 'No notes available.'}
              </div>
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