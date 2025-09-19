const Project = require("../models/project");
const MonthlyProjectData = require("../models/monthlyProject");
const MonthlyWorker = require("../models/monthlyWorker");
const Worker = require("../models/worker");

// إنشاء مشروع جديد
exports.createProject = async (req, res) => {
  try {
    const { name, location, engineer, client, description } = req.body;

    if (!name || !location || !engineer || !client?.name || !client?.phone || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });MonthlyProjectData
    }

    const project = await Project.create({
      name,
      location,
      engineer,
      client,
      description,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// عرض كل المشاريع
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// عرض مشروع واحد
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// تحديث مشروع
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true,message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// حذف مشروع
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // احذف العمال
    await Worker.deleteMany({ projectId: id });

    // احذف بيانات العمال الشهرية
    await MonthlyWorker.deleteMany({ projectId: id });

    // احذف بيانات المشروع الشهرية
    await MonthlyProjectData.deleteMany({ projectId: id });

    // احذف المشروع نفسه
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ success: false, message: "المشروع غير موجود" });
    }

    res.json({ success: true, message: "تم حذف المشروع وكل بياناته بنجاح" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء الحذف" });
  }
};



// إضافة عملية جديدة (مصاريف/ماتيريال/دفعة عميل)
exports.addTransaction = async (req, res) => {
  try {
    const { projectId, month, type, amount, description } = req.body;

    if (!projectId || !month || !type || !amount) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (!["expenses", "materialsCost", "clientPayment"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid transaction type" });
    }

    // نلاقي أو ننشئ MonthlyData للشهر
    let monthlyData = await MonthlyProjectData.findOne({ projectId, month });
    if (!monthlyData) {
      monthlyData = new MonthlyProjectData({ projectId, month });
    }

    // نضيف العملية
    monthlyData[type].push({ amount, description });
    await monthlyData.save();

    res.status(201).json({ success: true, monthlyData });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// عرض البيانات الشهرية للمشروع (مع المجموع)
exports.getProjectMonthlyData = async (req, res) => {
  try {
    const { projectId, month } = req.params;
    const monthlyData = await MonthlyProjectData.findOne({ projectId, month });

    if (!monthlyData) {
      return res.json({ success: true, data: null });
    }

    // نحسب الإجمالي لكل نوع
    const totals = {
      expenses: monthlyData.expenses.reduce((sum, t) => sum + t.amount, 0),
      materialsCost: monthlyData.materialsCost.reduce((sum, t) => sum + t.amount, 0),
      clientPayment: monthlyData.clientPayment.reduce((sum, t) => sum + t.amount, 0),
    };

    res.json({ success: true, monthlyData, totals });
  } catch (error) {
    console.error("Error fetching project monthly data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✏️ تعديل معاملة شهرية (مصاريف - ماتيريال - دفعة عميل)
exports.updateMonthlyProjectData = async (req, res) => {
  try {
    const { id } = req.params; // transaction ID
    const { amount, description, date } = req.body;

    // نحاول تحديث في كل مصفوفة (expenses, materialsCost, clientPayment)
    let updated = await MonthlyProjectData.findOneAndUpdate(
      { "expenses._id": id },
      {
        $set: {
          "expenses.$.amount": amount,
          "expenses.$.description": description,
          "expenses.$.date": date,
        },
      },
      { new: true }
    );

    if (!updated) {
      updated = await MonthlyProjectData.findOneAndUpdate(
        { "materialsCost._id": id },
        {
          $set: {
            "materialsCost.$.amount": amount,
            "materialsCost.$.description": description,
            "materialsCost.$.date": date,
          },
        },
        { new: true }
      );
    }

    if (!updated) {
      updated = await MonthlyProjectData.findOneAndUpdate(
        { "clientPayment._id": id },
        {
          $set: {
            "clientPayment.$.amount": amount,
            "clientPayment.$.description": description,
            "clientPayment.$.date": date,
          },
        },
        { new: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "المعاملة غير موجودة أو لا يوجد _id للمعاملة" });
    }else{
      res.json({ success: true, message: "تم تعديل المعاملة بنجاح", data: updated });

    }
  } catch (err) {
    console.error("Error updating monthly project data:", err);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};



// 🗑️ حذف معاملة شهرية (مصاريف - ماتيريال - دفعة عميل)
exports.deleteMonthlyProjectData = async (req, res) => {
  try {
    const { id } = req.params; // transaction ID

    // Since TransactionSchema uses _id (default by Mongoose), and each array (expenses, materialsCost, clientPayment)
    // is an array of TransactionSchema, this controller works as expected with the model in file_context_0.

    // The code below will search for a MonthlyProjectData document that contains a transaction with the given id
    // in any of the three arrays, and remove it from the array.

    let updated = await MonthlyProjectData.findOneAndUpdate(
      { "expenses._id": id },
      { $pull: { expenses: { _id: id } } },
      { new: true }
    );

    if (!updated) {
      updated = await MonthlyProjectData.findOneAndUpdate(
        { "materialsCost._id": id },
        { $pull: { materialsCost: { _id: id } } },
        { new: true }
      );
    }

    if (!updated) {
      updated = await MonthlyProjectData.findOneAndUpdate(
        { "clientPayment._id": id },
        { $pull: { clientPayment: { _id: id } } },
        { new: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "المعاملة غير موجودة" });
    }

    res.json({ success: true, message: "تم حذف المعاملة بنجاح", data: updated });
  } catch (err) {
    console.error("Error deleting monthly project data:", err);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};

