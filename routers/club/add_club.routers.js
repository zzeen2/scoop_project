const router = require("express").Router();
const axios = require('axios');
const categoryController = require("../../controllers/club/add_club.controllers");


//---------------------- 프론트영역
// 추가페이지 렌더링 라우터
router.get("/create", (req,res)=> {
    res.render("club/add_club")
})


//--------------------- 백엔드

// 카카오 지도 api
const KAKAO_API_KEY = "d130d72a2b47214381f8a6e9caa7aa24";

router.get('/search', async (req, res) => {
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

module.exports = router;