const express = require("express");
const router = express.Router();
const UserAuth = require("../middleware/user"); 
const projectWorkerController = require("../controllers/projectWorker");

// عرض كل العمال مع بياناتهم الشهرية
router.get("/:projectId/:month", UserAuth, projectWorkerController.getProjectWorkersWithMonthlyData);

module.exports = router;
