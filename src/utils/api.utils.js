const { ObjectID } = require("mongodb");
const _ = require("lodash");
const {
    DATE_TIME_PATTERN,
  } = require("../utils/constants");
const moment = require("moment-timezone");
const handleInternalServerError = (res, error = "Internal Server Error") => {
  res.status(500).json({
    error,
  });
  return;
};
const handleBadRequest = (res, error = "Bad Request") => {
  res.status(400).json({
    error,
  });
  return;
};
const handleRecordAlreadyExist = (res, error = "Conflict") => {
  res.status(409).json({
    error,
  });
  return;
};

const handleEntryNotFound = (res) => {
  res.status(404).json({
    error: "No Record Found",
  });
  return;
};

const handleRecordsNotFound = (res) => {
  res.status(204).json({
    list: [],
    message: "No Records Found",
  });
  return;
};

const onModelFetchSuccess = (res, doc) => {
  return res.status(200).json(doc);
};

const findModel = (model, res) => {
  model
    .find()
    .then((doc) => {
      if (doc.length == 0) {
        handleRecordsNotFound(res);
        return;
      } else {
        onModelFetchSuccess(res, doc);
        return;
      }
    })
    .catch((err) => {
      handleBadRequest(res, err);
      return;
    });
};

const findOneModel = (model, id, res) => {
  model
    .findById(id)
    .then((doc) => {
      if (doc == null) {
        handleEntryNotFound(res);
        return;
      } else {
        onModelFetchSuccess(res, doc);
      }
    })
    .catch((err) => {
      handleBadRequest(res, err);
    });
};

const deleteModel = (model, id, res) => {
  if (!ObjectID.isValid(id)) {
    handleBadRequest(res);
    return;
  }
  model
    .findByIdAndDelete(id)
    .then((doc) => {
      if (!doc) {
        handleEntryNotFound(res);
      } else {
        onModelFetchSuccess(res, doc);
      }
    })
    .catch((err) => {
      handleBadRequest(res, err);
      return;
    });
};

const updateModel = (model, id, body, res) => {
  if (!ObjectID.isValid(id)) {
    handleBadRequest(res);
    return;
  }
  if (_.isEmpty(body)) {
    handleBadRequest(res);
    return;
  }

  model
    .findOneAndUpdate({ _id: id }, body, { new: true })
    .then((doc) => {
      if (!doc) {
        handleEntryNotFound(res);
      } else {
        onModelFetchSuccess(res, doc);
      }
    })
    .catch((err) => {
      handleExceptions(err, res);
      return;
    });
};
const saveModel = (model, res) => {
  model
    .save()
    .then((doc) => {
      onModelFetchSuccess(res, doc);
      return;
    })
    .catch((err) => {
      handleBadRequest(res, err);
      return;
    });
};
const formatDate = (date) => {
  return moment(date, DATE_TIME_PATTERN).valueOf();
};

module.exports = {
  handleInternalServerError,
  handleBadRequest,
  onModelFetchSuccess,
  findModel,
  findOneModel,
  deleteModel,
  updateModel,
  saveModel,
  handleEntryNotFound,
  handleRecordsNotFound,
  handleRecordAlreadyExist,
  formatDate,
};
