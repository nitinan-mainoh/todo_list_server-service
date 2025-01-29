const User = require("./../models/user_model.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jsonwebtoken = require("jsonwebtoken");

// เรียกใช้งาน dotenv จากไฟล์ .env ที่สร้างไว้
// dotenv จะช่วยให้เราสามารถใช้งานตัวแปรในไฟล์ .env ได้
require("dotenv").config();

// ฟังชั่นสำหรับสร้าง User เข้าใช้งาน
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ตรวจสอบว่าผู้ใช้งานใส่ข้อมูลครบถ้วนหรือไม่
    // if (!username || !email || !password) {
    //   return res.status(400).json({ message: "Please fill up the infomation completely" });
    // }
    if (!username) {
      return res.status(400).json({ message: "Please enter your Username" });
    } else if (!email) {
      return res.status(400).json({ message: "Please enter your Email" });
    } else if (!password) {
      return res.status(400).json({ message: "Please enter your Password" });
    }

    // ตรวจสอบว่า username และ email มีอยู่ในฐานข้อมูลแล้วหรือไม่
    const existingUsername = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });
    if (existingUsername) {
      return res.status(400).json({ message: "username already exists" });
    } else if (existingEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    // ทำการ Encrypt รหัสผ่านโดยใช้ bcrypt ก่อนเก็บเข้าฐานข้อมูล
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // สร้าง User ใหม่โดยใช้ข้อมูลที่ร้องขอมา
    const result = await User.create({
      username,
      email,
      password_hash: hashedPassword, // ใช้ password_hash ที่เข้าหรัสแล้วบันทึกลงในฐานข้อมูล
    });

    res.status(201).json({
      message: "User created successfully",
      username: result.username,
      email: result.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" + error });
  }
};

// ฟังชั่นสำหรับตรวจสอบการเข้าสู่ระบบของ User

const loginUser = async (req, res) => {
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // ตรวจสอบรหัสผ่าน
    const passwordValid = await bcrypt.compare(
      req.body.password,
      result.password_hash
    );
    if (!passwordValid) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // สร้าง Refresh Token
    const refreshToken = jsonwebtoken.sign(
      {
        user_id: result.user_id,
        username: result.username,
        email: result.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // ไม่สามารถเข้าถึงจาก JavaScript ได้
      secure: true, // ใช้ HTTPS เท่านั้น
      sameSite: "Strict", // ใช้ Strict เท่านั้น
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });
    // สร้าง Access Token
    const accessToken = jsonwebtoken.sign(
      // ข้อมูลที่ต้องการเก็บใน Access Token
      {
        user_id: result.user_id,
        username: result.username,
        email: result.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // ส่ง Refresh Token ใน HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // ไม่สามารถเข้าถึงจาก JavaScript ได้
      secure: true, // ใช้ HTTPS เท่านั้น
      sameSite: "Strict", // Cookie จะถูกส่งเมื่อมาจากต้นทางเดียวกัน
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    // ส่งข้อมูลกลับไป
    res.status(200).json({
      message: "User logged in successfully",
      username: result.username,
      email: result.email,
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to login user", error: error.message });
  }
};

// ฟังก์ชั่นตรวจสอบ Refresh Token และสร้าง Access Token ใหม่
const verifyRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // ดึง Refresh Token จาก HttpOnly Cookie

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is missing" });
  }
  
  try {
    // ตรวจสอบ Refresh Token ด้วย secret key
    const decoded = jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // สร้าง Access Token ใหม่
    const accessToken = jsonwebtoken.sign(
      {
        user_id: decoded.user_id,
        username: decoded.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Access Token อายุ 15 นาที
    );

    // ส่ง Access Token ใหม่กลับไป
    res.status(200).json({ accessToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh Token expired" });
    }
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

// ฟังก์ชั่น Update Password ของ User
const updatePassword = async (req, res) => {
  // ตรวจสอบว่าผู้ใช้งานใส่ข้อมูลครบถ้วนหรือไม่
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Please fill up the infomation completely" });
  }
  try {
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ Email
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // ตรวจสอบว่าผู้ใช้มีข้อมูลในฐานข้อมูลหรือไม่
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    // ทำการ Encrypt รหัสผ่านโดยใช้ bcrypt ก่อนเก็บเข้าฐานข้อมูล
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // อัปเดตรหัสผ่านในฐานข้อมูล
    await User.update(
      {
        password_hash: hashedPassword, // ใช้ password_hash ที่เข้าหรัสแล้วบันทึกลงในฐานข้อมูล
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password" + error });
  }
};

// ฟังก์ชั่น Reset Password ของ User
const resetPassword = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ Email
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // ตรวจสอบว่าผู้ใช้มีข้อมูลในฐานข้อมูลหรือไม่
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // สร้างรหัสผ่านใหม่และส่งให้ User ทาง Email
    const newPassword = Math.random().toString(36).slice(2, 10); // สร้างรหัสผ่านใหม่โดยใช้ Math.random() ความยาว 8 ตัวอักษร
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // บันทึกรหัสผ่านใหม่บนฐานข้อมูล
    await User.update(
      { password_hash: hashedPassword },
      { where: { email: req.body.email } }
    );

    // ตั้งค่า Nodemailler SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // ใช้ Gmail SMTP Server
      auth: {
        user: "firstindex66@gmail.com", // ใส่อีเมลผู้ส่ง
        pass: "memg asfk raex vwpa", // รหัสผ่านหรือ App Password ของอีเมล
      },
    });
    // ตั้งค่ารูปแบบการส่งข้อมูล Email
    const mailOption = {
      from: "firstindex66@gmail.com",
      to: req.body.email,
      subject: "Reset password request",
      html: `
        <p>Hello<br><strong>${result.username}</strong></p>
        <p>We have successfully reset your password</p>
        <p>you can login with this password</p>
        <p style="color: red ; font-size: 20px"><strong>${newPassword}</strong></p>
        <p>Bast regards<br>First Index</p>   
      `,
    };
    // ส่งอีเมล
    await transporter.sendMail(mailOption);
    res.status(200).json({ message: "Password update successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password" + error });
  }
};

module.exports = {
  createUser,
  loginUser,
  updatePassword,
  resetPassword,
};
