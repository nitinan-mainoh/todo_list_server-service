const categories_controller = require("../controller/categories_controller");
const express = require("express");
const router = express.Router();

router.post("/create-category", categories_controller.createCategory);
router.put("/update-category/:id", categories_controller.updateCategory);
router.delete("/delete-category/:id", categories_controller.deleteCategory);
router.get("/get-all-categories-by-user-id", categories_controller.getAllCategoriesByUserId);
router.post("/move-task-to-category", categories_controller.moveTaskToCategory);

module.exports = router;
