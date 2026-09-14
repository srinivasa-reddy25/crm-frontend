'use client'
import { invalidateContactData } from '@/lib/invalidate-contact-data';

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { UploadCloud } from 'lucide-react'

import Cookies from 'js-cookie'

export function ImportCsvDialog() {
  const queryClient = useQueryClient();
  const token = Cookies.get('auth')
  // console.log('Token:', token)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isuploading, setIsUploading] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const chooseFile = selected => {
    if (!selected) return;
    if (!/\.csv$/i.test(selected.name)) { setFile(null); toast.error('Please choose a .csv file.'); return; }
    if (selected.size > 10 * 1024 * 1024) { setFile(null); toast.error('Choose a CSV smaller than 10 MB.'); return; }
    setFile(selected);
  };
  const handleDrop = event => { event.preventDefault(); setIsDragging(false); chooseFile(event.dataTransfer.files?.[0]); };
  const handleFileSelect = event => chooseFile(event.target.files?.[0]);

  const handleUpload = async () => {



    if (file) {
      setIsUploading(true)
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/bulk-import`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Make sure this matches your backend's expected format
          },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload file');
        }



        setIsUploading(false)

        if (data.failureCount > 0) {
          toast.error(`Failed to import ${data.failureCount} contacts. Please check the file for errors.`)
        } else {
          toast.success('All contacts imported successfully!');
        }

        console.log("responseData  : ", data)
        console.log('File ready for upload:', file)
        invalidateContactData(queryClient);
        setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error(error.message || 'Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }


      // Handle the file upload logic here

      // Reset the file state after upload
    } else {
      toast.error('Please select a CSV file to upload.')
    }
  }








  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import CSV</Button>
      </DialogTrigger>
      <DialogContent className="bounded-dialog">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a .csv file to import contacts into your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="dialog-scroll-body space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-foreground bg-muted' : 'border-gray-300'
            }`}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop your CSV file here
          </p>
          {file && (
            <p className="mt-2 text-sm font-medium text-primary">{file.name}</p>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="csvFile">Or choose file:</Label>
          <Input id="csvFile" type="file" accept=".csv" onChange={handleFileSelect} />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            CSV Upload Guidelines:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• The first row must include headers: name, email, phone, company, tags</li>
            <li>• Use commas to separate multiple tags</li>
            <li>• File size limit: 10MB</li>
            <li>• Only .csv files are accepted</li>
          </ul>
        </div>

        </div>
        <DialogFooter>
          <Button disabled={!file || isuploading} onClick={handleUpload}>{!isuploading ? "Upload" : 'Uploading...'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
