const Sequelize = require("sequelize"); // เรียกใช้งาน Sequelize จากไฟล์ package.json
const sequelize = require("../database/database"); // เรียกใช้งานไฟล์ database.js

// สร้าง Model  ตามชื่อตารางใน Database แต่ให้ขึ้นต้นด้วยตัวใหญ่
const Tasks = sequelize.define(
  "tasks",
  {
    task_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "task_id",
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "category_id",
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: "title",
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: " ", // กําหนดค่าเริ่มต้นเป็นค่าว่าง
      field: "description",
    },
    is_completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_completed",
    },
  },
  {
    sequelize,
    tableName: "tasks",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Tasks;
