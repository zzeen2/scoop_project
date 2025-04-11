const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");
const jwt = require("jsonwebtoken")
const {upload} = require("../../lib/multer")

//-------------------- 프론트
router.get("/", (req,res)=> {
    res.render("/")
})
//-------------------- 백엔드
