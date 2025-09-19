const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // اسم المشروع
    location: { type: String, required: true },      // مكان المشروع
    engineer: { type: String, required: true },      // اسم المهندس
    client: {
      name: { type: String, required: true },        // اسم الاستشاري
      phone: { type: String, required: true }        // رقم الاستشاري
    },
    description: { type: String, required: true },   // وصف مختصر
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
