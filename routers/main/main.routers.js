const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {FilteringSort} = require('../../controllers/main/main.controllers')
const {Createuser} = require('../../controllers/mypage/mypage.controller')



router.get('/',  async(req, res) => {
  const { login_access_token } = req.cookies;
  if (login_access_token) {
    try {
      const { properties } = jwt.verify(login_access_token, process.env.TOKEN);
      const  data = await Createuser(id, properties.nickname, properties.profile_image)
      console.log("있어?",properties)
      res.render('main/main', { data: properties });
    } catch (error) {
      console.log('JWT 토큰 오류야:', error);
      res.render('main/main', { data: null });
    }
  } 
});


router.get('/filter', async (req, res) => { 
  const {index} = req.query;
    console.log("필터링 인덱스", index);
   const data = await FilteringSort(index);
   console.log(data);
   res.json(data);
})



module.exports = router;