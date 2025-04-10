const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");
const jwt = require("jsonwebtoken")
const {upload} = require("../../lib/multer")

//---------------------- 프론트영역
// 추가페이지 렌더링 라우터
router.get("/", (req,res)=> {
    res.render("club/add_club")
})


//--------------------- 백엔드

// 카카오 지도 api
const KAKAO_API_KEY = "d130d72a2b47214381f8a6e9caa7aa24";

router.get('/search', async (req, res) => {
    console.log("나나")
    const { query } = req.query;

    try {
        const response = await axios.get(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_API_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error("Kakao API 에러:", err.response?.data || err.message);
        res.status(500).json({ message: "Kakao API 호출 실패" });
    }
});

// 대표, 세부 카테고리 조회
router.get("/categories/main", categoryController.getMainCategories)
router.get("/categories/sub/:mainId", categoryController.getSubCategories)


// 동호회 생성
// router.post("/create", upload.single("image"), async (req, res) => {
//     try {
//         const token = req.cookies.login_access_token;
//         if (!token) return res.status(401).json({ message: "로그인 필요" });

//         const decoded = jwt.verify(token, process.env.TOKEN);
//         const userId = decoded.id;

//         await createClub(req, res, userId);
//     } catch (err) {
//         console.error("토큰 검증 실패:", err);
//         res.status(401).json({ message: "토큰 오류" });
//     }
// });

router.post("", upload.single("image"), async (req, res) => {
    console.log("dfdfsdf")
    try {
        console.log("서버에 도착한 태그 데이터:", req.body.tags);
        // const token = req.cookies.login_access_token;
        let userId = "temporary_test_user"; 

        // if (token) {
        //     const decoded = jwt.verify(token, process.env.TOKEN);
        //     userId = decoded.id; 
        // }

        await categoryController.createClub(req, res, userId);
    } catch (err) {
        console.error("토큰 검증 실패:", err);
        await categoryController.createClub(req, res, "temporary_test_user");
    }
}); 

module.exports = router;