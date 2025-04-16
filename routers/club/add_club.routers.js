const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");
const jwt = require("jsonwebtoken")
const {upload} = require("../../lib/multer")

//---------------------- 프론트
// -- 추가페이지
router.get("/", categoryController.checkUserPoint, (req,res)=> {
    const {login_access_token} = req.cookies;
            const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)

    res.render("club/add_club", {data : properties})
})
//--------------------- 백엔드

// -- 카카오 지도 api
router.get('/search', async (req, res) => {
    console.log("나나")
    const { query } = req.query;
    try {
        const response = await axios.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`
                }
            }
        );
        res.json(response.data);
    } catch (err) {
        console.error("Kakao API 에러:", err.response?.data || err.message);
        res.status(500).json({ message: "Kakao API 호출 실패" });
    }
});

// -- 대표, 세부 카테고리 조회
router.get("/categories/main", categoryController.getMainCategories)
router.get("/categories/sub/:mainId", categoryController.getSubCategories)

// -- 동호회 생성
router.post("", upload.single("image"), async (req, res) => {
    try {
        //console.log("서버에 도착한 태그 데이터:", req.body.tags);
        const token = req.cookies.login_access_token;
        if(!token) return res.json({state:400, message : "로그인이 필요합니다."})
        const decoded = jwt.verify(token, process.env.TOKEN);
        const userId = decoded.id;
        console.log("카카오아이디", userId)
        console.log("서브카테고리", req.body.sub_category_id)
        await categoryController.createClub(req, res, userId);
    } catch (err) {
        console.error(err);
        res.json({state : 401 , message : "동호회생성중 오류가 발생했습니다."})
    }
}); 

module.exports = router;