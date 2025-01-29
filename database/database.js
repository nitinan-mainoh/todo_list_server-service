// เรียกใช้งาน Sequelize จากไฟล์ package.json
const Sequelize = require("sequelize");
// เรียกใช้งาน dotenv จากไฟล์ .env ที่สร้างไว้
// dotenv จะช่วยให้เราสามารถใช้งานตัวแปรในไฟล์ .env ได้
require("dotenv").config();

// สร้าง Instance ของ sequelize เพื่อทำงานกับ Database
const sequelize = new Sequelize(
  // กำหนดรายละเอียดต่างๆ
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// ทำการเชื่อมต่อกับ Database โดยทำงานร่วมกับไฟล์ models
sequelize
  .sync()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => {
    console.log(error);
  });

// ส่งออกไปเพื่อใช้งานกับ models
module.exports = sequelize;
