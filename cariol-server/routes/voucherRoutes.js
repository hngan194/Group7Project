const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Voucher = require("../models/Voucher");

// Lấy danh sách voucher
router.get("/", async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Thêm mới voucher
router.post("/", async (req, res) => {
  console.log("Received POST /vouchers", req.body);
  const { code, discount, minOrderValue, startDate, endDate } = req.body;

  if (!code || !discount || !minOrderValue || !startDate || !endDate) {
      return res.status(400).json({ error: "Thiếu thông tin voucher" });
  }

  try {
      const newVoucher = new Voucher({ code, discount, minOrderValue, startDate, endDate });
      await newVoucher.save();
      res.status(201).json(newVoucher);
  } catch (error) {
      console.error("Error adding voucher:", error);
      res.status(500).json({ error: "Không thể thêm voucher" });
  }
});

router.delete('/vouchers/:id', async (req, res) => {
  try {
      const result = await Voucher.findByIdAndDelete(req.params.id);
      if (!result) {
          return res.status(404).json({ message: 'Voucher không tồn tại' });
      }
      res.json({ message: 'Voucher đã được xóa' });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
  }
});

// ✅ API CẬP NHẬT VOUCHER
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật thành công", updatedVoucher });
  } catch (error) {
    console.error("🔥 Lỗi cập nhật voucher:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
