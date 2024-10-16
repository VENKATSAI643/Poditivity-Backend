// controllers/fileController.js
const multer = require('multer');
const File = require('../models/File');

// Configure multer for file storage in the /uploads directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

// File upload handler
const uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err });
        }

        const newFile = new File({
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            userId: req.user._id
        });

        await newFile.save();

        res.status(201).json({
            message: 'File uploaded successfully',
            file: newFile
        });
    });
};

// File list handler
const listFiles = async (req, res) => {
    const files = await File.find({ userId: req.user._id });
    res.status(200).json(files);
};

// File download handler
const downloadFile = (req, res) => {
    const filePath = `./uploads/${req.params.filename}`;
    res.download(filePath);
};

module.exports = { uploadFile, listFiles, downloadFile };
