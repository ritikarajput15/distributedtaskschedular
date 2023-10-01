const DEFAULT_TIME_ZONE = "Asia/Kolkata";
const USER = "User";
const TASK = "Task";
const PRIORITY_TASK = "PriorityTask";
const CRON_JOB_TIME = `0 0 */6 * * *`; // every 6 hours
// const CRON_JOB_TIME = `* * * * * *`; // every 6 hours
const TASK_STATUS = {
  INCOMPLETE: "incomplete",
  COMPLETED: "completed",
};
const PRIORITY_TYPE = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

module.exports = {
  DEFAULT_TIME_ZONE,
  USER,
  TASK_STATUS,
  PRIORITY_TYPE,
  TASK,
  PRIORITY_TASK,
  CRON_JOB_TIME
};
