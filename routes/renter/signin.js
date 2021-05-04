const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const findRenter = require("../../utils/findRenter");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let renter = await findRenter(userId);

  if (!renter)
    return res
      .status(400)
      .send({property: "userId", msg: "UserId and Password doesn't Match"});

  let validPassword = await bcrypt.compare(req.body.password, renter.password);
  if (!validPassword)
    return res
      .status(400)
      .send({property: "userId", msg: "UserId and Password doesn't Match"});

  const token = renter.generateAuthToken();
  res.send(token);
});

module.exports = router;
