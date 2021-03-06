const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const findAdmin = require("../../utils/findAdmin");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let admin = await findAdmin(userId);

  if (!admin)
    return res.status(400).send("UserId and Password doesn't Match");

  let validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword)
    return res.status(400).send("UserId and Password doesn't Match");

  const token = admin.generateAuthToken(); 
  res.send(token);
});

module.exports = router;
