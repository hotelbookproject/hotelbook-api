const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const renterMiddleware = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateRoom, Room} = require("../../models/room");
const findRenter = require("../../utils/findRenter");

router.post("/",[auth, renterMiddleware,validate(validateRoom)],async (req, res)=>{
    
})