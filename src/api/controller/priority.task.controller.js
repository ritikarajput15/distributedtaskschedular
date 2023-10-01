const { USER_ONE, USER_TWO, WORKER_NODE_URL } = process.env;
const mongoose = require("mongoose");
const { PriorityTask } = require("../model/priority.task.model");
const {
  handleBadRequest,
  handleRecordsNotFound,
  handleInternalServerError,
} = require("../../utils/api.utils");
const _ = require("lodash");
const { isEmpty, pick } = require("lodash");
const { Task } = require("../model/task.model");
const { TASK_STATUS, CRON_JOB_TIME } = require("../../utils/constants");
const cron = require("node-cron");
const axios = require("axios");

const findAll = async (req, res) => {
  try {
    const data = await PriorityTask.find({});
    res.status(200).json(data);
    return;
  } catch (error) {
    return handleInternalServerError(res, error.message);
  }
};

const create = async (req, res) => {
  try {
    var body = getBody(req);
    if (isEmpty(body)) {
      handleBadRequest(res);
      return;
    }
    const priorityTaskList = await Task.find({
      priority: body.priority,
      expiryDate: { $lte: body.expiryDate },
      taskStatus: TASK_STATUS.INCOMPLETE,
    })
      .sort({ _id: -1 })
      .limit(body.maxCount)
      .select({ _id: 1 })
      .lean({});
    if (isEmpty(priorityTaskList)) {
      return handleRecordsNotFound(res);
    }
    const existingPriorityTaskList = await PriorityTask.findOne({})
      .select({ _id: 1 })
      .lean({});
    if (isEmpty(existingPriorityTaskList) === false) {
      await PriorityTask.findOneAndUpdate(
        {
          _id: existingPriorityTaskList._id,
        },
        {
          taskIds: priorityTaskList,
        }
      );
    } else {
      await PriorityTask.create({
        _id: new mongoose.Types.ObjectId(),
        taskIds: priorityTaskList,
      });
    }
    return res.status(200).json({
      message: "Task added to priority queue",
      priorityTaskList,
    });
  } catch (error) {
    return handleInternalServerError(res, error.message);
  }
};

// helping function
var getBody = (req) => {
  var body = pick(req.body, ["maxCount", "priority", "expiryDate"]);
  return body;
};

// cron job to schedule task to execute after every 6 hours by worker nodes
cron.schedule(CRON_JOB_TIME, async (req, res) => {
  try {
    const priorityTaskDoc = await PriorityTask.find({})
      .select({ taskIds: 1 })
      .lean({});
    if (priorityTaskDoc[0].taskIds.length >0) {
      await axios.post(
        WORKER_NODE_URL,
        {
          priorityTaskId: priorityTaskDoc[0]._id,
          taskIds: priorityTaskDoc[0].taskIds,
        },
        {
          headers: {
            user_one: USER_ONE,
            user_two: USER_TWO,
          },
        }
      );
    }else{
      console.log("no task to execute")
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  findAll,
  create,
};
