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
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import { Pencil, Palette } from 'lucide-react'
import Cookies from 'js-cookie'

// Predefined color options (same as in AddTagsDialog)
const colorOptions = [
    { name: 'red', bg: 'bg-red-100', text: 'text-red-800', value: 'red' },
    { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', value: 'blue' },
    { name: 'green', bg: 'bg-green-100', text: 'text-green-800', value: 'green' },
    { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', value: 'yellow' },
    { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', value: 'purple' },
    { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-800', value: 'pink' },
    { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-800', value: 'indigo' },
    { name: 'gray', bg: 'bg-gray-100', text: 'text-gray-800', value: 'gray' },
]

export function EditTagDialog({ tag, onTagUpdated }) {
    const token = Cookies.get('auth')
    const [isOpen, setIsOpen] = useState(false)
    const [tagName, setTagName] = useState('')
    const [selectedColor, setSelectedColor] = useState(colorOptions[0])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize form when tag prop changes or dialog opens
    useEffect(() => {
        if (tag && isOpen) {
            setTagName(tag.name)

            // Find matching color or default to first color
            const tagColor = colorOptions.find(color => color.value === tag.color) || colorOptions[0]
            setSelectedColor(tagColor)
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
                    color: selectedColor.value
                }),
            })

            const data = await response.json()
            console.log(data)

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update tag')
            }

            if (onTagUpdated) {
                onTagUpdated({
                    ...tag,
                    name: tagName,
                    color: selectedColor.value
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
                <Button variant="ghost" size="icon" className={"cursor-pointer"}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogDescription>
                        Modify the tag name and color.
                    </DialogDescription>
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
                        <Label>Tag Color</Label>
                        <div className="flex items-center space-x-2">
                            <div
                                className={`w-10 h-10 rounded-md ${selectedColor.bg}`}
                                aria-label={`Selected color: ${selectedColor.name}`}
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <Palette className="h-4 w-4 mr-2" />
                                        Change Color
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                className={`${color.bg} ${color.text} p-2 rounded-md hover:opacity-80 transition-opacity`}
                                                onClick={() => setSelectedColor(color)}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="text-sm font-medium">Preview:</div>
                        <div className={`mt-1 inline-block px-3 py-1 rounded-md ${selectedColor.bg} ${selectedColor.text}`}>
                            {tagName || 'Tag Preview'}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !tagName.trim()}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}