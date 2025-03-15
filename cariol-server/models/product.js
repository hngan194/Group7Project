const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: [String],  // Mảng chứa các đường dẫn ảnh sản phẩm
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },

    infor: {
        type: String,
        required: true
    }
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
