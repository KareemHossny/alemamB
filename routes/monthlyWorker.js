const express = require("express");
const router = express.Router();
const UserAuth = require("../middleware/user");
const monthlyWorkerController = require("../controllers/monthlyWorker");
// إضافة بيانات شهرية
router.post("/", UserAuth, monthlyWorkerController.addMonthlyData); 

//عرض بيانات عامل
router.get("/:workerId", UserAuth, monthlyWorkerController.getMonthlyDataByWorker);

// تعديل بيانات شهرية لعامل
router.put("/:id", UserAuth, monthlyWorkerController.updateMonthlyData);

// حذف بيانات شهرية لعامل
router.delete("/:id", UserAuth, monthlyWorkerController.deleteMonthlyData);

module.exports = router;
