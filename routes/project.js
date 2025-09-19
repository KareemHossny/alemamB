const express = require("express");
const router = express.Router();
const UserAuth = require("../middleware/user"); 
const projectController = require("../controllers/project");

// كل الراوت محمية بالـ JWT
router.post("/transaction", UserAuth, projectController.addTransaction);//اضافه مصاريف ماتريال فلوس العميل
router.post("/", UserAuth, projectController.createProject);     // إضافة مشروع جديد
router.get("/", UserAuth, projectController.getProjects);        // عرض كل المشاريع
router.get("/:projectId/:month", UserAuth, projectController.getProjectMonthlyData); // عرض البيانات الشهرية لمشروع
router.get("/:id", UserAuth, projectController.getProjectById);  // عرض مشروع واحد
router.put("/monthly/:id", UserAuth, projectController.updateMonthlyProjectData);// تعديل معاملة شهرية (مصاريف / ماتيريال / دفعة عميل)
router.put("/:id", UserAuth, projectController.updateProject);   // تعديل مشروع
router.delete("/:id", UserAuth, projectController.deleteProject); // حذف مشروع
router.delete("/monthly/:id", UserAuth, projectController.deleteMonthlyProjectData);// حذف معاملة شهرية
module.exports = router;
