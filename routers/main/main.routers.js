const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {FilteringSort} = require('../../controllers/main/main.controllers')
const {Createuser} = require('../../controllers/mypage/mypage.controllers')



router.get('/', async (req, res) => {
    try{
        
        const {login_access_token} = req.cookies;
        const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
        console.log('done', id, properties.nickname, properties.profile_image)
        const data = await Createuser(id, properties.nickname, properties.profile_image)
        console.log('done')
        res.render('main/main', {data : properties, uuid : id})
  
    }
    catch(error) {
        console.log('error')
        res.render('main/main', {data : null})
    }
})


router.get('/filter', async (req, res) => { 
  console.log("쿼리쿼리쿼리", req.query)
  const {index} = req.query;
  console.log("필터링 인덱스", index);
   const data = await FilteringSort(index);
   console.log(data);
   res.json(data);
})



module.exports = router;