const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const user_Route = require("./routes/user_route.js");
const categories_Route = require("./routes/categories_route.js");

// เรียกใช้งาน dotenv จากไฟล์ .env ที่สร้างไว้
require("dotenv").config();
// สร้าง Web Server
const app = express();

// สร้างตัวแปรเก็บ PORT Number เพื่อใช้กับการเชื่อมต่อ Server
// จะใช้งาน process.env ได้ต้อง require("dotenv").config(); ก่อน
// process.env.PORT คือ PORT Number ที่เรากําหนด จาก ไฟล์.env
const PORT = process.env.PORT || 6090;

app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", user_Route);
app.use("/categories", categories_Route);

// ทดสอบการเรียกใช้งาน Web Server (ทดสอบไว้สามารถปิดการใช้งานหรือลบทิ้งได้) --------------------------------------------
// การทดสอบสามารถเรียกใช้งานได้ที่ http://localhost:xxxx หรือ http://127.0.0.1:xxxx หรือ http://IP Address:xxxx
// req คือ request (การร้องขอ) ส่งมาจาก client เช่น http://localhost:3000
// res คือ response (การตอบกลับ) ส่งไปยัง client โดยกำหนดให้เป็น Hello World
app.get("/", (req, res) => {
  res.send("Test... Server is running on port " + PORT);
});
//--------------------------------------------------------------------------------------------------------------

// กำหนดช่องทางในการเชื่อมต่อ
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
