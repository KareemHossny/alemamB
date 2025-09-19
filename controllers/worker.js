const Worker = require("../models/worker");

// إضافة عامل جديد
exports.addWorker = async (req, res) => {
  try {
    const { name, baseSalary, projectId } = req.body;
    if (!name || !baseSalary || !projectId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const worker = await Worker.create({ name, baseSalary, projectId });
    res.status(201).json({ success: true, worker });
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// تحديث بيانات عامل (الـ hourlyRate هيتحسب أوتوماتيك)
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.json({ success: true, worker });
  } catch (error) {
    console.error("Error updating worker:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// حذف عامل
exports.deleteWorker = async (req, res) => {
    try {
      const worker = await Worker.findByIdAndDelete(req.params.id);
      if (!worker) {
        return res.status(404).json({ success: false, message: "Worker not found" });
      }
      res.json({ success: true, message: "Worker deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

// عرض عمال المشروع
exports.getWorkersByProject = async (req, res) => {
  try {
    const workers = await Worker.find({ projectId: req.params.projectId }).populate("projectId");
    res.json({ success: true, workers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
