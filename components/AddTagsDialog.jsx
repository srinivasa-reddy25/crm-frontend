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
import { Tag, Plus, X } from 'lucide-react'
import Cookies from 'js-cookie'

// Utility to compute readable text color (black or white) for any background
function getReadableTextColor(hex) {
    if (!hex || hex[0] !== '#') return '#000000'
    const r = parseInt(hex.substr(1, 2), 16)
    const g = parseInt(hex.substr(3, 2), 16)
    const b = parseInt(hex.substr(5, 2), 16)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    return brightness > 150 ? '#000000' : '#FFFFFF'
}

export function AddTagsDialog({ contactId, onTagsAdded }) {
    const token = Cookies.get('auth')
    const [tagInput, setTagInput] = useState('')
    const [selectedColor, setSelectedColor] = useState('#808080')
    const [tags, setTags] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const handleAddTag = () => {
        const name = tagInput.trim()
        if (name && !tags.some(tag => tag.name === name)) {
            setTags([...tags, { name, color: selectedColor }])
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
            if (!response.ok) throw new Error(data.message || 'Failed to add tags')

            alert('Tags added successfully!')
            if (onTagsAdded) onTagsAdded(tags)
            setTags([])
            setIsOpen(false)
        } catch (error) {
            console.error('Error adding tags:', error)
            alert('Failed to add tags. Please try again.')
        }
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
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Enter a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                        />
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-10 h-10 p-0 border rounded-md cursor-pointer"
                            title="Choose color"
                        />
                        <Button type="button" onClick={handleAddTag} size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="px-2 py-1 rounded-md flex items-center gap-1"
                                    style={{
                                        backgroundColor: tag.color,
                                        color: getReadableTextColor(tag.color)
                                    }}
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
                    <Button onClick={handleSubmit} disabled={tags.length === 0}>
                        Save Tags
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
