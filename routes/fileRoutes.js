// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { uploadFile, listFiles, downloadFile } = require('../controllers/fileController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Upload file
router.post('/upload', authenticateToken, uploadFile);

// List files
router.get('/list', authenticateToken, listFiles);

// Download file by filename
router.get('/download/:filename', authenticateToken, downloadFile);

module.exports = router;
