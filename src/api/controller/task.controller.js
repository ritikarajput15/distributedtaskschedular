const mongoose = require("mongoose");
const { Task } = require("../model/task.model");
const {
  handleBadRequest,
  handleRecordsNotFound,
  handleInternalServerError,
} = require("../../utils/api.utils");
const _ = require("lodash");
const { isEmpty, pick } = require("lodash");
const { TASK_STATUS } = require("../../utils/constants");

// return the task status and task status
const findOne = async (req, res) => {
  try {
    const id = req.params.taskId;
    let taskDoc = await Task.findOne({ _id: id })
      .select({ _id: 1, taskStatus: 1, taskResult: 1 })
      .lean({});
    taskDoc = { ...taskDoc, taskResult: JSON.parse(taskDoc.taskResult) };
    if (isEmpty(taskDoc)) {
      return handleRecordsNotFound(res);
    }
    return res.status(200).json(taskDoc);
  } catch (error) {
    return handleInternalServerError(res, error.message);
  }
};

// add task
const create = async (req, res) => {
 try{
    var body = getBody(req);
    if (isEmpty(body)) {
      handleBadRequest(res);
      return;
    }
    const existingTaskDoc = await Task.findOne({
      taskInformation: body.taskInformation,
    })
      .select({})
      .lean({});
    if (isEmpty(existingTaskDoc) === false) {
      res.status(409).json({
        error: "Task already exists",
      });
      return;
    }
    body = {
      ...body,
      _id: new mongoose.Types.ObjectId(),
      taskStatus: TASK_STATUS.INCOMPLETE,
      taskResult: "",
    };
    let taskDoc = await Task.create(body);
    return res.status(200).json(taskDoc);

 }catch(error){
    return handleInternalServerError(res,error.message);
 }
};

var getBody = (req) => {
  var body = pick(req.body, ["taskInformation", "priority", "expiryDate"]);
  return body;
};
module.exports = {
  findOne,
  create,
};
