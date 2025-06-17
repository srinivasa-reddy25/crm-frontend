'use client'


export default function CloudinaryUploader(file) {
    // let avatarUrl;

    const handleAvatarUpload = async () => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "unsigned_preset")
        formData.append("folder", "profile_pictures")

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/da98b7kad/image/upload",
            {
                method: "POST",
                body: formData,
            }
        )
        const data = await res.json()
        // avatarUrl = data.secure_url
        return data.secure_url
        // console.log("Uploaded Image URL:", data.secure_url)
    }
    return handleAvatarUpload()
    // return avatarUrl;
}
