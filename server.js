const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const path = require('path');

// Inisialisasi Firebase
const serviceAccount = require('./app-earning-5e158-firebase-adminsdk-d5wl9-d71133b3da.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'app-earning-5e158.appspot.com', // Ganti dengan bucket Anda
});

const app = express();
const port = process.env.PORT || 3000;
const bucket = admin.storage().bucket();

// Middleware untuk melayani file statis
app.use(express.static('public'));

// Konfigurasi multer untuk upload file
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint untuk upload file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Tidak ada file yang diupload' });
        }

        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });

        blobStream.on('finish', () => {
            res.status(200).json({ message: 'File uploaded successfully', url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.originalname)}?alt=media` });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});