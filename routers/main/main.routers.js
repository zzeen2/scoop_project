const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {FilteringSort, SidebarSort} = require('../../controllers/main/main.controllers')
const path = require('path');
const fs = require('fs');


const areaJsonPath = path.join(__dirname, '..', '..', 'views', 'main', 'Area.json');
const wideAreaJsonPath = path.join(__dirname, '..', '..', 'views', 'main', 'Widearea.json');


router.get('/',  async(req, res) => {
  try {
    const sidebarData = await SidebarSort();
    res.render('main/main', {data : sidebarData.categoryData || [] })
  } catch (error) {
    res.json({state : 404, message : "메인페이지 렌더링 오류", error})
  }
});



router.get('/filter', async (req, res) => { 
  // console.log("쿼리쿼리쿼리", req.query)
  const {index} = req.query;
  console.log("필터링 인덱스", index);
   const data = await FilteringSort(index);
   console.log(data);
   res.json(data);
})

// 지역 단위 데이터를 반환하는 API
router.get('/api/area', (req, res) => {
  try {
    const data = fs.readFileSync(areaJsonPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('[지역단위 JSON 읽기 실패]', err);
    res.json({ state: 400, message: '지역 단위 데이터 조회 실패!', err });
  }
});

// 광역 단위 데이터를 반환하는 API
router.get('/api/widearea', (req, res) => {
  try {
    const data = fs.readFileSync(wideAreaJsonPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json({state: 404 , message: '광역 단위 데이터를 조회 실패!',  err });
  }
});




module.exports = router;