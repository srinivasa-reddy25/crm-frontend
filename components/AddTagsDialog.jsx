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

import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import { Tag, Plus, X, Palette } from 'lucide-react'
import Cookies from 'js-cookie'

// Predefined color options
const colorOptions = [
    { name: 'Red', bg: 'bg-red-100', text: 'text-red-800', value: 'red' },
    { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-800', value: 'blue' },
    { name: 'Green', bg: 'bg-green-100', text: 'text-green-800', value: 'green' },
    { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', value: 'yellow' },
    { name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-800', value: 'purple' },
    { name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-800', value: 'pink' },
    { name: 'Indigo', bg: 'bg-indigo-100', text: 'text-indigo-800', value: 'indigo' },
    { name: 'Gray', bg: 'bg-gray-100', text: 'text-gray-800', value: 'gray' },
]

export function AddTagsDialog({ contactId, onTagsAdded }) {
    const token = Cookies.get('auth')
    const [tagInput, setTagInput] = useState('')
    const [selectedColor, setSelectedColor] = useState(colorOptions[0])
    const [tags, setTags] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.some(tag => tag.name === tagInput.trim())) {
            setTags([...tags, {
                name: tagInput.trim(),
                color: selectedColor.value
            }])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag.name !== tagToRemove.name))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleSubmit = async () => {
        if (tags.length === 0) {
            alert('Please add at least one tag.')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tags }),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add tags')
            }

            alert('Tags added successfully!')
            if (onTagsAdded) onTagsAdded(tags)
            setTags([])
            setIsOpen(false)
        } catch (error) {
            console.error('Error adding tags:', error)
            alert('Failed to add tags. Please try again.')
        }
    }

    const getTagClasses = (colorValue) => {
        const colorOption = colorOptions.find(option => option.value === colorValue) || colorOptions[0]
        return `${colorOption.bg} ${colorOption.text}`
    }





    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Add Tags
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Tags</DialogTitle>
                    <DialogDescription>
                        Add tags with custom colors to organize and filter your contacts.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="flex-shrink-0 cursor-pointer">
                                    <Palette className="h-4 w-4" style={{ color: selectedColor.value }} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 ">
                                <div className="grid grid-cols-4 gap-2 ">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            className={`${color.bg} ${color.text} p-2 rounded-md hover:opacity-80 transition-opacity text-xs cursor-pointer`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button type="button" onClick={handleAddTag} size="icon" className="flex-shrink-0 cursor-pointer">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className={`px-2 py-1 rounded-md flex items-center gap-1 ${getTagClasses(tag.color)}`}
                                >
                                    <span>{tag.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:opacity-70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button onClick={handleSubmit} disabled={tags.length === 0} className={"cursor:pointer"}>
                        Save Tags
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}