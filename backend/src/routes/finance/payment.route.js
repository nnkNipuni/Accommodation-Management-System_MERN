import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    createPayment,
    deletePayment,
    getPaymentDetails,
    getAllPayments,
    updatePaymentStatus,
    searchPayments,
    getUserPayments
} from '../../controllers/finance/paymentController.js';

const router = express.Router();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer for PDF file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../uploads2');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept PDFs, images, and other common document formats
        const allowedMimeTypes = [
            'application/pdf', 
            'image/jpeg', 
            'image/png', 
            'image/jpg'
        ];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed!'), false);
        }
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
};

// Routes
router.post('/create', upload.single('proof'), handleMulterError, createPayment);
router.get('/details/:boardingOwnerId', getPaymentDetails);
router.get('/user/:userId', getUserPayments);
router.put('/status/:paymentId', updatePaymentStatus);
router.delete('/delete/:paymentId', deletePayment);
router.get('/all', getAllPayments);
router.get('/search', searchPayments);

export default router;


