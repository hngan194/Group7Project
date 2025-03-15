const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  minOrderValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model("Voucher", voucherSchema);
