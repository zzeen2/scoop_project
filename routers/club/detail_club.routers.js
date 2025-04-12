const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");
const jwt = require("jsonwebtoken")
const {upload} = require("../../lib/multer");
const Heart = require("../../models/hearts");
const { Hearts } = require("../../models/configs");
const { where } = require("sequelize");
const { clubDetail, heart } = require("../../controllers/club/detail_club.controllers");


//-------------------- 프론트
// -- 상세페이지 
router.get("/:clubId", clubDetail )
//-------------------- 백엔드
// -- 게시글 불러오기
// router.get('/:clubId', async(req,res))
// -- 찜하기
router.post("/:clubId/heart", heart)

module.exports = router;