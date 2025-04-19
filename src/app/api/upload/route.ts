// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

// Validate environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET; // Note: This shouldn't be public!
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !apiKey || !apiSecret) {
    console.log(cloudName, apiKey, apiSecret)
    throw new Error('Missing Cloudinary configuration');
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;


        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload options
        const options: UploadApiOptions = {
            upload_preset: uploadPreset
        };

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
        console.log("res", result)
        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Upload error:', error);

        const message = error instanceof Error ?
            (error.name === 'AbortError' ? 'Upload timeout' : error.message) :
            'Upload failed';

        return NextResponse.json(
            { error: message },
            { status: message.includes('timeout') ? 504 : 500 }
        );
    }
}