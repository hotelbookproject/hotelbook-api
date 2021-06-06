const Yup = require("joi");

module.exports = function () {
  Yup.objectId = require("joi-objectid")(Yup);
};
