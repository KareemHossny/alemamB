const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String }, // اختياري: سبب المصروف أو الدفعة
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const MonthlyProjectDataSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    month: { type: Date, required: true }, // مثال: "2025-09-01"

    // بدل رقم واحد -> مصفوفة عمليات
    expenses: [TransactionSchema],       // مصاريف تشغيل
    materialsCost: [TransactionSchema],  // مواد
    clientPayment: [TransactionSchema],  // دفعات عميل
  },
  { timestamps: true }
);

MonthlyProjectDataSchema.index({ projectId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyProjectData", MonthlyProjectDataSchema);
