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

export default router;
