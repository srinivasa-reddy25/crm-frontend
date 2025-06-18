'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { UploadCloud } from 'lucide-react'

import Cookies from 'js-cookie'

export function ImportCsvDialog() {
  const token = Cookies.get('auth')
  // console.log('Token:', token)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile)
    } else {
      alert('Please upload a valid CSV file.')
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      alert('Please select a valid CSV file.')
    }
  }

  const handleUpload = async () => {



    if (file) {
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
        console.log("responseData  : ", data)

        console.log('File ready for upload:', file)
        alert('File uploaded successfully!');

      } catch (error) {
        console.error('Error uploading file:', error)
      }


      // Handle the file upload logic here

      // Reset the file state after upload
      setFile(null)
    } else {
      alert('Please select a CSV file to upload.')
    }
  }








  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a .csv file to import contacts into your workspace.
          </DialogDescription>
        </DialogHeader>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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

        <DialogFooter className="mt-4">
          <Button disabled={!file} onClick={handleUpload} >Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
