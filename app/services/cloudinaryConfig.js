/**
 * Cloudinary Configuration Service
 * Securely manages Cloudinary credentials and upload operations
 */

// Load from environment variables (frontend-safe values only)
const CLOUDINARY_CONFIG = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dcm1plq42',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'choja_preset',
    apiBaseUrl: 'https://api.cloudinary.com/v1_1',
};

/**
 * Validate Cloudinary configuration
 */
export function validateCloudinaryConfig() {
    if (!CLOUDINARY_CONFIG.cloudName) {
        throw new Error('Missing CLOUDINARY_CLOUD_NAME in environment variables');
    }
    if (!CLOUDINARY_CONFIG.uploadPreset) {
        throw new Error('Missing CLOUDINARY_UPLOAD_PRESET in environment variables');
    }
    return true;
}

/**
 * Get Cloudinary upload URL
 * @param {string} resourceType - Type of resource: 'image', 'video', 'auto'
 * @returns {string} - Full Cloudinary upload endpoint URL
 */
export function getCloudinaryUploadUrl(resourceType = 'image') {
    validateCloudinaryConfig();
    return `${CLOUDINARY_CONFIG.apiBaseUrl}/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
}

/**
 * Get Cloudinary configuration for client-side uploads
 * @returns {object} - Configuration object
 */
export function getCloudinaryConfig() {
    validateCloudinaryConfig();
    return {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        uploadUrl: getCloudinaryUploadUrl('image'),
    };
}

/**
 * Upload file to Cloudinary
 * @param {File} file - File object to upload
 * @returns {Promise<object>} - Upload response with secure_url
 */
export async function uploadToCloudinary(file) {
    if (!file) {
        throw new Error('File is required');
    }

    const mimeType = file.type || 'application/octet-stream';
    const isVideo = mimeType.startsWith('video/');
    const isImage = mimeType.startsWith('image/');

    // Validate file size (10MB max for images, 50MB max for videos)
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
        throw new Error('Video file is too large. Maximum size is 50MB.');
    } else if (!isVideo && file.size > MAX_IMAGE_SIZE) {
        throw new Error('Image file is too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    const resourceType = isVideo ? 'video' : isImage ? 'image' : 'auto';
    const uploadUrl = getCloudinaryUploadUrl(resourceType);

    try {
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            const errorMessage = uploadData?.error?.message || 'Upload failed';
            console.error('Cloudinary upload error:', errorMessage);
            throw new Error(errorMessage);
        }

        if (!uploadData?.secure_url) {
            throw new Error('No secure URL returned from Cloudinary');
        }

        return {
            name: file.name,
            mimeType,
            size: file.size,
            type: isImage ? 'image' : 'file',
            url: uploadData.secure_url,
            publicId: uploadData.public_id, // Store for future deletion/manipulation
            cloudinaryResponse: uploadData, // Store full response for reference
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
}

/**
 * Validate Cloudinary URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid Cloudinary URL
 */
export function isValidCloudinaryUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export default CLOUDINARY_CONFIG;
