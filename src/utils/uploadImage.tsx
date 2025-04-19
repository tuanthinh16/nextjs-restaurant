export async function uploadToCloudinary(file: File, public_id: string) {
    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    // const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET; // Note: This shouldn't be public!
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !apiKey) {
        console.log(cloudName, apiKey)
        throw new Error('Missing Cloudinary configuration');
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset as string); // Thay bằng upload preset của bạn
    formData.append('api_key', apiKey); // Thay bằng API key của bạn
    formData.append('public_id', public_id);
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

