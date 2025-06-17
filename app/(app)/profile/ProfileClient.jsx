"use client"

import { useEffect, useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Eye, EyeOff, Save } from "lucide-react"
import axios from "axios"
import Cookies from "js-cookie"

import CloudinaryUploader from "@/app/utilities/Cloudinary"

import { getContacts } from "@/services/contactsApi"

import { CardContent } from "@/components/ui/card"


export default function ProfileClient() {
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const getInitials = (name) =>
        name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return
        try {
            const imageurl = await CloudinaryUploader(file)
            if (imageurl) {
                setAvatarUrl(imageurl)
            }
            else {
                throw new Error("image error")
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    const handleSaveChanges = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            alert("New passwords do not match")
            return
        }

        const authCookie = Cookies.get('auth')

        try {
            console.log("current name ", displayName)
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
                {
                    displayName,
                    profilePicture: avatarUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authCookie}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log("Response from backend:", response.data)

            alert("Profile updated successfully!")

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            console.error("Failed to update profile:", err)
            alert("Something went wrong while updating your profile.")
        }
    }


    useEffect(() => {
        const authCookie = Cookies.get('auth')
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${authCookie}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = response.data
                setDisplayName(data.user.displayName)
                setEmail(data.user.email)
                setAvatarUrl(data.user.profilePicture)
                // console.log(data)
            } catch (err) {
                console.error("Failed to fetch profile:", err)
            }
        }

        fetchUserData()
    }, [])


    // useEffect(() => {
    //     getContacts()
    //         .then((res) => console.log('Fetched contacts:', res))
    //         .catch((err) => console.error('Error fetching contacts:', err));
    // }, []);


    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <ModeToggle />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-light dark:bg-dark">
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarUrl} alt="Profile picture" />
                                <AvatarFallback className="text-lg">
                                    {getInitials(displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors shadow-lg"
                            >
                                <Camera className="w-4 h-4" />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Click the camera icon to upload a new profile picture
                        </p>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your display name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                value={email}
                                readOnly
                                className="bg-gray-50 cursor-not-allowed"
                                placeholder="your.email@example.com"
                            />
                            <p className="text-xs text-gray-500">
                                Email address cannot be changed
                            </p>
                        </div>
                    </div>

                    {/* <Separator /> */}

                    {/* Password Update Section */}
                    {/* <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Update Password</h3>
                            <p className="text-sm text-gray-500">
                                Leave blank if you don't want to change your password
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <Separator />

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveChanges} className="px-8">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>

            </div>
        </>
    )
}
