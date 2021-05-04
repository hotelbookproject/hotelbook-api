const express = require("express");
const router = express.Router();
const {validateAdminPassword} = require("../../models/admin");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const findAdmin = require("../../utils/findAdmin");

router.post("/", [auth, validate(validateAdminPassword)], async (req, res) => {
  const admin = await findAdmin(req.user["username"]);
  let validPassword = await bcrypt.compare(req.body.oldpassword, admin.password);
  if (!validPassword)
    return res
      .status(400)
      .send({property: "oldpassword", msg: "Old password is wrong"});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  admin.password = hashedPassword;
  await admin.save();
  const token = admin.generateAuthToken();
  res.send({token, msg: "Password changed successfully"});
});

module.exports = router;
 