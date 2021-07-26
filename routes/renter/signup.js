const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {validateRenter, Renter} = require("../../models/renter");
const validate = require("../../middleware/validate");

router.post("/", [validate(validateRenter)], async (req, res) => {
  let email = await Renter.findOne({email: req.body.email.toLowerCase()});
  if (email) return res.status(400).send({property: "email", msg: "Email Already Registered"});

  let username = await Renter.findOne({username: req.body.username.toLowerCase()});
  if (username) return res.status(400).send({property: "username", msg: "Username Already Taken"});

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send({property: "confirmPassword", msg: "Passwords doesn't Match'"});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPassword;
  req.body.email = req.body.email.toLowerCase();
  req.body.username = req.body.username.toLowerCase();

  let renterData = _.pick(req.body, ["name", "email", "username", "password"]);

  const renter = new Renter(renterData);
  await renter.save();
  const token=renter.generateAuthToken()

  res.send(token);
});

module.exports = router;
