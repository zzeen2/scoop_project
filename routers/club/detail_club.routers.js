const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");
const jwt = require("jsonwebtoken")
const {upload} = require("../../lib/multer");
const Heart = require("../../models/hearts");
const { Hearts } = require("../../models/configs");
const { where } = require("sequelize");
const { clubDetail, heart, participateInEvent, postReview, getUserIdFromToken,addMember } = require("../../controllers/club/detail_club.controllers");


//-------------------- 프론트
// -- 상세페이지 
router.get("/:clubId", clubDetail )
//-------------------- 백엔드
// -- 로그인 확인
router.post("/login", getUserIdFromToken )
// -- 찜하기
router.post("/:clubId/heart", heart)
// -- 참여자
router.post('/events/:eventId/participate', participateInEvent);
// -- 리뷰 
router.post('/:clubId/reviews', postReview);
// -- 가입신청
router.post('/:clubId/member',addMember )

module.exports = router;