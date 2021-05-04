const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const findGuest = require("../../utils/findGuest");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let guest = await findGuest(userId);

  if (!guest) return res.status(400).send({property:"userId",msg:"UserId and Password doesn't Match"});

  let validPassword = await bcrypt.compare(req.body.password, guest.password);
  if (!validPassword)
    return res.status(400).send({property:"userId",msg:"UserId and Password doesn't Match"});
 
  const token = guest.generateAuthToken();
  res.send(token); 
});

module.exports = router;
