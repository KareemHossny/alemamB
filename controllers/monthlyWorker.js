const MonthlyWorkerData = require("../models/monthlyWorker");
const Worker = require("../models/worker");

// إضافة بيانات شهرية لعامل
exports.addMonthlyData = async (req, res) => {
  try {
    const { workerId, projectId, month, extraHours } = req.body;

    if (!workerId || !projectId || !month) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // نحول الشهر لتاريخ أول يوم في الشهر
    const monthDate = new Date(`${month}-01`); // مثال: month = "2025-09"

    const monthlyData = await MonthlyWorkerData.create({
      workerId,
      projectId,
      month: monthDate,
      extraHours,
    });

    res.status(201).json({ success: true, monthlyData });
  } catch (error) {
    console.error("Error adding monthly data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// عرض كل بيانات عامل عبر الشهور
exports.getMonthlyDataByWorker = async (req, res) => {
    try {
      const data = await MonthlyWorkerData.find({ workerId: req.params.workerId }).populate("projectId");
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error fetching worker monthly data:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

// ✏️ تعديل بيانات شهرية لعامل
exports.updateMonthlyData = async (req, res) => {
  try {
    const { id } = req.params; // monthlyWorkerData ID
    const { month, extraHours } = req.body;

    // هجيب الداتا اللي هعدلها
    const monthlyData = await MonthlyWorkerData.findById(id);
    if (!monthlyData) {
      return res.status(404).json({ success: false, message: "البيانات الشهرية غير موجودة" });
    }

    // هجيب العامل عشان اعرف المرتب وسعر الساعة
    const worker = await Worker.findById(monthlyData.workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: "العامل غير موجود" });
    }

    // احسب القيم الجديدة بناءً على extraHours
    const overtimePay = extraHours * worker.hourlyRate;
    const totalSalary = worker.baseSalary + overtimePay;

    // اعمل تحديث فعلي
    monthlyData.month = month || monthlyData.month;
    monthlyData.extraHours = extraHours ?? monthlyData.extraHours;
    monthlyData.overtimePay = overtimePay;
    monthlyData.totalSalary = totalSalary;

    await monthlyData.save();

    res.json({ success: true, message: "تم التعديل بنجاح", data: monthlyData });
  } catch (err) {
    console.error("Error updating monthly worker data:", err);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};


// 🗑️ حذف بيانات شهرية لعامل
exports.deleteMonthlyData = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await MonthlyWorkerData.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "البيانات غير موجودة" });
    }

    res.json({ success: true, message: "تم الحذف بنجاح" });
  } catch (err) {
    console.error("Error deleting monthly worker data:", err);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};
