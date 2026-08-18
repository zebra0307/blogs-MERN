import express from 'express';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.post('/pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'zblogs/question-papers',
                    resource_type: 'raw', 
                    public_id: Date.now() + '-' + req.file.originalname 
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.status(200).json({
            message: 'File uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'File upload failed'
        });
    }
});

router.post('/delete-pdf', async (req, res) => {
    try {
        const { fileUrl } = req.body;
        if (!fileUrl) {
            return res.status(400).json({ message: 'No file URL provided' });
        }

        // Extract public_id from Cloudinary URL
        // e.g., https://res.cloudinary.com/.../raw/upload/v1234/zblogs/question-papers/filename.pdf
        const publicIdEncoded = fileUrl.split('/upload/')[1].split('/').slice(1).join('/').split('?')[0];
        const publicId = decodeURI(publicIdEncoded);

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

        if (result.result === 'ok' || result.result === 'not found') {
            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete file from Cloudinary', result });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error while deleting file' });
    }
});

export default router;
