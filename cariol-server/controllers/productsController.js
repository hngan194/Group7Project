const Product = require('../models/product'); // Import model Product

// Thêm sản phẩm mới
const addProduct = async (req, res) => {
    try {
        const { name, price, description, categoryName, color, size, info } = req.body;
        const image = req.file ? req.file.path : null;  // Lưu trữ đường dẫn hình ảnh

        // Kiểm tra xem các trường thông tin có đầy đủ không
        if (!name || !price || !categoryName || !color || !size || !info) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        const newProduct = new Product({ 
            name, 
            price, 
            description, 
            categoryName, 
            color, 
            size, 
            info, 
            image 
        });

        await newProduct.save();
        return res.status(201).json({ message: 'Thêm sản phẩm thành công!', product: newProduct });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: error.message });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }
        
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product: updatedProduct });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};

// Tìm kiếm sản phẩm theo tên hoặc danh mục
const searchProducts = async (req, res) => {
    try {
        const { name, categoryName } = req.query;
        
        const products = await Product.find({
            name: { $regex: name, $options: 'i' },
            categoryName: { $regex: categoryName, $options: 'i' }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm nào phù hợp' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm', error: error.message });
    }
};

module.exports = { addProduct, getAllProducts, updateProduct, deleteProduct, searchProducts };
