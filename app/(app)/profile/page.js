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
import { Camera, Save } from "lucide-react"

import CloudinaryUploader from "@/app/utilities/Cloudinary"
import { CardContent } from "@/components/ui/card"

import { useQuery, useMutation } from "@tanstack/react-query"
import { getUserProfile, updateUserProfile } from "@/services/profileApi"
import { toast } from 'sonner'
import { onAuthStateChanged } from "firebase/auth";

import { useUser } from "@/components/providers/UserContext"

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth"
import { auth } from "@/lib/firebase"



export default function ProfileClient() {
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firebaseUser, setFirebaseUser] = useState(null);



  const { userData, isLoading, isError, error } = useUser();
  console.log("User Data:", userData)

  // const {
  //   data: userData,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ['userProfile'],
  //   queryFn: getUserProfile,
  // });

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '')
      setAvatarUrl(userData.profilePicture || '')
    }
  }, [userData])

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      console.error("Failed to update profile:", error)
      toast.error('Something went wrong while updating your profile.')
    }
  });

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      const imageurl = await CloudinaryUploader(file)
      if (imageurl) {
        setAvatarUrl(imageurl)
      } else {
        throw new Error("Image upload failed")
      }
    } catch (error) {
      toast.error("Error uploading avatar")
      console.log(error)
    }
  }

  const handleSaveChanges = () => {
    const payload = {
      displayName,
      profilePicture: avatarUrl,
    }
    saveProfile(payload)
  }


  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      const user = auth.currentUser
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Password change error:", error)
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect")
      } else {
        toast.error("Failed to update password")
      }
    }
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isGoogleUser = firebaseUser?.providerData[0]?.providerId === "google.com";





  if (isLoading) return <div>Loading...</div>
  if (isError) {
    console.error("Error fetching user profile:", error)
    return <div>Error loading profile</div>
  }

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
                value={userData.email}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                Email address cannot be changed
              </p>
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} className="px-8" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {firebaseUser && isGoogleUser ?
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Manage your password in your Google Account
            </a>
            :
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />

              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />

              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />

              <Button
                onClick={handleChangePassword}
                className="px-8 ml-4 bg-yellow-600 hover:bg-yellow-700"
                disabled={isSaving}
              >
                Change Password
              </Button>

            </div>
          }




        </CardContent>
      </div>
    </>
  )
}
