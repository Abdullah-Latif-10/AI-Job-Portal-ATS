const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sanitizes a string to make it safe for URLs (lowercase, alphanumeric, and dashes)
 * @param {string} filename - The raw filename string
 * @returns {string} - Clean string without an extension
 */
const sanitizeFilename = (filename) => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with dashes
    .replace(/-+/g, '-')        // Collapse consecutive dashes into a single dash
    .replace(/^-|-$/g, '');     // Trim trailing/leading dashes
};

/**
 * Upload stream buffer to Cloudinary
 */
const uploadToCloudinary = async (file, folder = 'resumes') => {
  const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    console.warn("Cloudinary environment variables are missing. Using mock upload.");
    const cleanBaseName = sanitizeFilename(file.originalname);
    const ext = path.extname(file.originalname) || '.pdf';
    return {
      url: `https://hireloop-resumes.s3.amazonaws.com/${Date.now()}_${cleanBaseName}${ext}`,
      publicId: `mock_${Date.now()}`
    };
  }

  return new Promise((resolve, reject) => {
    // Get clean name WITHOUT the extension
    const cleanBaseName = sanitizeFilename(file.originalname);
    
    // Cloudinary automatically appends the true file extension to "raw" files.
    // Do NOT include the extension in the public_id string.
    const publicId = `${Date.now()}_${cleanBaseName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'raw',
        public_id: publicId
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

const uploadImageToCloudinary = async (file, folder = 'logos') => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    console.warn('Cloudinary environment variables are missing. Using mock image upload.');
    const cleanBaseName = sanitizeFilename(file.originalname);
    const ext = path.extname(file.originalname) || '.png';
    return {
      url: `https://hireloop-logos.s3.amazonaws.com/${Date.now()}_${cleanBaseName}${ext}`,
      publicId: `mock_logo_${Date.now()}`
    };
  }

  return new Promise((resolve, reject) => {
    const cleanBaseName = sanitizeFilename(file.originalname);
    const publicId = `${Date.now()}_${cleanBaseName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: publicId
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary image upload error:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,
  sanitizeFilename,
  uploadToCloudinary,
  uploadImageToCloudinary
};