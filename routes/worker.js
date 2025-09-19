const express = require("express");
const router = express.Router();
const UserAuth = require("../middleware/user");
const workerController = require("../controllers/worker");

router.post("/", UserAuth, workerController.addWorker); // إضافة عامل
router.put("/:id", UserAuth, workerController.updateWorker); // تعديل بيانات عامل
router.delete("/:id", UserAuth, workerController.deleteWorker); // حذف عامل
router.get("/:projectId", UserAuth, workerController.getWorkersByProject); // عرض عمال المشروع

module.exports = router;
