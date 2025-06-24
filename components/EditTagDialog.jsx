'use client'

import { useState, useEffect } from 'react'
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
import { Pencil } from 'lucide-react'
import Cookies from 'js-cookie'

// Utility to choose black or white text for good contrast
function getReadableTextColor(hex) {
    if (!hex || hex[0] !== '#') return '#000000'
    const r = parseInt(hex.substr(1, 2), 16)
    const g = parseInt(hex.substr(3, 2), 16)
    const b = parseInt(hex.substr(5, 2), 16)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    return brightness > 150 ? '#000000' : '#FFFFFF'
}

export function EditTagDialog({ tag, onTagUpdated }) {
    const token = Cookies.get('auth')
    const [isOpen, setIsOpen] = useState(false)
    const [tagName, setTagName] = useState('')
    const [selectedColor, setSelectedColor] = useState('#808080')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (tag && isOpen) {
            setTagName(tag.name)
            setSelectedColor(tag.color || '#808080')
        }
    }, [tag, isOpen])

    const handleSubmit = async () => {
        if (!tagName.trim()) {
            alert('Tag name cannot be empty.')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags/${tag._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: tagName,
                    color: selectedColor
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Failed to update tag')

            if (onTagUpdated) {
                onTagUpdated({
                    ...tag,
                    name: tagName,
                    color: selectedColor
                })
            }

            setIsOpen(false)
        } catch (error) {
            console.error('Error updating tag:', error)
            alert('Failed to update tag. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogDescription>Modify the tag name and color.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="tagName">Tag Name</Label>
                        <Input
                            id="tagName"
                            placeholder="Enter tag name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="colorPicker">Tag Color</Label>
                        <input
                            id="colorPicker"
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-12 h-12 p-0 border rounded-md cursor-pointer"
                        />
                    </div>

                    <div className="mt-2">
                        <div className="text-sm font-medium">Preview:</div>
                        <div
                            className="mt-1 inline-block px-3 py-1 rounded-md"
                            style={{
                                backgroundColor: selectedColor,
                                color: getReadableTextColor(selectedColor)
                            }}
                        >
                            {tagName || 'Tag Preview'}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !tagName.trim()}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
