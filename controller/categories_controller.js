const Categories = require("../models/categories_models");
const Tasks = require("../models/tasks_model");

// ฟังก์ชั่นสําหรับสร้างหมวดหมู่ใหม่
const createCategory = async (req, res) => {
  try {
    // const { user_id, name } = req.body;
    // const result = await Categories.create({ user_id, name });
    // res.status(201).json(result);
    const result = await Categories.create(req.body);
    res
      .status(201)
      .json({ message: "Category created successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// ฟังก์ชั่นแก้ไขหมวดหมู่
const updateCategory = async (req, res) => {
  try {
    const result = await Categories.update(req.body, {
      where: { category_id: req.params.category_id },
    });
    res
      .status(200)
      .json({ message: "Category updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

// ฟังก์ชั่นลบหมวดหมู่
const deleteCategory = async (req, res) => {
  try {
    const result = await Categories.destroy({         
      where: { category_id: req.params.category_id },
    });
    res
      .status(200)
      .json({ message: "Category deleted successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// ฟังก์ชั่นดึงข้อมูลหมวดหมู่ทั้งหมดของ User
const getAllCategoriesByUserId = async (req, res) => {
  try {
    const result = await Categories.findAll({
      where: {
        user_id: req.params.user_id,
      },
    });
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!result) {
      return res.status(404).json({ error: "No categories found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ฟังก์ชั่นย้าย task ไปยังหมวดหมู่อื่น
const moveTaskToCategory = async (req, res) => {
  try {
    const result = await Tasks.update(req.body, {
      where: {
        task_id: req.params.task_id,
      },
    });
    res.status(200).json({
      message:
        "Task moved to category from task" +
        req.params.task_id +
        " to " +
        req.body.category_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to move task to category" });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesByUserId,
  moveTaskToCategory,
};
