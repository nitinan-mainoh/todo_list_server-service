const Task = require("../models/tasks_model");

// ฟังชั่นสำหรับสร้าง Task ใหม่
const createTask = async (req, res) => {
  try {
    const { user_id, category_id, title, description } = req.body;
    const newTask = await Task.create({
      user_id,
      category_id,
      title,
      description,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ฟังก์ชั่นดึงข้อมูล tasks จาก database เงื่อนไข เป็น user_id
const getTasksByUserId = async (req, res) => {
  try {
    const result = await Task.findAll({
      where: { user_id: req.params.user_id },
    });
    res.status(200).json({ message: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks" + error.message });
  }
};

// ฟังก์ชั่นดึงข้อมูล Task จาก database เงื่อนไขเป็น category_id
const getTasksByCategoryId = async (req, res) => {
  try {
    const result = await Task.findAll({
      where: { category_id: req.params.category_id },
    });
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks" + error.message });
  }
};

// ฟังก์ชั่น Update Task ของ User เงื่อนไขเป็น task_id
const updateTask = async (req, res) => {
  try {
    const result = await Task.update(req.body, {
      where: { task_id: req.params.task_id },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" + error.message });
  }
};

// ฟังก์ชั่น Delete Task ของ User เงื่อนไขเป็น task_id
const deleteTask = async (req, res) => {
  try {
    const result = await Task.destroy({
      where: { task_id: req.params.task_id },
    });
    res
      .status(200)
      .json({ message: "Task" + result + " deleted successfully" });
  } catch (error) {
    res.stutus(500).json({ message: "Failed to delete task" + error.message });
  }
};

// ฟังก์ชั่นเปลี่ยนสถานะ Task เป็น Completed/Incomplete เงื่อนไขเป็น task_id
const toggleTaskStatus = async (req, res) => {
  try {
    const result = await Task.update(req.body, {
      where: { task_id: req.params.task_id },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle task status" });
  }
};

module.exports = {
  createTask,
  getTasksByUserId,
  getTasksByCategoryId,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
