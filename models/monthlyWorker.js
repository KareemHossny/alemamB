const mongoose = require("mongoose");

const MonthlyWorkerDataSchema = new mongoose.Schema(
  {
    workerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Worker", 
      required: true 
    },
    projectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    month: { type: Date, required: true },           // مثال: 2025-09-01
    extraHours: { type: Number, default: 0 },        // الساعات الإضافية
    overtimePay: { type: Number, default: 0 },       // الأجر الإضافي
    totalSalary: { type: Number, default: 0 },       // المرتب + الإضافي
  },
  { timestamps: true }
);

// قبل الحفظ نحسب الأجر الإضافي والإجمالي
MonthlyWorkerDataSchema.pre("save", async function (next) {
  const Worker = mongoose.model("Worker");
  const worker = await Worker.findById(this.workerId);

  if (worker) {
    this.overtimePay = this.extraHours * worker.hourlyRate;
    this.totalSalary = worker.baseSalary + this.overtimePay;
  }
  next();
});

module.exports = mongoose.model("MonthlyWorkerData", MonthlyWorkerDataSchema);
