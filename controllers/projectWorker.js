const Worker = require("../models/worker");
const MonthlyWorkerData = require("../models/monthlyWorker");


// عرض عمال المشروع مع بياناتهم الشهرية + إجمالي التكلفة
exports.getProjectWorkersWithMonthlyData = async (req, res) => {
  try {
    const { projectId, month } = req.params;

    // نحول الشهر لتاريخ أول يوم في الشهر
    const monthDate = new Date(`${month}-01`);

    const workers = await Worker.find({ projectId });
    const monthlyData = await MonthlyWorkerData.find({ projectId, month: monthDate });

    const workersWithData = workers.map(worker => {
      const workerMonthly = monthlyData.find(
        d => d.workerId.toString() === worker._id.toString()
      );

      return {
        workerId: worker._id,
        name: worker.name,
        baseSalary: worker.baseSalary,
        hourlyRate: worker.hourlyRate,
        month: monthDate,
        extraHours: workerMonthly ? workerMonthly.extraHours : 0,
        overtimePay: workerMonthly ? workerMonthly.overtimePay : 0,
        totalSalary: workerMonthly ? workerMonthly.totalSalary : worker.baseSalary
      };
    });

    // إجمالي الرواتب
    const totalPayroll = workersWithData.reduce((acc, worker) => acc + worker.totalSalary, 0);

    // إجمالي مصاريف المشروع للشهر
    const totalExpenses = monthlyData.reduce((acc, d) => acc + (d.projectExpenses || 0), 0);

    // التكلفة الكلية
    const totalProjectCost = totalPayroll + totalExpenses;

    res.json({ 
      success: true, 
      workers: workersWithData, 
      totalPayroll, 
      totalExpenses, 
      totalProjectCost 
    });
  } catch (error) {
    console.error("Error fetching workers with monthly data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
