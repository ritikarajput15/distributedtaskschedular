const { userRouter } = require("./../config/user.routes");
const { taskRouter } = require("./../config/task.routes");
const { PriorityTaskRouter } = require("./../config/priority.task.routes");

const initAPIs = (app) => {
    app.use("/users", userRouter);
    app.use("/tasks", taskRouter);
    app.use("/prioritytasks", PriorityTaskRouter);
}

module.exports = { initAPIs };