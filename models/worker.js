const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // اسم العامل
    baseSalary: { type: Number, required: true },  // المرتب الأساسي
    hourlyRate: { type: Number },                  // يتحسب أوتوماتيك
    projectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    }
  },
  { timestamps: true }
);

// عند إنشاء عامل جديد
WorkerSchema.pre("save", function (next) {
  this.hourlyRate = this.baseSalary / (26 * 8); // 26 يوم × 8 ساعات
  next();
});

// عند تحديث بيانات عامل
WorkerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.baseSalary) {
    update.hourlyRate = update.baseSalary / (26 * 8);
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model("Worker", WorkerSchema);
