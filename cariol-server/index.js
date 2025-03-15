const express = require('express');
const app = express();
const port = 3002;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const multer = require('multer');
const path = require('path');

// Cấu hình middleware
app.use(morgan("combined"));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());  // Cấu hình CORS toàn bộ ứng dụng

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const voucherRoutes = require("./routes/voucherRoutes");
app.use("/vouchers", voucherRoutes);
const Voucher = require("./models/Voucher"); // Import đúng model



// Kết nối Mongoose với MongoDB
const mongoUri = "mongodb+srv://ngannh22411c:RqiRhKKhKcSUhEiX@group7.zpydo.mongodb.net/cariol";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch(err => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

// Mô hình cho Collection "products"
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  categoryName: String,
  color: String,
  infor: String,
  amount: Number,
  image: String // Lưu trữ đường dẫn ảnh sản phẩm
});
const Product = mongoose.model("Product", productSchema);

// Mô hình cho Collection "blogs"
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  images: [String]
});
const Blog = mongoose.model("Blog", blogSchema);

// Cấu hình multer để lưu trữ file ảnh sản phẩm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Thư mục nơi các tệp hình ảnh sẽ được lưu
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Đặt tên cho tệp
  }
});
const upload = multer({ storage: storage });


// ------------------------- PRODUCTS ROUTES -------------------------

// API để thêm sản phẩm
app.post('/products', async (req, res) => {
  try {
    const { name, price, description, infor, amount, categoryName, color, image } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!name || !price || !infor || !amount || !categoryName || !color || !image) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name, price, description, infor, amount, categoryName, color, image
    });

    // Lưu vào MongoDB
    await newProduct.save();
    res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', product: newProduct });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi server khi thêm sản phẩm' });
  }
});

// API để lấy tất cả sản phẩm (Admin)
app.get('/admin/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);  // Trả về danh sách sản phẩm dưới dạng JSON
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// API lấy sản phẩm theo danh mục cho client
app.get('/products', (req, res) => {
  const categoryName = req.query.categoryName;  // Lấy categoryName từ query params

  // Kiểm tra nếu categoryName tồn tại
  if (categoryName) {
    // Lọc sản phẩm theo categoryName
    Product.find({ categoryName: categoryName })
      .then(products => {
        res.json(products);  // Trả về các sản phẩm theo categoryName
      })
      .catch(err => {
        res.status(500).json({ error: 'Server Error' });
      });
  } else {
    // Nếu không có categoryName, trả về tất cả sản phẩm
    Product.find()
      .then(products => {
        res.json(products);  // Trả về tất cả sản phẩm
      })
      .catch(err => {
        res.status(500).json({ error: 'Server Error' });
      });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct("categoryName"); // Lấy danh mục duy nhất
    res.json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).json({ error: "Lỗi server khi lấy danh mục" });
  }
});



// API tìm kiếm sản phẩm theo tên và danh mục
// app.get('/products/search', async (req, res) => {
//   try {
//     const { name, categoryName } = req.query;

//     const products = await Product.find({
//       name: { $regex: name, $options: 'i' }, // Tìm kiếm không phân biệt chữ hoa chữ thường
//       categoryName: { $regex: categoryName, $options: 'i' } // Tìm kiếm theo danh mục
//     });

//     res.json(products);
//   } catch (err) {
//     console.error('Lỗi tìm kiếm sản phẩm:', err);
//     res.status(500).json({ error: 'Lỗi server' });
//   }
// });

app.get('/products/search', async (req, res) => {
  try {
    const { name, categoryName } = req.query;
    let filter = {};

    if (name && name !== 'undefined') {
      filter.name = { $regex: name, $options: 'i' };
    }

    // Nếu categoryName != 'all' thì mới lọc theo danh mục
    if (categoryName && categoryName !== 'all' && categoryName !== 'undefined') {
      filter.categoryName = categoryName;
    }

    console.log("Tìm kiếm với filter:", filter); // Debug log kiểm tra filter gửi đến MongoDB

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Lỗi tìm kiếm sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});



// API sửa sản phẩm theo ID
app.get('/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});


app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryName, color, infor, amount, image } = req.body;

    // Cập nhật sản phẩm trong MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name, price, description, categoryName, color, infor, amount, image
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được cập nhật', product: updatedProduct });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi server khi cập nhật sản phẩm' });
  }
});




