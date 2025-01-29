const User = require("./user_model");
const Categories = require("./categories_models");
const Tasks = require("./tasks_model");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");

// กำหนดความสัมพันธ์ระหว่าง Models

// กำหนดความสัมพันธ์ระหว่าง Model User และ Model Categories โดยใช้ FOREIGNKEYS
// User หนึ่งคนสามารถมี หลาย Categories (One-to-Many)
// Category แต่ละอันจะเป็นของ User หนึ่งคน (Many-to-One
User.hasMany(Categories, { FOREIGNKEYS: "user_id", as: "categories" });
Categories.belongsTo(User, { FOREIGNKEYS: "user_id", as: "user" });

// กำหนดความสัมพันธ์ระหว่าง Model User และ Model Tasks โดยใช้ FOREIGNKEYS
// User หนึ่งคนสามารถมี หลาย Tasks (One-to-Many)
// Task แต่ละอันจะเป็นของ User หนึ่งคน (Many-to-One)
User.hasMany(Tasks, { FOREIGNKEYS: "user_id", as: "tasks" });
Tasks.belongsTo(User, { FOREIGNKEYS: "user_id", as: "user" });

// กำหนดความสัมพันธ์ระหว่าง Model Categories และ Model Tasks โดยใช้ FOREIGNKEYS
// Category หนึ่งหมวดหมู่สามารถมี หลาย Tasks (One-to-Many)
// Task แต่ละอันจะเป็นของ Category หนึ่งหมวดหมู่ (Many-to-One)
Categories.hasMany(Tasks, { FOREIGNKEYS: "category_id", as: "tasks" });
Tasks.belongsTo(Categories, { FOREIGNKEYS: "category_id", as: "category" });
