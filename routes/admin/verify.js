const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/",[auth,adminMiddleware], async (req, res)=>{
    //? to get all unverified hotels
})

router.put("/",[auth,adminMiddleware], async (req, res)=>{
    //? to mark genuine hotels as verified
})

router.delete("/:id",[auth,adminMiddleware],async (req, res)=>{
    //?delete fake registered hotels from database
})

module.exports = router;