const express = require('express');
const { addProduct, getAllProducts, updateProduct, deleteProduct, searchProducts } = require('../controllers/productsController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu trữ file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu ảnh vào thư mục uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file ảnh
    }
});
const upload = multer({ storage: storage });

// Routes cho sản phẩm
router.post('/products', upload.single('image'), addProduct); // Thêm sản phẩm
router.get('/products', getAllProducts); // Lấy tất cả sản phẩm
router.put('/products/:id', updateProduct); // Cập nhật sản phẩm
router.delete('/products/:id', deleteProduct); // Xóa sản phẩm
router.get('/products/search', searchProducts); // Tìm kiếm sản phẩm

module.exports = router;
