const Sequelize = require("sequelize"); // เรียกใช้งาน Sequelize จากไฟล์ package.json
const sequelize = require("./../database/database.js"); // เรียกใช้งานไฟล์ database.js

// สร้าง Model  ตามชื่อตารางใน Database แต่ให้ขึ้นต้นด้วยตัวใหญ่
const User = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      field: "user_id",
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      field: "username",
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: "email",
    },
    password_hash: {
      type: Sequelize.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
  },
  {
    sequelize,
    tableName: "users", // ใช้ชื่อเหมือนกับ table บนฐานข้อมูล
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
