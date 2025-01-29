const Sequelize = require("sequelize"); // เรียกใช้งาน Sequelize จากไฟล์ package.json
const sequelize = require("../database/database");

//สร้าง Model ตามชื่อตารางใน Database แต่ให้ขึ้นต้นด้วยตัวใหญ่
const Categories = sequelize.define(
  "categories",
  {
    category_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      field: "category_id",
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      field: "name",
    },
  },
  {
    tableName: "categories",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Categories;
