const express = require("express");
const router = express.Router();
const {validateGuestPassword} = require("../../models/guest");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const findGuest = require("../../utils/findGuest");
const guestMiddleware = require("../../middleware/guest");

router.post("/", [auth, guestMiddleware, validate(validateGuestPassword)], async (req, res) => {
  const guest = await findGuest(req.user["username"]);
  let validPassword = await bcrypt.compare(req.body.oldpassword, user.password);
  if (!validPassword)
    return res.status(400).send({property: "oldpassword", msg: "Old password is wrong"});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  guest.password = hashedPassword;
  await guest.save();
  const token = guest.generateAuthToken();
  res.send({token, msg: "Password changed successfully"});
});

module.exports = router;
