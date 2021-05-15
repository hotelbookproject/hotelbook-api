const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const findAdmin = require("../../utils/findAdmin");
const validate = require("../../middleware/validate");
const {validateAdminPassword} = require("../../models/admin");
const mailService = require("../../services/mailService");
const {encrypt, decrypt} = require("../../utils/encryption");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let admin = await findAdmin(userId);
  if (!admin)
    return res.status(400).send({
      property: "userId",
      msg: "There is no admin with given email id or username",
    });

  let resetToken = admin.generateResetToken();
  let encryptedResetToken = encrypt(resetToken);
  admin.resettoken = encryptedResetToken;
  await admin.save();
  mailService(admin["email"], resetToken, admin?.name);
  console.log(resetToken);
  res.send("Link Sent Successfully");
});

router.put("/:token", validate(validateAdminPassword), async (req, res) => {
  let token = req.params.token;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_CHANGEPASSWORD_PRIVATE_KEY);
  } catch (ex) {
    return res.status(400).send("This link is invalid.");
  }

  let admin = await findAdmin(decoded.email);
  if (!admin) return res.status(400).send("Something went wrong. Try again");

  if (!admin.resettoken) return res.status(400).send("This link is invalid");

  let decryptedResetToken = decrypt(admin.resettoken);
  if (token !== decryptedResetToken) return res.status(400).send("Something went wrong. Try again");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  admin.password = hashedPassword;
  admin.resettoken = null;
  await admin.save();
  res.send("Password changed successfully");
});

module.exports = router;
