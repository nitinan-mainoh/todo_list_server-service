const tasks_controller = require("../controller/tasks_controller");
const express = require("express");
const router = express.Router();

router.post("/create-task", tasks_controller.createTask);
router.get(
  "/get-all-tasks-by-user-id/:user_id",
  tasks_controller.getTasksByUserId
);
router.get(
  "/get-all-tasks-by-category-id/:category_id",
  tasks_controller.getTasksByCategoryId
);
router.put("/update-task/:task_id", tasks_controller.updateTask);
router.delete("/delete-task/:task_id", tasks_controller.deleteTask);
router.put("/toggle-task-status/:task_id", tasks_controller.toggleTaskStatus);

module.exports = router;
