const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {FilteringSort, SubwayFilter, subwayAllFilter, AreaFilter, AreaAllFilter} = require('../../controllers/main/main.controllers')
const path = require('path');
const fs = require('fs');
const {Createuser, Createpoint} = require('../../controllers/mypage/mypage.controllers')


router.get('/', async (req, res) => {
    try{
        const {login_access_token} = req.cookies;
        console.log('main/', login_access_token)
        const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
        await Createuser(id, properties.nickname, properties.profile_image)
        if(login_access_token) {
            await Createpoint(id)
        }
        console.log('done')
        res.render('main/main', {data : properties})
    }
    catch(error) {
        console.log('error')
        res.render('main/main', {data : null})
    }
})


router.get('/filter', async (req, res) => { 
  // console.log("쿼리쿼리쿼리", req.query)
  const {index, local_station} = req.query;
  console.log("필터링 인덱스", index);
   const data = await FilteringSort(index, local_station);
   console.log(data);
   res.json(data);
})


// 지하철역 데이터를 반환하는 API 
router.get('/api/station', async (req, res) => {
  try {
    // const data = fs.readFileSync(staionJsonPath, 'utf-8');
    // res.json(JSON.parse(data));
    const data = await subwayAllFilter();
    const result = { DATA : data};
    res.json(result)
  } catch (error) {
    res.json({state : 406, message: "지하철역 데이터를 조회 실패!", error})
  }
})

// 지하철역 마커를 클릭했을 때 데이터 반환 API
router.get('/station', async(req, res)  => {
  const {index, local_station } = req.query;
  const decodedStation = decodeURIComponent(local_station)
  console.log("123-----", decodedStation)
  // console.log("너넨 누구냐",index, local_station)
  const  data = await SubwayFilter(index, decodedStation);
  console.log("서버에서 반환하는 데이터:", data);
  res.json(data)
})

// 광역 단위 시/군구  데이터를 반환하는 API
router.get('/api/area', async (req, res) => {
  try {
    const data = await AreaAllFilter();
    const result = { features : data};
    res.json(result);
  } catch (error) {
    console.log('[지역단위 JSON 읽기 실패]', error);
    res.json({ state: 400, message: '지역 단위 데이터 조회 실패!', err });
  }
});

// 동호회가 등록된 시/군구 데이터를 반환하는 API
router.get('/area',  async (req, res) => {
  const {wide_regions} = req.query;
  console.log("뭐야야",wide_regions)
  const data = await AreaFilter(wide_regions);
  res.json(data);
})

module.exports = router;