// API xóa sản phẩm theo ID
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ message: 'Sản phẩm đã được xóa' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});


// ------------------------- BLOGS ROUTES -------------------------

// API thêm blog
app.post('/blogs', (req, res) => {
  const { title, author, content, images } = req.body;

  const newBlog = new Blog({
    title,
    author,
    content,
    images
  });

  newBlog.save()
    .then(blog => res.status(201).json(blog))
    .catch(err => {
      console.error('Error saving blog:', err);  // Log lỗi để xác định nguyên nhân
      res.status(500).json({ error: 'Error saving blog' });
    });
});

// API lấy tất cả blog
app.get("/blogs", async (req, res) => {
  try {
    const result = await Blog.find({});
    res.send(result);
  } catch (error) {
    res.status(500).send("Error retrieving blogs");
  }
});

// API lấy chi tiết blog theo ID
app.get("/blogs/:id", async (req, res) => {
  const blogId = req.params.id;

  // Kiểm tra xem blogId có hợp lệ không
  if (!ObjectId.isValid(blogId)) {
    return res.status(400).send({ message: "Invalid blog ID" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      res.status(404).send({ message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error retrieving blog:", error);  // Log lỗi chi tiết
    res.status(500).send("Error retrieving blog");
  }
});

// API sửa blog
app.put('/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author, images } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id, 
      { title, content, author, images }, 
      { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Error updating blog' });
  }
});

// API xóa blog theo ID
app.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Error deleting blog' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Route mặc định
app.get("/", (req, res) => {
  res.send("This Web server is processed for MongoDB with Mongoose");
});

// -----------------VOUCHER--------------------

 // ✅ API THÊM VOUCHER (POST)
 app.post("/vouchers", async (req, res) => {
  try {
    const { code, discount, minOrderValue, startDate, endDate } = req.body;

    if (!code || !discount || !minOrderValue || !startDate || !endDate) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const newVoucher = new VoucherModel({
      code,
      discount,
      minOrderValue,
      startDate,
      endDate,
    });

    const savedVoucher = await newVoucher.save();
    res.status(201).json({ message: "Thêm voucher thành công", voucher: savedVoucher });
  } catch (error) {
    console.error("🔥 Lỗi khi thêm voucher:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ✅ API CẬP NHẬT VOUCHER (PUT)
app.put("/vouchers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật thành công", updatedVoucher });
  } catch (error) {
    console.error("🔥 Lỗi cập nhật voucher:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ✅ API DELETE VOUCHER
// app.delete("/vouchers/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "ID không hợp lệ" });
//     }

//     const result = await VoucherModel.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ message: "Voucher không tồn tại" });
//     }

//     res.status(200).json({ message: "Xóa thành công", deletedVoucher: result });
//   } catch (error) {
//     console.error("🔥 Lỗi xóa voucher:", error);
//     res.status(500).json({ message: "Lỗi server", error: error.message });
//   }
// });

// app.delete('/vouchers/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Kiểm tra ID có hợp lệ không
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "ID không hợp lệ" });
//     }

//     const deletedVoucher = await Voucher.findByIdAndDelete(id);

//     if (!deletedVoucher) {
//       return res.status(404).json({ message: 'Voucher không tồn tại' });
//     }

//     res.status(200).json({ message: 'Voucher đã được xóa thành công' });
//   } catch (error) {
//     console.error('Lỗi khi xóa voucher:', error);
//     res.status(500).json({ error: 'Lỗi server khi xóa voucher' });
//   }
// });

app.delete('/vouchers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    // ✅ Thử tìm và xóa voucher
    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return res.status(404).json({ error: "Voucher không tồn tại" });
    }

    res.status(200).json({ message: "Voucher đã được xóa thành công", deletedVoucher });
  } catch (error) {
    console.error("🔥 Lỗi khi xóa voucher:", error);
    res.status(500).json({ error: "Lỗi server khi xóa voucher", details: error.message });
  }
});
