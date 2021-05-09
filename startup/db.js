const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/hotelbooktest", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify:false
    })
    .then(() => console.log("connected to database"))
    .catch(err => console.log(err));
};
