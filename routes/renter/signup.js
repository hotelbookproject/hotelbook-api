const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {validateRenter, Renter} = require("../../models/renter");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const renterMiddleware = require("../../middleware/renter");
const Yup=require("yup")

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

router.put("/", [auth, renterMiddleware], async (req, res) => {
  const nameSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required("Name is required").label("Name"),
  });

  const usernameSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, "Invalid Username")
      .label("Username"),
  });

  let newUsername = req.body.username?.toLowerCase();
  let name = req.body.name;

  if (newUsername) {
    usernameSchema
      .validate({
        username: newUsername,
      })
      .then(async () => {
        let username = await Renter.findOne({username: newUsername});
        if (username)
          return res.status(400).send({property: "username", msg: "Username Already Taken"});
        await Renter.findByIdAndUpdate(req.user._id, {username: newUsername});
        res.send(await Renter.findById(req.user._id).select({name:1,email:1,username:1}));
      })
      .catch(error => {
        return res.status(400).send({property: "username", msg: error.errors.toString()});
      });
  }

  if (name) {
    nameSchema
      .validate({
        name,
      })
      .then(async () => {
        await Renter.findByIdAndUpdate(req.user._id, {name});
        res.send(await Renter.findById(req.user._id).select({name:1,email:1,username:1}));
      })
      .catch(error => {
        return res.status(400).send({property: "name", msg: error.errors.toString()});
      });
  }
  // let result=
  // console.log(result,"new")
  
});
module.exports = router;
